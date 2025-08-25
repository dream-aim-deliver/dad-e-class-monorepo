import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SubmitAssessmentProgressSuccessResponseSchema } from '../usecase-models/submit-assessment-progress-usecase-models';

export const AssessmentProgressSuccessSchema = SubmitAssessmentProgressSuccessResponseSchema.shape.data;

export type TAssessmentProgressSuccess = z.infer<typeof AssessmentProgressSuccessSchema>;

const AssessmentProgressDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentProgressSuccessSchema);
const AssessmentProgressKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const AssessmentProgressInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const AssessmentProgressViewModelSchemaMap = {
    default: AssessmentProgressDefaultViewModelSchema,
    kaboom: AssessmentProgressKaboomViewModelSchema,
    invalid: AssessmentProgressInvalidViewModelSchema,
};
export type TAssessmentProgressViewModelSchemaMap = typeof AssessmentProgressViewModelSchemaMap;
export const AssessmentProgressViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentProgressViewModelSchemaMap);
export type TAssessmentProgressViewModel = z.infer<typeof AssessmentProgressViewModelSchema>;
