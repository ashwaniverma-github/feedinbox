import { prisma } from "./prisma";

/**
 * Tier limits configuration
 */
export const TIER_LIMITS = {
    free: {
        maxProjects: 1,
        maxFeedbacksPerMonth: 20,
        canRemoveBranding: false,
        canCustomizeColors: false,
        canExportCsv: false,
    },
    pro: {
        maxProjects: Infinity,
        maxFeedbacksPerMonth: 1000,
        canRemoveBranding: true,
        canCustomizeColors: true,
        canExportCsv: true,
    },
} as const;

export type TierType = "free" | "pro";

/**
 * Check if a user has an active Pro subscription
 */
export async function isPro(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    }) as any;

    return user?.dodoSubscriptionStatus === "active";
}

/**
 * Get user's tier type
 */
export async function getUserTier(userId: string): Promise<TierType> {
    return (await isPro(userId)) ? "pro" : "free";
}

/**
 * Get user's tier limits
 */
export async function getUserLimits(userId: string) {
    const tier = await getUserTier(userId);
    return TIER_LIMITS[tier];
}

/**
 * Count user's current projects
 */
export async function getProjectCount(userId: string): Promise<number> {
    return prisma.project.count({
        where: { userId },
    });
}

/**
 * Get monthly feedback count for a user's projects
 * Counts all feedbacks received in the current calendar month
 */
export async function getMonthlyFeedbackCount(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const count = await prisma.feedback.count({
        where: {
            project: {
                userId: userId,
            },
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    });

    return count;
}

/**
 * Get combined monthly response count (feedback + exit-intent responses).
 * Both share the same monthly cap, so both are counted together.
 */
export async function getMonthlyResponseCount(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const where = {
        project: { userId },
        createdAt: { gte: startOfMonth, lte: endOfMonth },
    };

    const [feedbackCount, intentCount] = await Promise.all([
        prisma.feedback.count({ where }),
        prisma.intentResponse.count({ where }),
    ]);

    return feedbackCount + intentCount;
}

/**
 * Check if user can create a new project
 */
export async function canCreateProject(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    currentCount?: number;
    maxAllowed?: number;
}> {
    const [isPremium, projectCount] = await Promise.all([
        isPro(userId),
        getProjectCount(userId),
    ]);

    const limits = isPremium ? TIER_LIMITS.pro : TIER_LIMITS.free;

    if (projectCount >= limits.maxProjects) {
        return {
            allowed: false,
            reason: "Project limit reached. Upgrade to Pro for unlimited projects.",
            currentCount: projectCount,
            maxAllowed: limits.maxProjects,
        };
    }

    return { allowed: true, currentCount: projectCount, maxAllowed: limits.maxProjects };
}

/**
 * Check if user can receive more feedback this month
 */
export async function canReceiveFeedback(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    currentCount?: number;
    maxAllowed?: number;
}> {
    const [isPremium, responseCount] = await Promise.all([
        isPro(userId),
        getMonthlyResponseCount(userId),
    ]);

    const limits = isPremium ? TIER_LIMITS.pro : TIER_LIMITS.free;

    if (responseCount >= limits.maxFeedbacksPerMonth) {
        return {
            allowed: false,
            reason: "Monthly feedback limit reached. Upgrade to Pro for more submissions.",
            currentCount: responseCount,
            maxAllowed: limits.maxFeedbacksPerMonth,
        };
    }

    return { allowed: true, currentCount: responseCount, maxAllowed: limits.maxFeedbacksPerMonth };
}

/**
 * Check if a project owner can receive more exit-intent responses this month.
 * Exit-intent responses share the same monthly cap as feedback.
 */
export async function canReceiveIntentResponse(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    currentCount?: number;
    maxAllowed?: number;
}> {
    const [isPremium, responseCount] = await Promise.all([
        isPro(userId),
        getMonthlyResponseCount(userId),
    ]);

    const limits = isPremium ? TIER_LIMITS.pro : TIER_LIMITS.free;

    if (responseCount >= limits.maxFeedbacksPerMonth) {
        return {
            allowed: false,
            reason: "Monthly response limit reached. Upgrade to Pro for more submissions.",
            currentCount: responseCount,
            maxAllowed: limits.maxFeedbacksPerMonth,
        };
    }

    return { allowed: true, currentCount: responseCount, maxAllowed: limits.maxFeedbacksPerMonth };
}

/**
 * Get usage summary for a user
 */
export async function getUsageSummary(userId: string) {
    const [isPremium, projectCount, feedbackCount] = await Promise.all([
        isPro(userId),
        getProjectCount(userId),
        getMonthlyFeedbackCount(userId),
    ]);

    const tier = isPremium ? "pro" : "free";
    const limits = TIER_LIMITS[tier];

    return {
        tier,
        isPro: isPremium,
        projects: {
            current: projectCount,
            max: limits.maxProjects,
            remaining: Math.max(0, limits.maxProjects - projectCount),
        },
        feedbacksThisMonth: {
            current: feedbackCount,
            max: limits.maxFeedbacksPerMonth,
            remaining: Math.max(0, limits.maxFeedbacksPerMonth - feedbackCount),
        },
        features: {
            canRemoveBranding: limits.canRemoveBranding,
            canCustomizeColors: limits.canCustomizeColors,
            canExportCsv: limits.canExportCsv,
        },
    };
}
