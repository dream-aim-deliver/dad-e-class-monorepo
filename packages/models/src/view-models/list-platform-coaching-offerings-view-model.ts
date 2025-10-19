import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPlatformCoachingOfferingsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPlatformCoachingOfferingsSuccessSchema = ListPlatformCoachingOfferingsSuccessResponseSchema.shape.data;
export type TListPlatformCoachingOfferingsSuccess = z.infer<typeof ListPlatformCoachingOfferingsSuccessSchema>;

// Define view mode schemas
const ListPlatformCoachingOfferingsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPlatformCoachingOfferingsSuccessSchema
);

const ListPlatformCoachingOfferingsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPlatformCoachingOfferingsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPlatformCoachingOfferingsViewModelSchemaMap = {
    default: ListPlatformCoachingOfferingsDefaultViewModelSchema,
    kaboom: ListPlatformCoachingOfferingsKaboomViewModelSchema,
    notFound: ListPlatformCoachingOfferingsNotFoundViewModelSchema,
};
export type TListPlatformCoachingOfferingsViewModelSchemaMap = typeof ListPlatformCoachingOfferingsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPlatformCoachingOfferingsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPlatformCoachingOfferingsViewModelSchemaMap);
export type TListPlatformCoachingOfferingsViewModel = z.infer<typeof ListPlatformCoachingOfferingsViewModelSchema>;
