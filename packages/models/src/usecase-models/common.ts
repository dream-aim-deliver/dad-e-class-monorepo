import { z } from "zod";

const BaseAnswer = z.object({
    componentId: z.string(),
    type: z.string(),
});

const TextInputAnswer = BaseAnswer.extend({
    type: z.literal('textInput'),
    answer: z.string(),
});

const SingleChoiceAnswer = BaseAnswer.extend({
    type: z.literal('singleChoice'),
    answerId: z.number(),
});

const MultipleChoiceAnswer = BaseAnswer.extend({
    type: z.literal('multipleChoice'),
    answerIds: z.array(z.number()),
});

const OneOutOfThreeAnswer = BaseAnswer.extend({
    type: z.literal('oneOutOfThree'),
    answers: z.array(z.object({
        rowId: z.number(),
        columnId: z.number(),
    }))
});

export const AnswerSchema = z.discriminatedUnion('type', [
    TextInputAnswer,
    SingleChoiceAnswer,
    MultipleChoiceAnswer,
    OneOutOfThreeAnswer,
]);
export type TAnswer = z.infer<typeof AnswerSchema>;
const BaseComponent = z.object({
    id: z.string(),
    order: z.number(),
    type: z.string(),
});

const OptionSchema = z.object({
    id: z.number(),
    name: z.string(),
});

const FileCategoryEnumSchema = z.enum([
    'image',
    'video',
    'generic',
    'document',
]);

export const FileSchema = z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    category: FileCategoryEnumSchema,
    downloadUrl: z.string(),
});

export const VideoFileSchema = FileSchema.extend({
    category: z.literal('video'),
    thumbnailUrl: z.string().nullable(),
    playbackId: z.string().nullable(),
});

export const ImageFileSchema = FileSchema.extend({
    category: z.literal('image'),
});

const LinkSchema = z.object({
    title: z.string(),
    url: z.string(),
    iconFile: ImageFileSchema.nullable(),
});

const RichTextSchema = BaseComponent.extend({
    type: z.literal('richText'),
    text: z.string(),
});

const HeadingSchema = BaseComponent.extend({
    type: z.literal('heading'),
    text: z.string(),
    size: z.string(),
});

const TextInputSchema = BaseComponent.extend({
    type: z.literal('textInput'),
    helperText: z.string(),
    required: z.boolean(),
});

const SingleChoiceSchema = BaseComponent.extend({
    type: z.literal('singleChoice'),
    title: z.string(),
    options: z.array(OptionSchema),
    required: z.boolean(),
});

const MultipleChoiceSchema = BaseComponent.extend({
    type: z.literal('multipleChoice'),
    title: z.string(),
    options: z.array(OptionSchema),
    required: z.boolean(),
});

const OneOutOfThreeSchema = BaseComponent.extend({
    type: z.literal('oneOutOfThree'),
    title: z.string(),
    columns: z.array(OptionSchema),
    rows: z.array(OptionSchema),
    required: z.boolean(),
});

const VideoSchema = BaseComponent.extend({
    type: z.literal('video'),
    videoFile: VideoFileSchema,
});

const ImageSchema = BaseComponent.extend({
    type: z.literal('image'),
    imageFile: ImageFileSchema,
});

const ImageCarouselSchema = BaseComponent.extend({
    type: z.literal('imageCarousel'),
    imageFiles: z.array(ImageFileSchema),
});

const LinksSchema = BaseComponent.extend({
    type: z.literal('links'),
    links: z.array(LinkSchema),
    includeInMaterials: z.boolean(),
});

const DownloadFileSchema = FileSchema.extend({
    thumbnailUrl: z.string().nullable(),
});

const DownloadFilesSchema = BaseComponent.extend({
    type: z.literal('downloadFiles'),
    files: z.array(DownloadFileSchema),
});

const UploadFilesSchema = BaseComponent.extend({
    type: z.literal('uploadFiles'),
    description: z.string(),
});

const QuizOptionWithImageSchema = z.object({
  id: z.number(),
  imageFile: ImageFileSchema,
  description: z.string(),
});

const QuizGroupSchema = z.object({
  id: z.number(),
  title: z.string(),
  options: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  correctOptionId: z.number(),
});

const QuizTypeOneSchema = BaseComponent.extend({
    type: z.literal('quizTypeOne'),
    title: z.string(),
    description: z.string(),
    imageFile: ImageFileSchema,
    options: z.array(OptionSchema),
    correctOptionId: z.number(),
});

const QuizTypeTwoSchema = BaseComponent.extend({
    type: z.literal('quizTypeTwo'),
    title: z.string(),
    description: z.string(),
    imageFile: ImageFileSchema,
    groups: z.array(QuizGroupSchema),
});

const QuizTypeThreeSchema = BaseComponent.extend({
    type: z.literal('quizTypeThree'),
    title: z.string(),
    description: z.string(),
    options: z.array(QuizOptionWithImageSchema),
    correctOptionId: z.number(),
});

const QuizTypeFourSchema = BaseComponent.extend({
    type: z.literal('quizTypeFour'),
    title: z.string(),
    description: z.string(),
    options: z.array(QuizOptionWithImageSchema),
});

const CoachingSessionSchema = BaseComponent.extend({
    type: z.literal('coachingSession'),
    courseCoachingOfferingId: z.number(),
    name: z.string(),
    duration: z.number(), // minutes
});

const AssignmentSchema = BaseComponent.extend({
    type: z.literal('assignment'),
    title: z.string(),
    description: z.string(),
    resources: z.array(DownloadFileSchema),
    links: z.array(LinkSchema),
});

export const AssessmentComponentSchema = z.discriminatedUnion('type', [
    RichTextSchema,
    HeadingSchema,
    TextInputSchema,
    SingleChoiceSchema,
    MultipleChoiceSchema,
    OneOutOfThreeSchema,
]);
export const LessonComponentSchema = z.discriminatedUnion('type', [
    RichTextSchema,
    HeadingSchema,
    TextInputSchema,
    SingleChoiceSchema,
    MultipleChoiceSchema,
    OneOutOfThreeSchema,
    VideoSchema,
    ImageSchema,
    ImageCarouselSchema,
    LinksSchema,
    DownloadFilesSchema,
    UploadFilesSchema,
    QuizTypeOneSchema,
    QuizTypeTwoSchema,
    QuizTypeThreeSchema,
    QuizTypeFourSchema,
    CoachingSessionSchema,
    AssignmentSchema,
]);

export type TAssessmentComponent = z.infer<typeof AssessmentComponentSchema>;
export type TLessonComponent = z.infer<typeof LessonComponentSchema>;