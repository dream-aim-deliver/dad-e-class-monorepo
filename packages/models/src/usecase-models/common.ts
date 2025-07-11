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