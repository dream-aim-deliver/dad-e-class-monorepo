import { z } from 'zod';
import { CourseMetadataSchema } from './course';
import { FileMetadataSchema } from './file-metadata';
import { UserSchema } from './user';
import { LinkSchema } from './shared';


export const AssignmentStatusEnumSchema = z.enum([
    'AwaitingReview',
    'AwaitingForLongTime',
    'Passed',
]);

export type TAssignmentStatusEnum = z.infer<typeof AssignmentStatusEnumSchema>;

export const AssignmentStudentSenderSchema = UserSchema.extend({
    isCurrentUser: z.boolean(),
    role: z.literal('student'),
});

export const AssignmentCoachSenderSchema = UserSchema.extend({
    isCurrentUser: z.boolean(),
    role: z.literal('coach'),
});

export type TAssignmentReplyStudentSender = z.infer<typeof AssignmentStudentSenderSchema>;
export type TAssignmentReplyCoachSender = z.infer<typeof AssignmentCoachSenderSchema>;

export const AssignmentReplySenderSchema = z.discriminatedUnion('role', [
    AssignmentStudentSenderSchema,
    AssignmentCoachSenderSchema,
]);
export type TAssignmentReplySender = z.infer<typeof AssignmentReplySenderSchema>;

export const BaseAssignmentReplySchema = z.object({
    timestamp: z.string().datetime({ offset: true }),
    sender: AssignmentReplySenderSchema,
});

export const AssignmentTextReplySchema = BaseAssignmentReplySchema.extend({
    type: z.literal('text'),
    comment: z.string(),  // plain text
});

export type TAssignmentTextReply = z.infer<typeof AssignmentTextReplySchema>;

export const AssignmentBaseResourceReplySchema = BaseAssignmentReplySchema.extend({
    type: z.literal('resources'),
    comment: z.string(),  // plain text
});

export const AssignmentResourcesReplySchema = AssignmentBaseResourceReplySchema.extend({
    files: z.array(FileMetadataSchema).optional(),
    links: z.array(LinkSchema).optional(),
});

export type TAssignmentResourcesReply = z.infer<typeof AssignmentResourcesReplySchema>;

export const AssignmentFileDeleteReplySchema = AssignmentResourcesReplySchema.extend({
    id: z.number(),  // reply ID
    resourceId: z.number(),  // ID of the single file to be deleted
    type: z.literal('file'),
});

export const AssignmentLinkDeleteReplySchema = AssignmentResourcesReplySchema.extend({
    id: z.number(),  // reply ID
    resourceId: z.number(),  // ID of the single link to be deleted
    type: z.literal('link'),
});

export const AssignmentResourcesDeleteReplySchema = z.discriminatedUnion('type', [
    AssignmentFileDeleteReplySchema,
    AssignmentLinkDeleteReplySchema,
]);

export type TAssignmentResourcesDeleteReply = z.infer<typeof AssignmentResourcesDeleteReplySchema>;

export const AssignmentReplyPassedSchema = BaseAssignmentReplySchema.extend({
    type: z.literal('passed'),
});
export type TAssignmentReplyPassed = z.infer<typeof AssignmentReplyPassedSchema>;


export const AssignmentReplySchema = z.discriminatedUnion('type', [
    AssignmentTextReplySchema,
    AssignmentResourcesReplySchema,
    AssignmentReplyPassedSchema,
]);
export type TAssignmentReply = z.infer<typeof AssignmentReplySchema>;


export const AssignmentBaseSchema = z.object({
    title: z.string(),  // plain text
    description: z.string(),  // plain text
    files: z.array(FileMetadataSchema).optional(),
    links: z.array(LinkSchema).optional(),
    groupName: z.string().optional(),
});
export type TAssignmentBase = z.infer<typeof AssignmentBaseSchema>;

export const AssignmentSchema = AssignmentBaseSchema.extend({
    course: CourseMetadataSchema,
    module: z.number(),  // module number in the course
    lesson: z.number(),  // lesson number in the module
    status: AssignmentStatusEnumSchema,
    replies: z.array(AssignmentReplySchema).optional(),
    student: AssignmentStudentSenderSchema,
});
export type TAssignment = z.infer<typeof AssignmentSchema>;

export const AssignmentCreateRequestSchema = AssignmentBaseSchema.extend({
    courseId: z.number(),  // course ID
    moduleId: z.number(),  // module ID
    lessonId: z.number(),  // lesson ID
    student: AssignmentStudentSenderSchema,
});
export type TAssignmentCreateRequest = z.infer<typeof AssignmentCreateRequestSchema>;

export const AssignmentUpdateRequestSchema = AssignmentCreateRequestSchema.extend({
    id: z.number(),  // assignment ID
});
export type TAssignmentUpdateRequest = z.infer<typeof AssignmentUpdateRequestSchema>;