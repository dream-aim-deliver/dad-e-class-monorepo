import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getPlatformLanguageMock: useCaseModels.TGetPlatformLanguageSuccessResponse['data'] =
{
    impressumContent: 'Impressum content',
    privacyPolicyContent: 'Privacy policy content',
    termsOfUseContent: 'Terms of use content',
    aboutPageContent: 'About page content',
    enablePreCourseAssessment: false,
};

export const getPlatformLanguage = t.procedure
    .input(useCaseModels.GetPlatformLanguageRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetPlatformLanguageUseCaseResponse> => {
            return {
                success: true,
                data: getPlatformLanguageMock,
            };
        },
    );
