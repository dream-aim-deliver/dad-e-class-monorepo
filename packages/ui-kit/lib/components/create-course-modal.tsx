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

export interface CreateCourseModalProps extends isLocalAware {
    onClose: () => void;
    onCreateNewCourseDraft: () => void;
    onDuplicateCourse: (courseId: string) => void;
    courses: {
        id: string;
        title: string;
        ownerName: string;
        ownerAvatarUrl: string;
        isYou: boolean;
        totalRating: number;
        rating: number;
    }[];
}

export const CreateCourseModal = ({
    onClose,
    onCreateNewCourseDraft,
    onDuplicateCourse,
    locale,
    courses,
}: CreateCourseModalProps) => {
    const dictionary = getDictionary(locale).components.createCourseModal;

    const [activeTab, setActiveTab] = useState('start from scratch');

    const [searchCourses, setSearchCourses] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<
        null | (typeof courses)[0]
    >(null);

    const filteredCourses = useMemo(() => {
        const search = searchCourses.toLowerCase();
        return courses.filter(
            (course) =>
                course.title.toLowerCase().includes(search) ||
                course.ownerName.toLowerCase().includes(search),
        );
    }, [searchCourses, courses]);

    const handleSelect = (course: (typeof courses)[0]) => {
        setSelectedCourse(course);
        setSearchCourses(course.title);
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
                    {dictionary.title}
                </h4>
                <p className="text-md text-text-primary">
                    {dictionary.description}
                </p>
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
                        {dictionary.duplicateCourse}
                    </TabTrigger>
                </TabList>

                <TabContent value="start from scratch">
                    <div className="flex justify-center items-center px-6 py-8 w-full rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700">
                        <Button
                            className="w-full"
                            variant="primary"
                            size="big"
                            text={dictionary.createNewCourse}
                            onClick={onCreateNewCourseDraft}
                            hasIconLeft
                            iconLeft={<IconPlus size="6" />}
                        />
                    </div>
                </TabContent>

                <TabContent value="duplicate course">
                    <div className="flex flex-col gap-4">
                        <InputField
                            value={searchCourses}
                            setValue={(value: string) => {
                                setSearchCourses(value);
                                setSelectedCourse(null);
                            }}
                            hasLeftContent={true}
                            inputText={dictionary.searchCourse}
                            leftContent={<IconSearch />}
                        />
                        {searchCourses.trim() && (
                            <ul className='max-h-70 overflow-y-auto pr-2'>
                                {filteredCourses.length === 0 ? (
                                    <li>
                                        <h6 className="text-text-primary mb-4">
                                            {dictionary.noCourseFound}
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
                                    filteredCourses.map((course, idx) => (
                                        <li
                                            key={idx}
                                            className={`p-4 cursor-pointer rounded-lg hover:bg-base-neutral-800 ${selectedCourse === course ? 'bg-base-neutral-800' : ''}`}
                                            onClick={() => handleSelect(course)}
                                        >
                                            <div className="flex justify-between items-center mt-2 mb-2">
                                                <div className="flex flex-col items-start">
                                                    <h6 className="text-text-primary">
                                                        {course.title}
                                                    </h6>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StarRating
                                                            totalStars={5}
                                                            size={'4'}
                                                            rating={
                                                                course.rating
                                                            }
                                                        />
                                                        <p className="text-text-primary text-sm font-important">
                                                            {course.rating}
                                                        </p>
                                                        <p className="text-xs text-text-secondary font-important">
                                                            (
                                                            {course.totalRating}
                                                            )
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-end gap-2 ml-4 ">
                                                    <UserAvatar
                                                        fullName={
                                                            course.ownerName
                                                        }
                                                        size="xSmall"
                                                        imageUrl={
                                                            course.ownerAvatarUrl
                                                        }
                                                    />
                                                    <p className="text-sm text-text-secondary font-important">
                                                        {course.isYou
                                                            ? dictionary.you
                                                            : course.ownerName}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedCourse === course && (
                                                <div className="mt-2">
                                                    <Button
                                                        className="w-full"
                                                        variant="primary"
                                                        size="big"
                                                        text={
                                                            dictionary.duplicateCourse
                                                        }
                                                        onClick={() =>
                                                            onDuplicateCourse(
                                                                selectedCourse.id,
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
