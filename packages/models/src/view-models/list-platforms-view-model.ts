import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPlatformsSuccessResponseSchema } from '../usecase-models/list-platforms-usecase-models';

export const PlatformListSuccessSchema = ListPlatformsSuccessResponseSchema.shape.data;

export type TPlatformListSuccess = z.infer<typeof PlatformListSuccessSchema>;

const PlatformListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", PlatformListSuccessSchema)
const PlatformListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const PlatformListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const PlatformListViewModelSchemaMap = {
    default: PlatformListDefaultViewModelSchema,
    kaboom: PlatformListKaboomViewModelSchema,
    notFound: PlatformListNotFoundViewModelSchema,
};
export type TPlatformListViewModelSchemaMap = typeof PlatformListViewModelSchemaMap;
export const PlatformListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PlatformListViewModelSchemaMap);
export type TPlatformListViewModel = z.infer<typeof PlatformListViewModelSchema>;