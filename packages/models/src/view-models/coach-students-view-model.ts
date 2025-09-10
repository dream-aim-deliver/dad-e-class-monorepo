import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachStudentsSuccessResponseSchema } from '../usecase-models/list-coach-students-usecase-models';

export const CoachStudentsSuccessSchema = ListCoachStudentsSuccessResponseSchema.shape.data;

export type TCoachStudentsSuccess = z.infer<typeof CoachStudentsSuccessSchema>;

const CoachStudentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CoachStudentsSuccessSchema);
const CoachStudentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CoachStudentsViewModelSchemaMap = {
    default: CoachStudentsDefaultViewModelSchema,
    kaboom: CoachStudentsKaboomViewModelSchema,
};
export type TCoachStudentsViewModelSchemaMap = typeof CoachStudentsViewModelSchemaMap;
export const CoachStudentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CoachStudentsViewModelSchemaMap);
export type TCoachStudentsViewModel = z.infer<typeof CoachStudentsViewModelSchema>;
