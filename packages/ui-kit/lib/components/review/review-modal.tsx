'use client';

import * as React from 'react';
import { Button } from '../button';
import StarRatingInput from '../star-rating-input';
import { StarRating } from '../star-rating';
import { CheckBox } from '../checkbox';
import { IconSuccess } from '../icons/icon-success';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TextAreaInput } from '../text-areaInput';
import { Dialog, DialogContent } from '../dialog';
import Banner from '../banner';

export interface CoachingReviewProps extends isLocalAware {
  onClose?: () => void;
  modalType: 'coaching';
  onSubmit?: (rating: number, review: string, neededMoreTime: boolean) => void;
  onSkip?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  successMessage?: string;
  submitted?: boolean;
  variant?: 'card' | 'dialog';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showSkipButton?: boolean;
}

export interface CourseCourseReviewProps extends isLocalAware {
  onClose?: () => void;
  modalType: 'course';
  onSubmit?: (rating: number, review: string) => void;
  onSkip?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  submitted?: boolean;
  variant?: 'card' | 'dialog';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showSkipButton?: boolean;
  /** Existing review text to display when submitted is true from database */
  existingReview?: string;
  /** Existing rating to display when submitted is true from database */
  existingRating?: number;
}

// The ReviewProps type is a union of CoachingReviewProps and CourseCourseReviewProps
export type ReviewProps = CoachingReviewProps | CourseCourseReviewProps;

/**
 * A modal component for submitting or skipping a review of a coaching session or course.
 * Supports both card and dialog variants.
 *
 * @param onClose Callback function triggered when the modal is closed.
 * @param modalType The type of review modal, either 'coaching' or 'course'.
 * @param onSubmit Callback function triggered when the review is submitted. Receives the rating, review text, and neededMoreTime flag.
 * @param onSkip Callback function triggered when the review is skipped.
 * @param locale The locale used for translations and localization.
 * @param isLoading Optional boolean indicating if the form is in a loading state. Defaults to false.
 * @param isError Optional boolean indicating if an error occurred during submission. Defaults to false.
 * @param submitted Optional boolean indicating if the review has been submitted. Defaults to false.
 * @param variant Optional variant, either 'card' or 'dialog'. Defaults to 'card'.
 * @param isOpen Required if variant is 'dialog', boolean indicating if the dialog is open.
 * @param onOpenChange Required if variant is 'dialog', callback for open state changes.
 * @param showSkipButton Optional boolean indicating whether to show the skip button. Defaults to true.
 *
 * @example
 * // Card variant (default)
 * <ReviewModal
 *   onClose={() => console.log("Modal closed")}
 *   modalType="coaching"
 *   onSubmit={(rating, review, neededMoreTime) => console.log("Review submitted:", { rating, review, neededMoreTime })}
 *   onSkip={() => console.log("Review skipped")}
 *   locale="en"
 *   variant="card"
 * />
 *
 * // Dialog variant
 * <ReviewModal
 *   onClose={() => console.log("Modal closed")}
 *   modalType="coaching"
 *   onSubmit={(rating, review, neededMoreTime) => console.log("Review submitted:", { rating, review, neededMoreTime })}
 *   onSkip={() => console.log("Review skipped")}
 *   locale="en"
 *   variant="dialog"
 *   isOpen={true}
 *   onOpenChange={(open) => console.log("Open changed:", open)}
 * />
 */
const CARD_FORM_WRAPPER_CLASSES =
  'relative w-[390px] flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)]';

const CARD_SUBMITTED_WRAPPER_CLASSES =
  'relative w-[390px] flex flex-col items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)]';

