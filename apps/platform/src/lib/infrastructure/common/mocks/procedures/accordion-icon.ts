import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const uploadAccordionIconMock: useCaseModels.TUploadAccordionIconSuccessResponse['data'] =
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

export const uploadAccordionIcon = t.procedure
    .input(useCaseModels.UploadAccordionIconRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TUploadAccordionIconUseCaseResponse> => {
            return {
                success: true,
                data: uploadAccordionIconMock,
            };
        },
    );
