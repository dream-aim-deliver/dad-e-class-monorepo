import { z } from 'zod';
import { CourseMetadataSchema } from './course';
import { FileMetadataSchema } from './file-metadata';
import { UserSchema } from './user';
import { LinkSchema, LinkWithIdSchema } from './shared';


export const FeedbackStudentSenderSchema = UserSchema.extend({
    isCurrentUser: z.boolean(),
    role: z.literal('student'),
});

export const FeedbackCoachSenderSchema = UserSchema.extend({
    isCurrentUser: z.boolean(),
    role: z.literal('coach'),
});

export type TFeedbackReplyStudentSender = z.infer<typeof FeedbackStudentSenderSchema>;
export type TFeedbackReplyCoachSender = z.infer<typeof FeedbackCoachSenderSchema>;

export const FeedbackReplySenderSchema = z.discriminatedUnion('role', [
    FeedbackStudentSenderSchema,
    FeedbackCoachSenderSchema,
]);
export type TFeedbackReplySender = z.infer<typeof FeedbackReplySenderSchema>;

export const BaseFeedbackReplySchema = z.object({
    timestamp: z.number(),
    sender: FeedbackReplySenderSchema,
});

export const FeedbackTextReplySchema = BaseFeedbackReplySchema.extend({
    type: z.literal('text'),
    comment: z.string(),  // plain text
});

export const FeedbackTextReplyWithIdSchema = FeedbackTextReplySchema.extend({
    replyId: z.number(),
});

export type TFeedbackTextReply = z.infer<typeof FeedbackTextReplySchema>;

export const FeedbackBaseResourceReplySchema = BaseFeedbackReplySchema.extend({
    type: z.literal('resources'),
    comment: z.string(),  // plain text
});

export const FeedbackBaseResourceReplyWithIdSchema = FeedbackBaseResourceReplySchema.extend({
    replyId: z.number(),
});

export const FeedbackResourcesReplySchema = FeedbackBaseResourceReplySchema.extend({
    files: z.array(FileMetadataSchema).optional(),
    links: z.array(LinkSchema).optional(),
});

export const FeedbackResourcesReplyWithIdSchema = FeedbackBaseResourceReplyWithIdSchema.extend({
    files: z.array(FileMetadataSchema).optional(),
    links: z.array(LinkWithIdSchema).optional(),
});

export type TFeedbackResourcesReply = z.infer<typeof FeedbackResourcesReplySchema>;

export const FeedbackReplySchema = z.discriminatedUnion('type', [
    FeedbackTextReplySchema,
    FeedbackResourcesReplySchema,
]);
export type TFeedbackReply = z.infer<typeof FeedbackReplySchema>;

export const FeedbackReplyWithIdSchema = z.discriminatedUnion('type', [
    FeedbackTextReplyWithIdSchema,
    FeedbackResourcesReplyWithIdSchema,
]);
export type TFeedbackReplyWithId = z.infer<typeof FeedbackReplyWithIdSchema>;

export const FeedbackBaseSchema = z.object({
    title: z.string(),  // plain text
    description: z.string(),  // plain text
    files: z.array(FileMetadataSchema).optional(),
    links: z.array(LinkSchema).optional(),
});
export type TFeedbackBase = z.infer<typeof FeedbackBaseSchema>;

export const FeedbackSchema = FeedbackBaseSchema.extend({
    course: CourseMetadataSchema,
    module: z.number(),  // module number in the course
    lesson: z.number(),  // lesson number in the module
    replies: z.array(FeedbackReplySchema).optional(),
    student: FeedbackStudentSenderSchema,
});
export type TFeedback = z.infer<typeof FeedbackSchema>;
