import { HomePageSchema, THomePage, HomeBannerSchema, THomeBanner, GeneralCardSchema, TGeneralCard, CoachingOnDemandSchema, TCoachingOnDemand, AccordionListSchema, TAccordionList } from '../src/home-page';
import { describe, it, expect } from 'vitest';


describe('HomePage Schema Validation', () => {

    it('should validate a valid home page object', () => {
        const validHomePage: THomePage = {
            banner: {
                title: 'Platform\'s Title, short and powerful',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                videoId: '12345',
                thumbnailUrl: 'https://example.com/banner.jpg',
            },
            carousel: [
                {
                    title: 'Visualisierung',
                    description: 'Du hast ein Konzept und konkrete Vorstellungen, wie dein Projekt aussehen soll, aber du weißt nicht, wie du es umsetzen sollst? Wir helfen dir, dein Projekt zu visualisieren und umzusetzen.',
                    imageUrl: 'https://example.com/card1.jpg',
                    buttonText: 'ab CHF 3000',
                    buttonUrl: 'https://example.com/card1',
                    badge: 'Package',
                },
                {
                    title: 'Enterprise',
                    description: 'Ideal für Unternehmen, die eine individuelle Lösung benötigen und Wert auf Qualität und Nachhaltigkeit legen.',
                    imageUrl: 'https://example.com/card2.jpg',
                    buttonText: 'Learn More',
                    buttonUrl: 'https://example.com/card2',
                },
            ],
            coachingOnDemand: {
                title: 'Coaching On Demand',
                description: 'Are you looking for someone to help guide you through your journey?\nDo you need support and advice from someone who has been there before?\nOur coaching on demand service is here to help you!',
                desktopImageUrl: 'https://example.com/coaching-desktop.jpg',
                tabletImageUrl: 'https://example.com/coaching-tablet.jpg',
                mobileImageUrl: 'https://example.com/coaching-mobile.jpg',
            },
            accordion: {
                title: 'Frequently Asked Questions',
                showNumbers: true,
                items: [
                    {
                        title: 'Matching',
                        content: 'Some content about matching.',
                        position: 1,
                        iconImageUrl: 'https://example.com/question1.jpg',
                    },
                    {
                        title: 'Geführt zum Ziel',
                        content: 'Some content about geführt zum ziel.',
                        position: 2,
                        iconImageUrl: 'https://example.com/question2.jpg',
                    },
                ],
            },
        };
        expect(HomePageSchema.safeParse(validHomePage).success).toBe(true);
    });


    it('should invalidate a home banner object with missing required fields', () => {
        const invalidHomeBanner: THomeBanner = {
            title: 'Platform\'s Title, short and powerful',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            // Missing 'videoId'
            thumbnailUrl: 'https://example.com/banner.jpg',
        };
        expect(HomeBannerSchema.safeParse(invalidHomeBanner).success).toBe(false);
    });

    it('should invalidate a general card object with missing required fields', () => {
        const invalidGeneralCard: TGeneralCard = {
            title: 'Enterprise',
            description: 'Ideal für Unternehmen, die eine individuelle Lösung benötigen und Wert auf Qualität und Nachhaltigkeit legen.',
            imageUrl: 'https://example.com/card2.jpg',
            buttonText: 'Learn More',
            // Missing 'buttonUrl'
        };
        expect(GeneralCardSchema.safeParse(invalidGeneralCard).success).toBe(false);
    });

    it('should invalidate a coaching on demand object with missing required fields', () => {
        const invalidCoachingOnDemand: TCoachingOnDemand = {
            title: 'Coaching On Demand',
            description: 'Are you looking for someone to help guide you through your journey?\nDo you need support and advice from someone who has been there before?\nOur coaching on demand service is here to help you!',
            desktopImageUrl: 'https://example.com/coaching-desktop.jpg',
            tabletImageUrl: 'https://example.com/coaching-tablet.jpg',
            // Missing 'mobileImageUrl'
        };
        expect(CoachingOnDemandSchema.safeParse(invalidCoachingOnDemand).success).toBe(false);
    });

    it('should invalidate an accordion list object with missing required fields', () => {
        const invalidAccordionList: TAccordionList = {
            title: 'Frequently Asked Questions',
            showNumbers: true,
            // Missing 'items'
        };
        expect(AccordionListSchema.safeParse(invalidAccordionList).success).toBe(false);
    });

    it('should validate an accordion list object with an empty array of items', () => {
        const invalidAccordionList: TAccordionList = {
            title: 'Frequently Asked Questions',
            showNumbers: true,
            items: [],
        };
        expect(AccordionListSchema.safeParse(invalidAccordionList).success).toBe(true);
    });

});