const ReviewModalBase: React.FC<ReviewProps> = (props) => {
  const {
    onClose,
    modalType,
    onSubmit,
    onSkip,
    locale,
    isLoading = false,
    isError = false,
    errorMessage,
    submitted: initialSubmitted = false,
    variant = 'card',
    isOpen,
    onOpenChange,
    showSkipButton = true,
  } = props;

  // Extract existing review data for course reviews
  const existingReview = modalType === 'course' ? (props as CourseCourseReviewProps).existingReview : undefined;
  const existingRating = modalType === 'course' ? (props as CourseCourseReviewProps).existingRating : undefined;

  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [neededMoreTime, setNeededMoreTime] = React.useState(false);
  const [submitted, setLocalSubmitted] = React.useState(initialSubmitted);
  const [submittedData, setSubmittedData] = React.useState({
    review: existingReview || '',
    rating: existingRating || 0
  });

  React.useEffect(() => {
    setLocalSubmitted(initialSubmitted);
    // Update submittedData when existing review data changes (e.g., loaded from database)
    if (initialSubmitted && (existingReview || existingRating)) {
      setSubmittedData({
        review: existingReview || '',
        rating: existingRating || 0
      });
    }
  }, [initialSubmitted, existingReview, existingRating]);

  const dictionary = getDictionary(locale);
  const isFormValid = rating > 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || !isFormValid) return;

    // Capture values before they might be reset
    setSubmittedData({ review, rating });

    // Call onSubmit and let parent/story handle submitted state
    onSubmit(rating, review, neededMoreTime);
  };


  const submittedContent = (
    <div className="flex flex-col w-full gap-6">

      <div className="flex items-start gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <IconSuccess classNames="text-feedback-success-primary" />
          <h5 className="text-lg text-base-white text-justify leading-none">
            {dictionary.components!.reviewModal!.thankYouText}
          </h5>

          <div className="bg-base-neutral-800 p-3 rounded-lg border border-card-stroke w-full">
            <p className="text-sm text-stone-300 text-justify line-clamp-3">{submittedData.review}</p>
            <div className="flex justify-end items-center gap-1">
              <StarRating rating={submittedData.rating} totalStars={5} />
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        variant="primary"
        size="medium"
        text={dictionary.components!.reviewModal!.closeButton}
        onClick={onClose}
      />
    </div>
  );

  const formContent = (
    <div className="w-full flex flex-col">
      <form onSubmit={handleReviewSubmit} className="flex flex-col items-end gap-4 w-full">
        {/* Title based on modal type */}
        <label
          htmlFor="courseRating"
          className="text-lg font-bold leading-tight text-white text-left w-full"
        >
          {modalType === 'coaching' ? dictionary.components!.reviewModal!.coachingTitle : dictionary.components!.reviewModal!.courseTitle}
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
          <label htmlFor="reviewText" className="self-start text-sm leading-[120%]">
            {dictionary.components!.reviewModal!.yourReview}
          </label>

          <div className="flex flex-col w-full text-base leading-6">
            <TextAreaInput
              className="px-3 pt-2.5 pb-4 w-full rounded-lg border border-stone-800 bg-stone-950 min-h-[104px] text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={dictionary.components!.reviewModal!.reviewPlaceholder}
              value={review}
              setValue={(value: string) => setReview(value)}
              aria-label="Course review"
            />
          </div>
        </div>
        {/* Show checkbox for modalType === 'coaching' only */}
        {modalType === 'coaching' && (
          <div className="flex items-center gap-2 w-full">
            <CheckBox
              label={dictionary.components!.reviewModal!.checkboxText}
              labelClass="text-text-primary text-sm leading-[100%]"
              name="profile-visibility"
              value="private-profile"
              withText={true}
              checked={neededMoreTime}
              onChange={() => setNeededMoreTime(!neededMoreTime)}
            />
          </div>
        )}

        {isError && (
          <Banner style="error" title={errorMessage || dictionary.components!.reviewModal!.errorState} />

        )}

        <div className="relative w-full">
          <Button
            className="w-full"
            variant="primary"
            size="medium"
            text={dictionary.components!.reviewModal!.sendReviewButton}
            disabled={!isFormValid || isLoading}
            type="submit"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {showSkipButton && (
          <Button
            className="w-full"
            variant="text"
            size="medium"
            text={dictionary.components!.reviewModal!.skipButton}
            onClick={onSkip}
            disabled={isLoading}
          />
        )}
      </form>
    </div>
  );

  if (submitted) {
    if (variant === 'dialog') {
      return (
        <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange?.(open); if (!open) onClose?.(); }} defaultOpen={false}>
          <DialogContent
            showCloseButton={true}
            closeOnOverlayClick={true}
            closeOnEscape={true}
            className="w-[390px] flex flex-col items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative"
          >
            {submittedContent}
          </DialogContent>
        </Dialog>
      );
    }

    return <div className={CARD_SUBMITTED_WRAPPER_CLASSES}>{submittedContent}</div>;
  }

  if (variant === 'dialog') {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange?.(open); if (!open) onClose?.(); }} defaultOpen={false}>
        <DialogContent
          showCloseButton={true}
          closeOnOverlayClick={true}
          closeOnEscape={true}
          className="w-[390px] flex flex-col items-end gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)]"
        >
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return <div className={CARD_FORM_WRAPPER_CLASSES}>{formContent}</div>;
};

export const ReviewModal: React.FC<ReviewProps> = (props) => (
  <ReviewModalBase {...props} />
);

type DialogVariantProps<T extends { isOpen?: any }> = Omit<T, 'variant'> & { variant?: never; isOpen: NonNullable<T['isOpen']>; };
type CardVariantProps<T> = Omit<T, 'variant' | 'isOpen' | 'onOpenChange'> & {
  variant?: never;
  isOpen?: never;
  onOpenChange?: never;
};

export type ReviewDialogProps = DialogVariantProps<CoachingReviewProps> | DialogVariantProps<CourseCourseReviewProps>;
export type ReviewCardProps = CardVariantProps<CoachingReviewProps> | CardVariantProps<CourseCourseReviewProps>;

export const ReviewDialog: React.FC<ReviewDialogProps> = (props) => (
  <ReviewModalBase {...props} variant="dialog" />
);

export const ReviewCard: React.FC<ReviewCardProps> = (props) => (
  <ReviewModalBase {...props} variant="card" />
);