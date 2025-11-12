import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { StarRating } from '../star-rating';
import { IconClose } from '../icons';
import { Button } from '../button';
import { IconButton } from '../icon-button';

export interface ReviewDisplayProps extends isLocalAware {
    reviewText: string;
    rating: number;
    onClose: () => void;
}

export const ReviewDisplay = ({
    reviewText,
    rating,
    onClose,
    locale,
}: ReviewDisplayProps) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill w-full md:w-[340px] shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
            {/* Header with title and close icon */}
            <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-text-primary">
                    {dictionary.components.reviewDisplay.yourReview}
                </h3>
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text p-1"
                />
            </div>

            {/* Review content */}
            <div className="flex flex-col gap-4 w-full">
                {/* Star rating */}
                <div className="flex items-center">
                    <StarRating totalStars={5} rating={rating} />
                    <span className="ml-2 text-text-secondary text-sm">
                        {rating}/5
                    </span>
                </div>

                {/* Review text */}
                {reviewText && (
                    <div className="text-text-primary text-sm leading-relaxed">
                        {reviewText}
                    </div>
                )}

                {/* Close button */}
                <div className="flex justify-end mt-4">
                    <Button
                        variant="primary"
                        size="medium"
                        text={dictionary.components.reviewDisplay.close}
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
};