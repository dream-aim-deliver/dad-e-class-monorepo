import { homePage } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const homePageMock: homePage.THomePage = {
    banner: {
        description:
            'Platform introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.',
        title: "Platform's Title, short and powerful",
        videoId: 'o017yCZbw87zC9xDoy1Bl02FsbCBXuSdx6xPbkF01sW02IU',
        thumbnailUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748006627/hb-thumb_eabema.png',
    },
    carousel: [
        {
            description: '',
            title: '',
            imageUrl: '',
            buttonText: '',
            buttonUrl: '',
            badge: '',
        },
        {
            description: '',
            title: '',
            imageUrl: '',
            buttonText: '',
            buttonUrl: '',
            badge: '',
        },
    ],
    coachingOnDemand: {
        description: '',
        title: '',
        desktopImageUrl: '',
        tabletImageUrl: '',
        mobileImageUrl: '',
    },
    accordion: {
        title: '',
        showNumbers: false,
        items: [],
    },
};

export const getHomePage = t.procedure.query(
    async (opts): Promise<homePage.THomePage> => {
        // Locale will be received from context
        await new Promise((resolve) => setTimeout(resolve, 250));
        return homePageMock;
    },
);
