import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';

export function useSaveAdminDetails({
    slug,
    courseVersion,
    setErrorMessage,
}: {
    slug: string;
    courseVersion: number | null;
    setErrorMessage: (message: string | null) => void;
}) {
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [basePrice, setBasePrice] = useState<number | null>(null);
    const [priceIncludingCoachings, setPriceIncludingCoachings] = useState<number | null>(null);

    const saveAdminDetailsMutation = trpc.saveCourseAdminDetails.useMutation();

    const validateAdminDetails = () => {
        // Add validation logic as needed
        if (basePrice !== null && basePrice < 0) {
            setErrorMessage('Base price cannot be negative');
            return false;
        }
        if (priceIncludingCoachings !== null && priceIncludingCoachings < 0) {
            setErrorMessage('Price including coachings cannot be negative');
            return false;
        }
        return true;
    };

    const saveCourseAdminDetails = async () => {
        if (!courseVersion) return;
        if (!validateAdminDetails()) return;

        setErrorMessage(null);
        const result = await saveAdminDetailsMutation.mutateAsync({
            courseSlug: slug,
            courseVersion: courseVersion,
            public: isPublic,
            basePrice: basePrice,
            priceIncludingCoachings: priceIncludingCoachings,
        });

        if (!result.success) {
            if ('message' in result.data) {
                setErrorMessage(result.data.message as string);
            }
            return;
        }
        return result;
    };

    return {
        isPublic,
        setIsPublic,
        basePrice,
        setBasePrice,
        priceIncludingCoachings,
        setPriceIncludingCoachings,
        saveCourseAdminDetails,
        isAdminDetailsSaving: saveAdminDetailsMutation.isPending,
    };
}
