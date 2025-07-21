import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useMemo, useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './tabs/tab';
import { IconButton } from './icon-button';
import { IconClose } from './icons/icon-close';
import { Button } from './button';
import { IconPlus } from './icons/icon-plus';
import { IconSearch } from './icons/icon-search';
import { InputField } from './input-field';
import { StarRating } from './star-rating';
import { UserAvatar } from './avatar/user-avatar';

type ContentItem = {
    id: string;
    title: string;
    ownerName: string;
    ownerAvatarUrl: string;
    isYou: boolean;
    totalRating: number;
    rating: number;
};

export interface CreateContentModalProps extends isLocalAware {
    variant: 'course' | 'lesson';
    onClose: () => void;
    onCreateNewContentDraft: () => void;
    onDuplicateContent: (id: string) => void;
    content: ContentItem[];
}

/**
 * A modal component for creating or duplicating content, such as courses or lessons.
 *
 * Provides two main workflows:
 * 1. Start from scratch – allows users to create a new content draft.
 * 2. Duplicate existing – allows users to search and duplicate existing content.
 *
 * @param variant Specifies the type of content being created (`"course"` or `"lesson"`), which controls labels and logic.
 * @param onClose Callback function triggered when the modal is closed.
 * @param onCreateNewContentDraft Callback function triggered when the user chooses to start from scratch.
 * @param onDuplicateContent Callback function triggered when the user duplicates an existing item. Receives the `id` of the selected item.
 * @param content List of content items available for duplication.
 * @param locale Current locale used for dictionary translation.
 *
 * @example
 * <CreateContentModal
 *   variant="course"
 *   onClose={() => console.log("Modal closed")}
 *   onCreateNewContentDraft={() => console.log("New draft")}
 *   onDuplicateContent={(id) => console.log("Duplicate content", id)}
 *   content={[
 *     { id: "1", title: "React Basics", ownerName: "Jane Doe", ownerAvatarUrl: "/avatar1.jpg", isYou: true, rating: 4.5, totalRating: 200 }
 *   ]}
 *   locale="en"
 * />
 */

