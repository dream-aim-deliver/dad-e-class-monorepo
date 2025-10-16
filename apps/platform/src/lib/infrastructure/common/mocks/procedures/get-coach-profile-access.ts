import {
    GetCoachProfileAccessRequestSchema,
    TGetCoachProfileAccessSuccessResponse,
    TGetCoachProfileAccessResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import { t } from '../trpc-setup';

// Dataset now includes "manishkaswan" as key
const coachProfileAccessMock: Record<string, TGetCoachProfileAccessSuccessResponse['data']> = {
    manishkaswan: {
        access: true,
    },
};

export const getCoachProfileAccess = t.procedure
    .input(GetCoachProfileAccessRequestSchema)
    .query(async (opts): Promise<TGetCoachProfileAccessResponse> => {
        const { coachUsername } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

        // Check access based on dataset
        const accessData = coachProfileAccessMock[coachUsername];

        if (accessData) {
            // Authorized coach found
            return {
                success: true,
                data: accessData,
            };
        }

        // Unauthorized coach — return error
        return {
            success: false,
            data: {
                message: `Access denied for coach username: ${coachUsername}`,
                operation: "getCoachProfileAccess",
                context: { coachUsername },
                errorType: "ForbiddenError",
            },
        };
    });
