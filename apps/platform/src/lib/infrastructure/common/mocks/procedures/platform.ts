import { platform } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { z } from 'zod';

const getAdMock = (id: string | number): platform.TPlatform => ({
    id: id,
    name: 'Just Do Ad',
    logoUrl:
        'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748270861/a_wy7cuh_kwevw6.png',
    backgroundImageUrl:
        'https://res.cloudinary.com/dsyephqpf/image/upload/v1747650265/background-eln_mhvipu.jpg',
    // TODO: determine if this should be a rich text field
    footerContent:
        '© 2024 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai',
});

const GetPlatformInputSchema = z.object({
    id: z.string().or(z.number()),
});

export const getPlatform = t.procedure
    .input(GetPlatformInputSchema)
    .query(async (opts): Promise<platform.TPlatform> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getAdMock(opts.input.id);
    });
