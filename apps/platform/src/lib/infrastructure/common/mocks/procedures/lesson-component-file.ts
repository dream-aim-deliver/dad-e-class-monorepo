import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const uploadLessonComponentFileMock: useCaseModels.TUploadLessonComponentFileSuccessResponse['data'] =
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

export const uploadLessonComponentFile = t.procedure
    .input(useCaseModels.UploadLessonComponentFileRequestSchema)
    .query(
        async (): Promise<useCaseModels.TUploadLessonComponentFileUseCaseResponse> => {
            return {
                success: true,
                data: uploadLessonComponentFileMock,
            };
        },
    );
