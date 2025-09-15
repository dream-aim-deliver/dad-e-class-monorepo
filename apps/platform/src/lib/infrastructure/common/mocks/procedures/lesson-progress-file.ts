import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const uploadLessonProgressFileMock: useCaseModels.TUploadLessonProgressFileSuccessResponse['data'] =
    {
        storageUrl: 'http://localhost:9000/test',
        formFields: {
            field1: 'value1',
            field2: 'value2',
        },
        file: {
            id: 'file-id',
            name: 'test-image.jpg',
            size: 1500000, // 1.5 MB
            category: 'image',
            objectName: 'courses/images/image.jpg',
        },
    };

export const uploadLessonProgressFile = t.procedure
    .input(useCaseModels.UploadLessonProgressFileRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TUploadLessonProgressFileUseCaseResponse> => {
            return {
                success: true,
                data: uploadLessonProgressFileMock,
            };
        },
    );
