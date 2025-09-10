import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetHomePageSuccessResponseSchema } from '../usecase-models/get-home-page-usecase-models';

export const HomePageSchema = GetHomePageSuccessResponseSchema.shape.data;
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
 *   - `videoId`: The ID of the associated video.
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

const HomePageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", HomePageSchema)
const HomePageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const HomePageViewModelSchemaMap = {
    default: HomePageDefaultViewModelSchema,
    kaboom: HomePageKaboomViewModelSchema,
};
export type THomePageViewModelSchemaMap = typeof HomePageViewModelSchemaMap;
export const HomePageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(HomePageViewModelSchemaMap);
export type THomePageViewModel = z.infer<typeof HomePageViewModelSchema>;
