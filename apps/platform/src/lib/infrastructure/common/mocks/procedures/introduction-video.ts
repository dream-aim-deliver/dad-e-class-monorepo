import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const uploadIntroductionVideoMock: useCaseModels.TUploadIntroductionVideoSuccessResponse['data'] =
    {
        storageUrl: 'http://localhost:9000/test',
        formFields: {
            field1: 'value1',
            field2: 'value2',
        },
        file: {
            id: 'video-id',
            name: 'test-video.mp4',
            size: 1500000, // 1.5 MB
            category: 'video',
            objectName: 'courses/videos/video.mp4',
        },
    };

export const uploadIntroductionVideo = t.procedure
    .input(useCaseModels.UploadIntroductionVideoRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TUploadIntroductionVideoUseCaseResponse> => {
            return {
                success: true,
                data: uploadIntroductionVideoMock,
            };
        },
    );
