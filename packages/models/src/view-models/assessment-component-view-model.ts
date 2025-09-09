import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveAssessmentComponentsSuccessResponseSchema } from '../usecase-models/save-assessment-components-usecase-models';

export const AssessmentComponentSuccessSchema = SaveAssessmentComponentsSuccessResponseSchema.shape.data;

export type TAssessmentComponentSuccess = z.infer<typeof AssessmentComponentSuccessSchema>;

const AssessmentComponentDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentComponentSuccessSchema);
const AssessmentComponentKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const AssessmentComponentViewModelSchemaMap = {
    default: AssessmentComponentDefaultViewModelSchema,
    kaboom: AssessmentComponentKaboomViewModelSchema,
};
export type TAssessmentComponentViewModelSchemaMap = typeof AssessmentComponentViewModelSchemaMap;
export const AssessmentComponentViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentComponentViewModelSchemaMap);
export type TAssessmentComponentViewModel = z.infer<typeof AssessmentComponentViewModelSchema>;
