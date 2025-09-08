import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { EClassPackageSchema } from '../eclass-package';

export const GetCoursePackagesRequestSchema = z.object({
    courseSlug: z.string(),
});
export type TGetCoursePackagesRequest = z.infer<typeof GetCoursePackagesRequestSchema>;

export const GetCoursePackagesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    packages: z.array(
        EClassPackageSchema.extend({
            id: z.string(),
            courseCount: z.number().int().min(0),
        })
    )
}));
export type TGetCoursePackagesSuccessResponse = z.infer<typeof GetCoursePackagesSuccessResponseSchema>;

const GetCoursePackagesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCoursePackagesUseCaseErrorResponse = z.infer<typeof GetCoursePackagesUseCaseErrorResponseSchema>;

export const GetCoursePackagesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetCoursePackagesSuccessResponseSchema,
    GetCoursePackagesUseCaseErrorResponseSchema,
]);
export type TGetCoursePackagesUseCaseResponse = z.infer<typeof GetCoursePackagesUseCaseResponseSchema>;