import { t } from '../trpc-setup';

export const ping = t.procedure
    .query(
        async (
            opts,
        ): Promise<{ success: boolean; message: string }> => {
            return {
                success: true,
                message: 'pong',
            };
        }

    )