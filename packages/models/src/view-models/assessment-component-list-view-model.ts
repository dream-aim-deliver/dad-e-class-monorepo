import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListAssessmentComponentsSuccessResponseSchema } from '../usecase-models/list-assessment-components-usecase-models';

export const AssessmentComponentListSuccessSchema = ListAssessmentComponentsSuccessResponseSchema.shape.data;

export type TAssessmentComponentListSuccess = z.infer<typeof AssessmentComponentListSuccessSchema>;

const AssessmentComponentListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", AssessmentComponentListSuccessSchema);
const AssessmentComponentListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const AssessmentComponentListViewModelSchemaMap = {
    default: AssessmentComponentListDefaultViewModelSchema,
    kaboom: AssessmentComponentListKaboomViewModelSchema,
};
export type TAssessmentComponentListViewModelSchemaMap = typeof AssessmentComponentListViewModelSchemaMap;
export const AssessmentComponentListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AssessmentComponentListViewModelSchemaMap);
export type TAssessmentComponentListViewModel = z.infer<typeof AssessmentComponentListViewModelSchema>;
