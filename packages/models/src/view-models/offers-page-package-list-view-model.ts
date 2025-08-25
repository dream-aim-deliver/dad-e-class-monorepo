import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ListOffersPagePackagesSuccessResponseSchema } from '../usecase-models/list-offers-page-packages-usecase-models';

export const OffersPagePackageListSuccessSchema =
    ListOffersPagePackagesSuccessResponseSchema.shape.data;

export type TOffersPagePackageListSuccess = z.infer<
    typeof OffersPagePackageListSuccessSchema
>;

const OffersPagePackageListDefaultViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'default',
        OffersPagePackageListSuccessSchema,
    );
const OffersPagePackageListKaboomViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'kaboom',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );
const OffersPagePackageListNotFoundViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'not-found',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

export const OffersPagePackageListViewModelSchemaMap = {
    default: OffersPagePackageListDefaultViewModelSchema,
    kaboom: OffersPagePackageListKaboomViewModelSchema,
    notFound: OffersPagePackageListNotFoundViewModelSchema,
};
export type TOffersPagePackageListViewModelSchemaMap =
    typeof OffersPagePackageListViewModelSchemaMap;
export const OffersPagePackageListViewModelSchema =
    BaseViewModelDiscriminatedUnionSchemaFactory(
        OffersPagePackageListViewModelSchemaMap,
    );
export type TOffersPagePackageListViewModel = z.infer<
    typeof OffersPagePackageListViewModelSchema
>;
