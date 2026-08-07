import { auth } from "@/lib/auth";
import { Metadata } from "next";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import { Mail, ArrowRight } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Questions, feedback, bug reports, or partnership enquiries. Reach Feedinbox by email or on X. Every message is read.",
    alternates: { canonical: "https://feedinbox.com/contact" },
};

const X_HANDLE = "ashwanivermax";

const WHAT_TO_SEND = [
    {
        heading: "Feedback",
        items: [
            "Feature requests and ideas",
            "Bug reports",
            "UI and UX suggestions",
            "Integration or install trouble",
        ],
    },
    {
        heading: "Anything else",
        items: [
            "How you use Feedinbox",
            "Press and partnerships",
            "Billing or account help",
            "Just to say hi",
        ],
    },
];

export default async function ContactPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
                <h1 className="font-heading text-[clamp(2.25rem,7vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                    Get in <span className="text-red-500">touch</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
                    Questions, feedback, bug reports, or just want to say hello? Every message
                    gets read.
                </p>

                {/* Channels */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                    <ChannelCard
                        label="Email"
                        icon={<Mail className="h-5 w-5" />}
                        value={SUPPORT_EMAIL}
                        description="Support, billing, and product feedback. The best place for anything that needs detail."
                        cta="Send a message"
                        href={`mailto:${SUPPORT_EMAIL}`}
                    />
                    <ChannelCard
                        label="X"
                        icon={
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden="true">
                                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.3-8.3L2 2h6.5l4.4 5.9L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
                            </svg>
                        }
                        value={`@${X_HANDLE}`}
                        description="Quickest for short questions. Also where new features and build-in-public updates get posted."
                        cta="Follow and DM"
                        href={`https://x.com/${X_HANDLE}`}
                        external
                    />
                </div>

                <hr className="my-16 border-neutral-200" />

                {/* What to send */}
                <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    What to send
                </h2>
                <div className="mt-8 grid gap-10 sm:grid-cols-2">
                    {WHAT_TO_SEND.map((group) => (
                        <div key={group.heading}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                                {group.heading}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {group.items.map((item) => (
                                    <li key={item} className="text-neutral-600">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Self-serve nudge, so people who just need the docs are not waiting on a reply */}
                <div className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <p className="text-neutral-700">
                        <span className="font-semibold text-neutral-900">Setting up?</span> The{" "}
                        <a href="/docs" className="font-medium text-red-500 underline underline-offset-2">
                            install guide
                        </a>{" "}
                        covers the script tag, the events, and the common gotchas. Your AI coding
                        agent can read{" "}
                        <a href="/llms.txt" className="font-medium text-red-500 underline underline-offset-2">
                            /llms.txt
                        </a>{" "}
                        and wire it up for you.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ChannelCard({
    label,
    icon,
    value,
    description,
    cta,
    href,
    external,
}: {
    label: string;
    icon: React.ReactNode;
    value: string;
    description: string;
    cta: string;
    href: string;
    external?: boolean;
}) {
    return (
        <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5"
        >
            <div className="flex items-center gap-2.5 text-red-500">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {label}
                </span>
            </div>
            <p className="mt-4 text-lg font-semibold break-words text-neutral-900">{value}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
        </a>
    );
}
