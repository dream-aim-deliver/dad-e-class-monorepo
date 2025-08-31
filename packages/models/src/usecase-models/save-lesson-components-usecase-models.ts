import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from './list-lesson-components-usecase-models';

const BaseComponentSchema = z.object({
    id: z.string().optional().nullable(), // Doesn't exist if the component is new
    position: z.number().int(),
});

// Simple
const RichTextComponentSchema = BaseComponentSchema.extend({
    type: z.literal('richText'),
    text: z.string(),
    includeInMaterials: z.boolean(),
});

const HeadingComponentSchema = BaseComponentSchema.extend({
    type: z.literal('heading'),
    text: z.string(),
    size: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
});

const VideoComponentSchema = BaseComponentSchema.extend({
    type: z.literal('video'),
    videoFileId: z.number().int(),
});

const ImageComponentSchema = BaseComponentSchema.extend({
    type: z.literal('image'),
    imageFileId: z.number().int(),
});

const ImageCarouselComponentSchema = BaseComponentSchema.extend({
    type: z.literal('imageCarousel'),
    imageFileIds: z.array(z.number().int()),
});

const DownloadFilesComponentSchema = BaseComponentSchema.extend({
    type: z.literal('downloadFiles'),
    fileIds: z.array(z.number().int()),
});

const LinksComponentSchema = BaseComponentSchema.extend({
    type: z.literal('links'),
    links: z.array(z.object({
        title: z.string(),
        url: z.string(),
        iconFileId: z.number().int().nullable().optional(),
    })),
    includeInMaterials: z.boolean(),
});

// Interactive
const TextInputComponentSchema = BaseComponentSchema.extend({
    type: z.literal('textInput'),
    helperText: z.string(),
    required: z.boolean(),
});

const SingleChoiceComponentSchema = BaseComponentSchema.extend({
    type: z.literal('singleChoice'),
    title: z.string(),
    options: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })),
    required: z.boolean(),
});

const MultipleChoiceComponentSchema = BaseComponentSchema.extend({
    type: z.literal('multipleChoice'),
    title: z.string(),
    options: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })),
    required: z.boolean(),
});

const OneOutOfThreeComponentSchema = BaseComponentSchema.extend({
    type: z.literal('oneOutOfThree'),
    title: z.string(),
    columns: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })),
    rows: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })),
    required: z.boolean(),
});

const UploadFilesComponentSchema = BaseComponentSchema.extend({
    type: z.literal('uploadFiles'),
    description: z.string(),
});

const QuizTypeOneComponentSchema = BaseComponentSchema.extend({
    type: z.literal('quizTypeOne'),
    title: z.string(),
    description: z.string(),
    imageFileId: z.number().int(),
    options: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })),
    correctOptionId: z.string(),
});

const QuizTypeTwoComponentSchema = BaseComponentSchema.extend({
    type: z.literal('quizTypeTwo'),
    title: z.string(),
    description: z.string(),
    imageFileId: z.number().int(),
    groups: z.array(z.object({
        id: z.string(),
        title: z.string(),
        options: z.array(z.object({
            id: z.string(),
            name: z.string(),
        })),
        correctOptionId: z.string(),
    })),
});

const QuizTypeThreeComponentSchema = BaseComponentSchema.extend({
    type: z.literal('quizTypeThree'),
    title: z.string(),
    description: z.string(),
    options: z.array(z.object({
        id: z.string(),
        imageFileId: z.number().int(),
        description: z.string(),
    })).max(2),
    correctOptionId: z.string(),
});

const QuizTypeFourComponentSchema = BaseComponentSchema.extend({
    type: z.literal('quizTypeFour'),
    title: z.string(),
    description: z.string(),
    options: z.array(z.object({
        id: z.string(),
        imageFileId: z.number().int(),
        description: z.string(),
    })),
});

const CoachingSessionComponentSchema = BaseComponentSchema.extend({
    type: z.literal('coachingSession'),
    courseCoachingOfferingId: z.number().int(),
});

const AssignmentComponentSchema = BaseComponentSchema.extend({
    type: z.literal('assignment'),
    title: z.string(),
    description: z.string(),
    fileIds: z.array(z.number().int()),
    links: z.array(z.object({
        title: z.string(),
        url: z.string(),
        iconFileId: z.number().int().nullable().optional(),
    })),
});

const ComponentSchema = z.discriminatedUnion('type', [
    RichTextComponentSchema,
    HeadingComponentSchema,
    SingleChoiceComponentSchema,
    MultipleChoiceComponentSchema,
    TextInputComponentSchema,
    OneOutOfThreeComponentSchema,
    VideoComponentSchema,
    ImageComponentSchema,
    ImageCarouselComponentSchema,
    LinksComponentSchema,
    DownloadFilesComponentSchema,
    UploadFilesComponentSchema,
    QuizTypeOneComponentSchema,
    QuizTypeTwoComponentSchema,
    QuizTypeThreeComponentSchema,
    QuizTypeFourComponentSchema,
    CoachingSessionComponentSchema,
    AssignmentComponentSchema,
]);

export const SaveLessonComponentsRequestSchema = z.object({
  lessonId: z.number(),
  courseVersion: z.number(),
  components: z.array(ComponentSchema)
});

export type TSaveLessonComponentsRequest = z.infer<typeof SaveLessonComponentsRequestSchema>;

export const SaveLessonComponentsSuccessResponseSchema = ListLessonComponentsSuccessResponseSchema;

export type TSaveLessonComponentsSuccessResponse = z.infer<typeof SaveLessonComponentsSuccessResponseSchema>;

const SaveLessonComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  ConflictError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ConflictError',
    schema: z.object({
      trace: z.string().optional(),
      courseVersion: z.number(),
    }),
  }),
});
export type TSaveLessonComponentsUseCaseErrorResponse = z.infer<typeof SaveLessonComponentsUseCaseErrorResponseSchema>;

export const SaveLessonComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveLessonComponentsSuccessResponseSchema,
  SaveLessonComponentsUseCaseErrorResponseSchema,
]);

export type TSaveLessonComponentsUseCaseResponse = z.infer<typeof SaveLessonComponentsUseCaseResponseSchema>;