export const CreateContentModal = ({
    variant,
    onClose,
    onCreateNewContentDraft: onCreateNewCourseDraft,
    onDuplicateContent: onDuplicateCourse,
    locale,
    content,
}: CreateContentModalProps) => {
    const dictionary = getDictionary(locale).components.createContentModal;

    // Determine labels based on the variant
    const createNewLabel =
        variant === 'lesson'
            ? dictionary.createNewLesson
            : dictionary.createNewCourse;
    const duplicateLabel =
        variant === 'lesson'
            ? dictionary.duplicateLesson
            : dictionary.duplicateCourse;
    const searchLabel =
        variant === 'lesson'
            ? dictionary.searchLesson
            : dictionary.searchCourse;
    const noFoundLabel =
        variant === 'lesson'
            ? dictionary.noLessonFound
            : dictionary.noCourseFound;
    const titleLabel =
        variant === 'lesson' ? dictionary.titleLesson : dictionary.titleCourse;
    const descriptionLabel =
        variant === 'lesson'
            ? dictionary.descriptionLesson
            : dictionary.descriptionCourse;

    const [activeTab, setActiveTab] = useState('start from scratch');

    const [searchContent, setSearchContent] = useState('');
    const [selectedItem, setSelectedItem] = useState<null | ContentItem>(null);

    const filteredItems = useMemo(() => {
        const search = searchContent.toLowerCase();
        return content.filter(
            (item) =>
                item.title.toLowerCase().includes(search) ||
                item.ownerName.toLowerCase().includes(search),
        );
    }, [searchContent, content]);

    const handleSelect = (item: ContentItem) => {
        setSelectedItem(item);
        setSearchContent(item.title);
    };

    return (
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
                    {titleLabel}
                </h4>
                <p className="text-md text-text-primary">{descriptionLabel}</p>
            </div>
            <Tabs.Root
                defaultTab="start from scratch"
                defaultValue={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabList className="grid w-full grid-cols-2 mb-4">
                    <TabTrigger value="start from scratch">
                        {dictionary.startFromScratch}
                    </TabTrigger>
                    <TabTrigger value="duplicate course">
                        {duplicateLabel}
                    </TabTrigger>
                </TabList>

                <TabContent value="start from scratch">
                    <div className="flex justify-center items-center px-6 py-8 w-full rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700">
                        <Button
                            className="w-full"
                            variant="primary"
                            size="big"
                            text={createNewLabel}
                            onClick={onCreateNewCourseDraft}
                            hasIconLeft
                            iconLeft={<IconPlus size="6" />}
                        />
                    </div>
                </TabContent>

                <TabContent value="duplicate course">
                    <div className="flex flex-col gap-4">
                        <InputField
                            value={searchContent}
                            setValue={(value: string) => {
                                setSearchContent(value);
                                setSelectedItem(null);
                            }}
                            hasLeftContent={true}
                            inputPlaceholder={searchLabel}
                            leftContent={<IconSearch />}
                        />
                        {searchContent.trim() && (
                            <ul className="max-h-70 overflow-y-auto pr-2">
                                {filteredItems.length === 0 ? (
                                    <li>
                                        <h6 className="text-text-primary mb-4">
                                            {noFoundLabel}
                                        </h6>
                                        <div className="flex justify-between items-center mt-2 mb-2 bg-base-neutral-800 rounded-lg border border-base-neutral-700 p-4">
                                            {/* Skeleton title and rating*/}
                                            <div className="flex flex-col items-start gap-3 w-full animate-pulse">
                                                <div className="w-100 h-6 bg-base-neutral-700 rounded-lg" />
                                                <div className="w-70 h-4 bg-base-neutral-700 rounded-lg" />
                                            </div>
                                            {/* Skeleton avatar */}
                                            <div className="w-10 h-10 items-end rounded-full bg-base-neutral-700 animate-pulse" />
                                        </div>
                                        <div className="flex justify-between items-center bg-base-neutral-800 rounded-lg border border-base-neutral-700 p-4">
                                            {/* Skeleton title and rating*/}
                                            <div className="flex flex-col items-start gap-3 w-full animate-pulse">
                                                <div className="w-100 h-6 bg-base-neutral-700 rounded-lg" />
                                                <div className="w-70 h-4 bg-base-neutral-700 rounded-lg" />
                                            </div>
                                            {/* Skeleton avatar */}
                                            <div className="w-10 h-10 items-end rounded-full bg-base-neutral-700 animate-pulse" />
                                        </div>
                                    </li>
                                ) : (
                                    filteredItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className={`p-4 cursor-pointer rounded-lg hover:bg-base-neutral-800 ${selectedItem === item ? 'bg-base-neutral-800' : ''}`}
                                            onClick={() => handleSelect(item)}
                                        >
                                            <div className="flex justify-between items-center mt-2 mb-2">
                                                <div className="flex flex-col items-start">
                                                    <h6 className="text-text-primary">
                                                        {item.title}
                                                    </h6>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StarRating
                                                            totalStars={5}
                                                            size={'4'}
                                                            rating={item.rating}
                                                        />
                                                        <p className="text-text-primary text-sm font-important">
                                                            {item.rating}
                                                        </p>
                                                        <p className="text-xs text-text-secondary font-important">
                                                            ({item.totalRating})
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-end gap-2 ml-4 ">
                                                    <UserAvatar
                                                        fullName={
                                                            item.ownerName
                                                        }
                                                        size="xSmall"
                                                        imageUrl={
                                                            item.ownerAvatarUrl
                                                        }
                                                    />
                                                    <p className="text-sm text-text-secondary font-important">
                                                        {item.isYou
                                                            ? dictionary.you
                                                            : item.ownerName}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedItem === item && (
                                                <div className="mt-2">
                                                    <Button
                                                        className="w-full"
                                                        variant="primary"
                                                        size="big"
                                                        text={duplicateLabel}
                                                        onClick={() =>
                                                            onDuplicateCourse(
                                                                selectedItem.id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                </TabContent>
            </Tabs.Root>

            <Button
                className="w-full"
                variant="text"
                size="medium"
                text={dictionary.close}
                onClick={onClose}
            />
        </div>
    );
};
