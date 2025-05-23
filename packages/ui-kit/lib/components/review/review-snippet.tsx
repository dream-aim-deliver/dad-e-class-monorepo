import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { StarRating } from '../star-rating';
import { UserAvatar } from '../avatar/user-avatar';
import { useState } from 'react';
import { Button } from '../button';

export interface ReviewSnippetProps extends isLocalAware {
    reviewText: string;
    rating: number;
    reviewerName: string;
    reviewerIsUser: boolean;
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

    const isLongText = reviewText.length > 100;

    const truncatedText = isLongText
        ? `${reviewText.slice(0, 100)}...`
        : reviewText;

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
                "{isExpanded ? reviewText : truncatedText}"
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
