import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const uploadCourseImageMock: useCaseModels.TUploadCourseImageSuccessResponse['data'] =
    {
        storageUrl: 'https://example.com/image.jpg',
        formFields: {
            field1: 'value1',
            field2: 'value2',
        },
        file: {
            id: 'file-id',
            name: 'test-image.jpg',
            size: 1500000, // 1.5 MB
            category: 'image',
        },
    };

export const uploadCourseImage = t.procedure
    .input(useCaseModels.UploadCourseImageRequestSchema)
    .mutation(
        async (
            ctx,
        ): Promise<useCaseModels.TUploadCourseImageUseCaseResponse> => {
            console.log(ctx.input);
            if (
                ctx.input.mimeType !== 'image/jpeg' &&
                ctx.input.mimeType !== 'image/png'
            ) {
                return {
                    success: false,
                    data: {
                        errorType: 'ValidationError',
                        message: 'Only JPEG and PNG files are allowed',
                        operation: 'uploadCourseImage',
                        context: {},
                        trace: undefined,
                    },
                };
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
            return {
                success: true,
                data: {
                    storageUrl: 'https://example.com/image.jpg',
                    formFields: {
                        field1: 'value1',
                        field2: 'value2',
                    },
                    file: {
                        id: 'file-id',
                        name: ctx.input.name,
                        size: ctx.input.size,
                        category: 'image',
                    },
                },
            };
        },
    );

const verifyCourseImageMock: useCaseModels.TVerifyCourseImageSuccessResponse['data'] =
    {
        downloadUrl:
            'https://plus.unsplash.com/premium_photo-1754432777426-46d9027859cf?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };

export const verifyCourseImage = t.procedure
    .input(useCaseModels.VerifyCourseImageRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TVerifyCourseImageUseCaseResponse> => {
            return {
                success: true,
                data: verifyCourseImageMock,
            };
        },
    );
