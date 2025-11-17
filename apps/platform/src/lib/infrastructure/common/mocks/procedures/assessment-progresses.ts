import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const mockFirst: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] = {
    components: [
        {
            // Base component properties (you'll need to add these based on your BaseComponent schema)
            id: 'comp_003',
            order: 1,
            type: 'singleChoice',
            title: 'Select your preferred option',
            options: [
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
                { id: '3', name: 'Option 3' },
                { id: '4', name: 'Option 4' },
            ],
            required: true,
            progress: {
                answerId: '4',
            },
        },
    ],
};

const mockSecond: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] = {
    components: [
        {
            id: 'comp_104',
            order: 1,
            type: 'multipleChoice',
            title: 'Select all that apply',
            options: [
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
                { id: '3', name: 'Option 3' },
                { id: '4', name: 'Option 4' },
                { id: '5', name: 'Option 5' },
            ],
            required: true,
            progress: {
                answerIds: ['1', '2', '3', '5'],
            },
        },
        {
            id: 'comp_105',
            order: 3,
            type: 'textInput',
            helperText: 'Explain the difference between props and state in React',
            required: true,
            progress: {
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
        },
    ],
};

const mockThird: useCaseModels.TListAssessmentProgressesSuccessResponse['data'] = {
    components: [
        {
            id: 'comp_204',
            order: 1,
            type: 'oneOutOfThree',
            title: 'Match the items',
            columns: [
                { id: '1', name: 'Column 1' },
                { id: '2', name: 'Column 2' },
                { id: '3', name: 'Column 3' },
            ],
            rows: [
                { id: '1', name: 'Row 1' },
                { id: '2', name: 'Row 2' },
                { id: '3', name: 'Row 3' },
            ],
            required: true,
            progress: {
                answers: [
                    { rowId: '1', columnId: '1' },
                    { rowId: '2', columnId: '2' },
                    { rowId: '3', columnId: '3' },
                ],
            },
        },
        {
            id: 'comp_205',
            order: 2,
            type: 'singleChoice',
            title: 'Choose the best answer',
            options: [
                { id: '1', name: 'Answer 1' },
                { id: '2', name: 'Answer 2' },
                { id: '3', name: 'Answer 3' },
            ],
            required: true,
            progress: {
                answerId: '1',
            },
        },
        {
            id: 'comp_207',
            order: 3,
            type: 'multipleChoice',
            title: 'Select all correct answers',
            options: [
                { id: '1', name: 'Answer 1' },
                { id: '2', name: 'Answer 2' },
                { id: '3', name: 'Answer 3' },
                { id: '4', name: 'Answer 4' },
                { id: '5', name: 'Answer 5' },
                { id: '6', name: 'Answer 6' },
            ],
            required: true,
            progress: {
                answerIds: ['1', '2', '3', '6'],
            },
        },
    ],
};

export const listAssessmentProgresses = t.procedure
    .input(useCaseModels.ListAssessmentProgressesRequestSchema)
    .query(
        async (opts): Promise<useCaseModels.TListAssessmentProgressesUseCaseResponse> => {
            const { courseSlug } = opts.input;

            // Return empty components for courses without PCA
            if (courseSlug === 'student-course' || courseSlug === 'coach-course') {
                return {
                    success: true,
                    data: {
                        components: [],
                    },
                };
            }

            // Return different mock data based on course
            if (courseSlug === 'progress-course') {
                return {
                    success: true,
                    data: mockFirst,
                };
            }

            if (courseSlug === 'admin-course') {
                return {
                    success: true,
                    data: mockSecond,
                };
            }

            // Default: return mockThird for other courses
            return {
                success: true,
                data: mockThird,
            };
        },
    );
