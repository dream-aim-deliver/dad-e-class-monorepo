'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useMemo, useState } from 'react';
import { IconButton } from './icon-button';
import { IconClose } from './icons/icon-close';
import { Button } from './button';
import { IconPlus } from './icons/icon-plus';
import { IconSearch } from './icons/icon-search';
import { InputField } from './input-field';
import { StarRating } from './star-rating';
import { UserAvatar } from './avatar/user-avatar';

type CoachContent = {
    id: string;
    coachName: string;
    coachAvatarUrl: string;
    totalRating: number;
    rating: number;
};

export interface AddCoachModalProps extends isLocalAware {
    onClose: () => void;
    onAdd: (id: string) => void;
    content: CoachContent[];
    addedCoachIds?: string[];
}


const SkeletonCoachItem = () => (
    <div className="flex justify-between items-center rounded-lg gap-2 p-4">
        {/* Skeleton avatar */}
        <div className="w-18 h-15 items-end rounded-full bg-base-neutral-700 animate-pulse" />
        {/* Skeleton title and rating*/}
        <div className="flex flex-col items-start gap-3 w-full animate-pulse">
            <div className="w-50 h-6 bg-base-neutral-700 rounded-lg" />
            <div className="w-30 h-4 bg-base-neutral-700 rounded-lg" />
        </div>
    </div>

);

/**
 * A modal component for searching and adding coaches to a selection list.
 *
 * Provides a UI to:
 * 1. Search coaches by name.
 * 2. Add a coach by triggering a callback with the coach's ID.
 * 3. View coach details including avatar and average rating.
 * 4. Display a "no coaches found" state with a loading skeleton UI when search results are empty.
 *
 * The component supports localization via the `locale` prop and uses translated
 * labels from the dictionary system in `@maany_shr/e-class-translations`.
 *
 * @param onClose Callback triggered when the modal is closed.
 * @param onAdd Callback triggered when a coach is added. Receives the coach's `id`.
 * @param locale Current locale used for fetching localized dictionary labels.
 * @param content List of all available coach profiles.
 * @param addedCoachIds (Optional) List of coach IDs that have already been added.
 *
 * @typedef {Object} CoachContent
 * @property {string} id Unique identifier for the coach.
 * @property {string} coachName Display name of the coach.
 * @property {string} coachAvatarUrl URL to the coach’s avatar image.
 * @property {number} totalRating Number of total ratings received.
 * @property {number} rating Average rating (0–5).
 *
 * @example
 * <AddCoachModal
 *   locale="en"
 *   onClose={() => console.log("Modal closed")}
 *   onAdd={(id) => console.log("Added coach:", id)}
 *   content={[
 *     {
 *       id: "coach-1",
 *       coachName: "John Doe",
 *       coachAvatarUrl: "/avatars/john.jpg",
 *       totalRating: 150,
 *       rating: 4.8
 *     }
 *   ]}
 *   addedCoachIds={["coach-1"]}
 * />
 */

export const AddCoachModal = ({
    onClose,
    onAdd,
    locale,
    content,
    addedCoachIds = [],
}: AddCoachModalProps) => {
    const dictionary = getDictionary(locale).components?.addCoachModal;
    
    if (!dictionary) {
        // This should never happen as dictionary is always defined
        return null;
    }

    const [searchContent, setSearchContent] = useState('');

    const filteredCoaches = useMemo(() => {
        const search = searchContent.toLowerCase();
        return content.filter((coach) =>
            coach.coachName.toLowerCase().includes(search),
        );
    }, [searchContent, content]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col w-[560px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
                <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text"
                />
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
                <h4 className="text-xl font-bold text-text-primary">
                    {dictionary.title}
                </h4>
                <p className="text-md text-text-primary">
                    {dictionary.description}
                </p>
            </div>
            <div className="flex flex-col w-full gap-4">
                <InputField
                    value={searchContent}
                    setValue={(value: string) => {
                        setSearchContent(value);
                    }}
                    hasLeftContent={true}
                    inputText={dictionary.searchLabel || ''}
                    leftContent={<IconSearch />}
                />
                {/* No coaches found & skeleton */}
                {searchContent.trim() && (
                    <ul className="max-h-70 overflow-y-auto pr-2">
                        {filteredCoaches.length === 0 ? (
                            <li>
                                <h6 className="text-text-primary mb-4">
                                    {dictionary.noFoundLabel}
                                </h6>
                                <SkeletonCoachItem />
                                <SkeletonCoachItem />
                            </li>
                        ) : (
                            filteredCoaches.map((coach) => {
                                const isAdded = addedCoachIds.includes(
                                    coach.id,
                                );
                                // List of coaches & content
                                return (
                                    <li
                                        key={coach.id}
                                        className={`p-4 rounded-lg hover:bg-base-neutral-800 cursor-default`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-row items-center gap-3">
                                                <UserAvatar
                                                    fullName={coach.coachName}
                                                    size="medium"
                                                    imageUrl={
                                                        coach.coachAvatarUrl
                                                    }
                                                />
                                                <div className="flex flex-col items-start">
                                                    <h6 className="text-text-primary">
                                                        {coach.coachName}
                                                    </h6>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StarRating
                                                            totalStars={5}
                                                            size={'4'}
                                                            rating={
                                                                coach.rating
                                                            }
                                                        />
                                                        <p className="text-text-primary text-sm font-important">
                                                            {coach.rating}
                                                        </p>
                                                        <p className="text-xs text-text-secondary font-important">
                                                            ({coach.totalRating}
                                                            )
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Show Add Button or Added Label */}
                                            <div className="flex items-end">
                                                {isAdded ? (
                                                    <span className="text-text-secondary text-sm">
                                                        {dictionary.addedLabel}
                                                    </span>
                                                ) : (
                                                    <Button
                                                        className="w-full"
                                                        size="small"
                                                        variant="secondary"
                                                        hasIconLeft
                                                        iconLeft={
                                                            <IconPlus size="4" />
                                                        }
                                                        text={
                                                            dictionary.addButton
                                                        }
                                                        onClick={() =>
                                                            onAdd(coach.id)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                )}
            </div>

            <Button
                className="w-full"
                variant="text"
                size="medium"
                text={dictionary.closeButton || ''}
                onClick={onClose}
            />
            </div>
        </div>
    );
};
