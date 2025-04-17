import * as React from 'react';
import { useState } from "react";
import { Button } from './button';
import StarRatingInput from './star-rating-input';
import { StarRating } from './star-rating';
import { CheckBox } from './checkbox';
import { IconSuccess } from './icons/icon-success';
import { IconButton } from './icon-button';
import { IconClose } from './icons/icon-close';
import { get } from 'http';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TextAreaInput } from './text-areaInput';
import Tooltip from './tooltip';

export interface ReviewFlowProps extends isLocalAware {
    onClose?: () => void;
    onSubmit?: (rating: number, review: string, neededMoreTime: boolean) => void;
    onSkip?: () => void;
}

export const ReviewDialog: React.FC<ReviewFlowProps> = ({ onClose, onSubmit, onSkip, locale }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [neededMoreTime, setNeededMoreTime] = useState(false);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(rating, review, neededMoreTime);
        }
        setSubmitted(true);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        }
        handleClose();
    };

    const isFormValid = rating > 0 && review.trim().length > 0;
    const dictionary = getDictionary(locale);

    if (!submitted) {
        return (
            <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill max-w-[340px] shadow-[0_4px_12px_rgba(12,10,9,1)]"
            >
                <label
                    htmlFor="courseRating"
                    className="text-lg font-bold leading-tight text-white text-justify w-full"
                >
                    {dictionary.components.reviewCoachingSessionModal.title}
                </label>

                <div className="flex flex-col justify-center items-center p-5 w-full rounded-lg bg-base-neutral-700 border border-card-stroke">
                    <StarRatingInput
                        onChange={(value) => setRating(value.single || 0)}
                        size={24}
                        totalStars={5}
                        type="single"
                    />
                </div>

                <div className="flex flex-col w-full gap-2 text-justify text-stone-300">
                    <label
                        htmlFor="reviewText"
                        className="flex gap-1 items-center self-start text-sm leading-[120%]"
                    >
                        {/* <div className="self-stretch my-auto">{dictionary.components.reviewCoachingSessionModal.yourReview}</div> */}
                        <Tooltip
                            description="This tooltip includes a title and description"
                            
                            text={dictionary.components.reviewCoachingSessionModal.yourReview}                        
                        />
                    </label>

                    <div className="flex flex-col w-full text-base leading-6">
                        <TextAreaInput
                            className="px-3 pt-2.5 pb-4 w-full rounded-lg border border-stone-800 bg-stone-950 min-h-[104px] text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={dictionary.components.reviewCoachingSessionModal.reviewPlaceholder}
                            value={review}
                            setValue={(value: string) => setReview(value)}
                            aria-label="Course review"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full">
                    <CheckBox
                        label={dictionary.components.reviewCoachingSessionModal.checkboxText}
                        labelClass="text-text-primary text-sm leading-[100%]"
                        name="profile-visibility"
                        value="private-profile"
                        withText={true}
                        checked={neededMoreTime}
                        onChange={() => setNeededMoreTime(!neededMoreTime)}
                    />
                </div>

                <Button
                    className="w-full"
                    variant="primary"
                    size="medium"
                    text={dictionary.components.reviewCoachingSessionModal.sendReviewButton}
                    disabled={!isFormValid}
                />

                <Button
                    className="w-full"
                    variant="text"
                    size="medium"
                    text={dictionary.components.reviewCoachingSessionModal.skipButton}
                    onClick={handleSkip}
                />
            </form>
        );
    } else {
        return (
            <div
                className="flex flex-col items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill max-w-[292px] shadow-[0_4px_12px_rgba(12,10,9,1)] relative"
            >
                <div className="absolute right-0 top-0">
                    <IconButton
                        data-testid="close-modal-button"
                        styles="text"
                        icon={<IconClose />}
                        size="small"
                        onClick={() => handleClose()}
                        className="text-button-text-text"
                    />
                </div>

                <div className="flex items-start gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <IconSuccess classNames="text-feedback-success-primary" />
                        <div className="text-lg text-base-white text-justify leading-none">
                            {dictionary.components.reviewCoachingSessionModal.thankYouText}
                        </div>

                        <div className="bg-base-neutral-800 p-3 rounded-lg border border-card-stroke w-full">
                            <p className="text-sm text-stone-300 text-justify line-clamp-3">{review}</p>
                            <div className="flex justify-end items-center gap-1">
                                <StarRating rating={rating} totalStars={5} />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    className="w-full mt-4"
                    variant="primary"
                    size="medium"
                    text={dictionary.components.reviewCoachingSessionModal.closeButton}
                    onClick={handleClose}
                />
            </div>
        );
    }
};