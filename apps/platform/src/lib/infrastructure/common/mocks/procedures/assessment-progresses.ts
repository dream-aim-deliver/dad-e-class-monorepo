import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const mockFirst: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] =
    {
        progress: [
            {
                componentId: 'comp_003',
                type: 'singleChoice',
                answerId: 4,
            },
        ],
    };

const mockSecond: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] =
    {
        progress: [
            {
                componentId: 'comp_104',
                type: 'multipleChoice',
                answerIds: [1, 2, 3, 5],
            },
            {
                componentId: 'comp_105',
                type: 'textInput',
                answer: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Props are ',
                            },
                            {
                                text: 'read-only data',
                                bold: true,
                            },
                            {
                                text: ' passed from parent to child components, while state is ',
                            },
                            {
                                text: 'mutable data',
                                bold: true,
                            },
                            {
                                text: ' that belongs to a component and can be changed using ',
                            },
                            {
                                text: 'setState()',
                                code: true,
                            },
                            {
                                text: ' or ',
                            },
                            {
                                text: 'useState()',
                                code: true,
                            },
                            {
                                text: '. Props flow down the component tree and cannot be modified by the receiving component, whereas state is local to a component and triggers re-renders when updated.',
                            },
                        ],
                    },
                ]),
            },
        ],
    };

const mockThird: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] =
    {
        progress: [
            {
                componentId: 'comp_204',
                type: 'oneOutOfThree',
                answers: [
                    { rowId: 1, columnId: 1 },
                    { rowId: 2, columnId: 2 },
                    { rowId: 3, columnId: 3 },
                ],
            },
            {
                componentId: 'comp_205',
                type: 'singleChoice',
                answerId: 1,
            },
            {
                componentId: 'comp_207',
                type: 'multipleChoice',
                answerIds: [1, 2, 3, 6],
            },
        ],
    };

export const listAssessmentProgresses = t.procedure
    .input(useCaseModels.ListAssessmentProgressesRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListAssessmentProgressesUseCaseResponse> => {
            return {
                success: true,
                data: mockSecond,
            };
        },
    );
