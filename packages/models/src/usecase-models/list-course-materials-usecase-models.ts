import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { RichTextSchema, LinksSchema, DownloadFilesSchema, AssignmentMaterialSchema } from './common';

export const ListCourseMaterialsRequestSchema = z.object({
    courseSlug: z.string(),
});
export type TListCourseMaterialsRequest = z.infer<typeof ListCourseMaterialsRequestSchema>;

export const CourseMaterialSchema = z.discriminatedUnion('type', [
    RichTextSchema,
    LinksSchema,
    DownloadFilesSchema,
    AssignmentMaterialSchema,
]);
export type TCourseMaterial = z.infer<typeof CourseMaterialSchema>;

export const ListCourseMaterialsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    modules: z.array(z.object({
        id: z.string(),
        position: z.number(),
        title: z.string(),
        lessons: z.array(z.object({
            id: z.string(),
            position: z.number(),
            title: z.string(),
            materials: z.array(CourseMaterialSchema)
        })),
        lessonCount: z.number(),
    })),
    moduleCount: z.number(),
}));
export type TListCourseMaterialsSuccessResponse = z.infer<typeof ListCourseMaterialsSuccessResponseSchema>;

const ListCourseMaterialsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCourseMaterialsUseCaseErrorResponse = z.infer<typeof ListCourseMaterialsUseCaseErrorResponseSchema>;

export const ListCourseMaterialsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCourseMaterialsSuccessResponseSchema,
    ListCourseMaterialsUseCaseErrorResponseSchema,
]);
export type TListCourseMaterialsUseCaseResponse = z.infer<typeof ListCourseMaterialsUseCaseResponseSchema>;