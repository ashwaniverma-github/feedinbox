import { MetadataRoute } from 'next'
import { features } from '@/data/features'
import { useCases } from '@/data/use-cases'
import { integrations } from '@/data/integrations'
import { alternatives } from '@/data/alternatives'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://feedinbox.com'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/docs`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Feature index page
    const featureIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/features`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Feature pages
    const featurePages: MetadataRoute.Sitemap = features.map((feature) => ({
        url: `${baseUrl}/features/${feature.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Use case index page
    const useCaseIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/use-cases`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Use case pages
    const useCasePages: MetadataRoute.Sitemap = useCases.map((useCase) => ({
        url: `${baseUrl}/use-cases/${useCase.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Integration index page
    const integrationIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/integrations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Integration pages
    const integrationPages: MetadataRoute.Sitemap = integrations.map((integration) => ({
        url: `${baseUrl}/integrations/${integration.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Alternative index page
    const alternativeIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Alternative pages
    const alternativePages: MetadataRoute.Sitemap = alternatives.map((alternative) => ({
        url: `${baseUrl}/alternatives/${alternative.slug}`,
        lastModified: new Date(),
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
