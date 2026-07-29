import { MetadataRoute } from 'next'
import { features } from '@/data/features'
import { useCases } from '@/data/use-cases'
import { integrations } from '@/data/integrations'
import { alternatives } from '@/data/alternatives'

/**
 * Real content dates, deliberately not `new Date()`.
 *
 * Using the current date stamps every URL as modified on every build. Google
 * then learns that lastModified here is meaningless and starts discounting it,
 * which costs us the one signal that matters when asking for a recrawl after a
 * rewrite. These are the actual dates the underlying content last changed.
 *
 * Bump the relevant constant whenever you edit that content.
 */
const HOME_UPDATED = new Date('2026-07-28')     // pricing-modal repositioning
const DOCS_UPDATED = new Date('2026-07-27')     // abandoned/cancel event docs
const CONTENT_UPDATED = new Date('2026-07-26')  // features/use-cases/integrations/alternatives
const AUTH_UPDATED = new Date('2025-12-20')
const LEGAL_UPDATED = new Date('2026-07-28')  // privacy + terms rewritten for the pivot

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://feedinbox.com'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: HOME_UPDATED,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/docs`,
            lastModified: DOCS_UPDATED,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: AUTH_UPDATED,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: LEGAL_UPDATED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: LEGAL_UPDATED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Feature index page
    const featureIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/features`,
            lastModified: CONTENT_UPDATED,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Feature pages
    const featurePages: MetadataRoute.Sitemap = features.map((feature) => ({
        url: `${baseUrl}/features/${feature.slug}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Use case index page
    const useCaseIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/use-cases`,
            lastModified: CONTENT_UPDATED,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Use case pages
    const useCasePages: MetadataRoute.Sitemap = useCases.map((useCase) => ({
        url: `${baseUrl}/use-cases/${useCase.slug}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Integration index page
    const integrationIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/integrations`,
            lastModified: CONTENT_UPDATED,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Integration pages
    const integrationPages: MetadataRoute.Sitemap = integrations.map((integration) => ({
        url: `${baseUrl}/integrations/${integration.slug}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Alternative index page
    const alternativeIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified: CONTENT_UPDATED,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Alternative pages
    const alternativePages: MetadataRoute.Sitemap = alternatives.map((alternative) => ({
        url: `${baseUrl}/alternatives/${alternative.slug}`,
        lastModified: CONTENT_UPDATED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [
        ...staticPages,
        ...featureIndexPage,
        ...featurePages,
        ...useCaseIndexPage,
        ...useCasePages,
        ...integrationIndexPage,
        ...integrationPages,
        ...alternativeIndexPage,
        ...alternativePages,
    ]
}
