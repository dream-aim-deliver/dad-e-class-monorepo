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
        logoUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748270861/a_wy7cuh_kwevw6.png',
        backgroundImageUrl:
            'https://res.cloudinary.com/dsyephqpf/image/upload/v1747650265/background-eln_mhvipu.jpg',
        footerContent: entities.RichText.parse(
            JSON.stringify([
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: '© 2025 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai',
                        },
                    ],
                },
            ]),
        ),
    };
}
