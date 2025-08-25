import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListAssessmentProgressesSuccessResponseSchema } from '../usecase-models/list-assessment-progresses-usecase-models';

export const AssessmentProgressListSuccessSchema = ListAssessmentProgressesSuccessResponseSchema.shape.data;

export type TAssessmentProgressListSuccess = z.infer<typeof AssessmentProgressListSuccessSchema>;

const AssessmentProgressListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentProgressListSuccessSchema);
const AssessmentProgressListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const AssessmentProgressListViewModelSchemaMap = {
    default: AssessmentProgressListDefaultViewModelSchema,
    kaboom: AssessmentProgressListKaboomViewModelSchema,
};
export type TAssessmentProgressListViewModelSchemaMap = typeof AssessmentProgressListViewModelSchemaMap;
export const AssessmentProgressListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentProgressListViewModelSchemaMap);
export type TAssessmentProgressListViewModel = z.infer<typeof AssessmentProgressListViewModelSchema>;
