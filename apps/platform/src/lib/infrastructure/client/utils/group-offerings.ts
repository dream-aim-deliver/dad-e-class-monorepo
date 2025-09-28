import { viewModels } from "@maany_shr/e-class-models";

export const groupOfferings = (availableCoachingsViewModel: viewModels.TAvailableCoachingListViewModel) => {
    if (
        !availableCoachingsViewModel ||
        availableCoachingsViewModel.mode !== 'default'
    ) {
        return [];
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0) {
        return [];
    }

    const groupedOfferings = availableOfferings.reduce(
        (acc, offering) => {
            const key = `${offering.name}_${offering.duration}`;

            if (!acc[key]) {
                acc[key] = {
                    title: offering.name,
                    time: offering.duration,
                    offerings: [],
                };
            }

            acc[key].offerings.push(offering);
            return acc;
        },
        {} as Record<
            string,
            {
                title: string;
                time: number;
                offerings: typeof availableOfferings;
            }
        >,
    );

    // Convert to array and calculate total sessions
    return Object.values(groupedOfferings).map((group) => ({
        title: group.title,
        time: group.time,
        numberOfSessions: group.offerings.length,
    }));
}