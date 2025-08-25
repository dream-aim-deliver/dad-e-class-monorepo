import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SubmitAssessmentProgressSuccessResponseSchema } from '../usecase-models/submit-assessment-progress-usecase-models';

export const AssessmentProgressSuccessSchema = SubmitAssessmentProgressSuccessResponseSchema.shape.data;

export type TAssessmentProgressSuccess = z.infer<typeof AssessmentProgressSuccessSchema>;

const AssessmentProgressDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentProgressSuccessSchema);
const AssessmentProgressKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const AssessmentProgressInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const AssessmentProgressViewModelSchemaMap = {
    default: AssessmentProgressDefaultViewModelSchema,
    kaboom: AssessmentProgressKaboomViewModelSchema,
    invalid: AssessmentProgressInvalidViewModelSchema,
};
export type TAssessmentProgressViewModelSchemaMap = typeof AssessmentProgressViewModelSchemaMap;
export const AssessmentProgressViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentProgressViewModelSchemaMap);
export type TAssessmentProgressViewModel = z.infer<typeof AssessmentProgressViewModelSchema>;
