import { z } from 'zod'

export const HomeBannerSchema = z.object({
    title: z.string(),
    description: z.string(),
    videoId: z.string(),
    thumbnailUrl: z.string().optional(),
});
/**
 * Schema for a home banner.
 *
 * This schema defines the structure of the home banner object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `title`: The title of the banner.
 * - `description`: A brief description of the banner.
 * - `videoId`: The numeric ID of the associated video.
 * - `thumbnailUrl`: The URL of the banner's thumbnail image.
 */
export type THomeBanner = z.infer<typeof HomeBannerSchema>;

export const GeneralCardSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    buttonText: z.string(),
    buttonUrl: z.string(),
    badge: z.string().optional(),
});
/**
 * Schema for a general card.
 *
 * This schema defines the structure of the general card object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `title`: The title of the card.
 * - `description`: A brief description of the card.
 * - `imageUrl`: The URL of the card’s image.
 * - `buttonText`: The text displayed on the card’s button.
 * - `buttonUrl`: The URL the button links to.
 * - `badge` (optional): A badge label for the card.
 */
export type TGeneralCard = z.infer<typeof GeneralCardSchema>;

export const CoachingOnDemandSchema = z.object({
    title: z.string(),
    description: z.string(),
    desktopImageUrl: z.string(),
    tabletImageUrl: z.string(),
    mobileImageUrl: z.string(),
});
/**
 * Schema for the coaching on demand section.
 *
 * This schema defines the structure of the coaching on demand object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `title`: The title of the section.
 * - `description`: A brief description of the section.
 * - `desktopImageUrl`: The image URL for desktop view.
 * - `tabletImageUrl`: The image URL for tablet view.
 * - `mobileImageUrl`: The image URL for mobile view.
 */
export type TCoachingOnDemand = z.infer<typeof CoachingOnDemandSchema>;

export const AccordionItemSchema = z.object({
    title: z.string(),
    content: z.string(),
    position: z.number(),
    iconImageUrl: z.string(),
});
/**
 * Schema for an accordion item.
 *
 * This schema defines the structure of the accordion item object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `title`: The title of the accordion item.
 * - `content`: The content inside the accordion item.
 * - `position`: The position/order of the item.
 * - `iconImageUrl`: The URL of the associated icon.
 */
export type TAccordionItem = z.infer<typeof AccordionItemSchema>;

export const AccordionListSchema = z.object({
    title: z.string(),
    showNumbers: z.boolean(),
    items: z.array(AccordionItemSchema),
});
/**
 * Schema for an accordion list.
 *
 * This schema defines the structure of the accordion list object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `title`: The title of the accordion list.
 * - `showNumbers`: A boolean indicating whether to show numbering.
 * - `items`: An array of accordion items.
 */
export type TAccordionList = z.infer<typeof AccordionListSchema>;

export const HomePageSchema = z.object({
    banner: HomeBannerSchema,
    carousel: z.array(GeneralCardSchema),
    coachingOnDemand: CoachingOnDemandSchema,
    accordion: AccordionListSchema,
});

/**
 * Schema for the home page.
 *
 * This schema defines the structure of the home page object, ensuring all required
 * properties are present with their expected types.
 *
 * Properties:
 * - `banner`: An object representing the home page banner, containing:
 *   - `title`: The title of the banner.
 *   - `description`: A brief description of the banner.
 *   - `videoId`: The numeric ID of the associated video.
 *   - `thumbnailUrl`: The URL of the banner's thumbnail image.
 * - `carousel`: An array of general card objects, each containing:
 *   - `title`: The title of the card.
 *   - `description`: A brief description of the card.
 *   - `imageUrl`: The URL of the card’s image.
 *   - `buttonText`: The text displayed on the card’s button.
 *   - `buttonUrl`: The URL the button links to.
 *   - `badge` (optional): A badge label for the card.
 * - `coachingOnDemand`: An object representing the coaching on demand section, containing:
 *   - `title`: The title of the section.
 *   - `description`: A brief description of the section.
 *   - `desktopImageUrl`: The image URL for desktop view.
 *   - `tabletImageUrl`: The image URL for tablet view.
 *   - `mobileImageUrl`: The image URL for mobile view.
 * - `accordion`: An object representing an accordion list, containing:
 *   - `title`: The title of the accordion list.
 *   - `showNumbers`: A boolean indicating whether to show numbering.
 *   - `items`: An array of accordion items, each containing:
 *     - `title`: The title of the accordion item.
 *     - `content`: The content inside the accordion item.
 *     - `position`: The position/order of the item.
 *     - `iconImageUrl`: The URL of the associated icon.
 */

export type THomePage = z.infer<typeof HomePageSchema>;
