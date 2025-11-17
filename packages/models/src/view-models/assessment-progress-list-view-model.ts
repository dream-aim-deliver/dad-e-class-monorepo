import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListAssessmentProgressesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const AssessmentProgressListSuccessSchema = ListAssessmentProgressesSuccessResponseSchema.shape.data;

export type TAssessmentProgressListSuccess = z.infer<typeof AssessmentProgressListSuccessSchema>;

const AssessmentProgressListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentProgressListSuccessSchema);
const AssessmentProgressListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const AssessmentProgressListViewModelSchemaMap = {
    default: AssessmentProgressListDefaultViewModelSchema,
    kaboom: AssessmentProgressListKaboomViewModelSchema,
};
export type TAssessmentProgressListViewModelSchemaMap = typeof AssessmentProgressListViewModelSchemaMap;
export const AssessmentProgressListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentProgressListViewModelSchemaMap);
export type TAssessmentProgressListViewModel = z.infer<typeof AssessmentProgressListViewModelSchema>;
