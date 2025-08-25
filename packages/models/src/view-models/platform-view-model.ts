import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const PlatformSuccessSchema = z.object({
    id: z.string().or(z.number()),
    name: z.string(),
    logoUrl: z.string(),
    backgroundImageUrl: z.string(),
    footerContent: z.string(),
});

export type TPlatformSuccess = z.infer<typeof PlatformSuccessSchema>;

const PlatformDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", PlatformSuccessSchema)
const PlatformKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})))

export const PlatformViewModelSchemaMap = {
    default: PlatformDefaultViewModelSchema,
    kaboom: PlatformKaboomViewModelSchema,
};
export type TPlatformViewModelSchemaMap = typeof PlatformViewModelSchemaMap;
export const PlatformViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PlatformViewModelSchemaMap);
export type TPlatformViewModel = z.infer<typeof PlatformViewModelSchema>;
