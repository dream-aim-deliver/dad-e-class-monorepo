'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { StarRating } from '../star-rating';
import { UserAvatar } from '../avatar/user-avatar';
import { useState } from 'react';
import { Button } from '../button';

export interface ReviewSnippetProps extends isLocalAware {
    reviewText: string;
    rating: number;
    reviewerName: string;
    reviewerAvatarUrl: string;
}

export const ReviewSnippet = ({
    reviewText,
    rating,
    reviewerName,
    reviewerAvatarUrl,
    locale,
}: ReviewSnippetProps) => {
    const dictionary = getDictionary(locale);

    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleText = () => {
        setIsExpanded((isExpanded) => !isExpanded);
    };

    const safeReviewText = reviewText ?? '';
    const isLongText = safeReviewText.length > 100;

    const truncatedText = isLongText
        ? `${safeReviewText.slice(0, 100)}...`
        : safeReviewText;

    return (
        <div className="flex flex-col w-full p-3 items-start text-text-secondary gap-1 text-sm bg-base-neutral-800 rounded-small border border-base-neutral-700">
            <div className="flex flex-row gap-3 items-left">
                <StarRating totalStars={5} rating={rating} />
                {dictionary.components.reviewSnippet.by}
                <UserAvatar
                    fullName={reviewerName}
                    size="xSmall"
                    imageUrl={reviewerAvatarUrl}
                />
                {reviewerName}
            </div>

            <p className="text-md text-text-primary text-left">
                {isExpanded ? safeReviewText : truncatedText}
            </p>
            {isLongText && (
                <Button
                    text={
                        isExpanded
                            ? dictionary.components.reviewSnippet.readLess
                            : dictionary.components.reviewSnippet.readMore
                    }
                    variant="text"
                    size="small"
                    onClick={handleToggleText}
                />
            )}
        </div>
    );
};
