import { entities } from '@maany_shr/e-class-models';
import type { TGetPlatformSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Returns mock platform data for development and testing.
 * Used in (mock-pages) route group to provide platform context without CMS backend.
 */
export function getMockPlatformData(): TGetPlatformSuccessResponse['data'] {
    return {
        id: 1,
        name: 'Just Do Ad',
        currency: '',
        state: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: 'just-do-ad',
        public: false,
        accentColor: '',
        font: '',
        hasOnlyFreeCourses: false,
        footerContent: '',
        domainName: '',
        backgroundImage: null,
        logo: null
    };
}
