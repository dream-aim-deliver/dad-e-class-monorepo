import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';
import { Button } from '../button';
import { IconPlus } from '../icons/icon-plus';
import { IconSearch } from '../icons/icon-search';
import { InputField } from '../input-field';
import { StarRating } from '../star-rating';
import { UserAvatar } from '../avatar/user-avatar';
import DefaultError from '../default-error';

interface DuplicationCourse {
    id: number;
    slug: string;
    title: string;
    averageRating: number;
    reviewCount: number;
    author: {
        username: string;
        name: string;
        surname: string;
        isYou: boolean;
        avatarUrl: string;
    };
}

interface CreateCourseModalProps extends isLocalAware {
    courses?: DuplicationCourse[];
    isLoading: boolean;
    onCreateNew: () => void;
    onDuplicate: (course: DuplicationCourse) => void;
    onQueryChange: (query: string) => void;
    onClose: () => void;
    hasSearchError?: boolean;
}

enum CreateCourseModalTab {
    CREATE_NEW = 'create-new',
    DUPLICATE = 'duplicate',
}

function CourseSearchSkeleton() {
    const getSingleSkeleton = () => (
        <div className="flex justify-between items-center mt-2 mb-2 bg-base-neutral-800 rounded-lg border border-base-neutral-700 p-4">
                {/* Skeleton title and rating*/}
                <div className="flex flex-col items-start gap-3 w-full animate-pulse">
                    <div className="w-80 h-6 bg-base-neutral-700 rounded-lg" />
                    <div className="w-40 h-4 bg-base-neutral-700 rounded-lg" />
                </div>
                {/* Skeleton avatar */}
                <div className="w-10 h-10 items-end rounded-full bg-base-neutral-700 animate-pulse" />
            </div>
    );
            

    return (
        <div className="flex flex-col">
            {getSingleSkeleton()}
            {getSingleSkeleton()}
        </div>
    );
}

interface DuplicationCourseCardProps extends isLocalAware {
    course: DuplicationCourse;
    onSelect: (course: DuplicationCourse) => void;
}

function DuplicationCourseCard({
    course,
    locale,
    onSelect,
}: DuplicationCourseCardProps) {
    const dictionary = getDictionary(locale).components.createContentModal;

    return (
        <li
            key={course.id}
            className={`p-4 cursor-pointer rounded-lg hover:bg-base-neutral-800`}
            onClick={() => onSelect(course)}
        >
            <div className="flex justify-between items-center mt-2 mb-2">
                <div className="flex flex-col items-start">
                    <h6 className="text-text-primary">{course.title}</h6>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating
                            totalStars={5}
                            size={'4'}
                            rating={course.averageRating}
                        />
                        <p className="text-text-primary text-sm font-important">
                            {course.averageRating}
                        </p>
                        <p className="text-xs text-text-secondary font-important">
                            ({course.reviewCount})
                        </p>
                    </div>
                </div>
                <div className="flex items-end gap-2 ml-4 ">
                    <UserAvatar
                        fullName={
                            course.author.name + ' ' + course.author.surname
                        }
                        size="xSmall"
                        imageUrl={course.author.avatarUrl}
                    />
                    <p className="text-sm text-text-secondary font-important">
                        {course.author.isYou
                            ? dictionary.you
                            : course.author.name + ' ' + course.author.surname}
                    </p>
                </div>
            </div>
        </li>
    );
}

export default function CreateCourseModal(props: CreateCourseModalProps) {
    const dictionary = getDictionary(props.locale).components
        .createContentModal;

    const [activeTab, setActiveTab] = useState<CreateCourseModalTab>(
        CreateCourseModalTab.CREATE_NEW,
    );
    const [searchQuery, setSearchQuery] = useState<string>('');

    const isQuerySuccessful = !props.isLoading && !props.hasSearchError;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-4 w-full">
                <h4 className="text-xl font-bold text-text-primary">
                    {dictionary.titleCourse}
                </h4>
                <p className="text-md text-text-primary">
                    {dictionary.descriptionCourse}
                </p>
            </div>
            <Tabs.Root
                defaultTab={CreateCourseModalTab.CREATE_NEW}
                defaultValue={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as CreateCourseModalTab)
                }
                className="w-full"
            >
                <TabList className="mb-4">
                    <TabTrigger value={CreateCourseModalTab.CREATE_NEW}>
                        {dictionary.startFromScratch}
                    </TabTrigger>
                    <TabTrigger value={CreateCourseModalTab.DUPLICATE}>
                        {dictionary.duplicateCourse}
                    </TabTrigger>
                </TabList>

                <TabContent value={CreateCourseModalTab.CREATE_NEW}>
                    <div className="flex justify-center items-center px-6 py-8 w-full rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700">
                        <Button
                            className="w-full"
                            variant="primary"
                            size="big"
                            text={dictionary.createNewCourse}
                            onClick={props.onCreateNew}
                            hasIconLeft
                            iconLeft={<IconPlus size="6" />}
                        />
                    </div>
                </TabContent>

                <TabContent value={CreateCourseModalTab.DUPLICATE}>
                    <div className="flex flex-col gap-4">
                        <InputField
                            value={searchQuery}
                            setValue={(value: string) => {
                                setSearchQuery(value);
                                props.onQueryChange(value);
                            }}
                            hasLeftContent={true}
                            inputText={dictionary.searchCourse}
                            leftContent={<IconSearch />}
                        />
                        {props.isLoading && <CourseSearchSkeleton />}
                        {isQuerySuccessful && props.courses && props.courses.length === 0 && (
                            <h6 className="text-text-primary">
                                {dictionary.noCourseFound}
                            </h6>
                        )}
                        {!props.isLoading && props.hasSearchError && <DefaultError locale={props.locale} />}
                        {isQuerySuccessful && props.courses && props.courses.length > 0 && (
                            <ul className="flex flex-col gap-4 max-h-70 overflow-y-auto">
                                {props.courses.map((course) => (
                                    <DuplicationCourseCard
                                        key={course.id}
                                        course={course}
                                        locale={props.locale}
                                        onSelect={props.onDuplicate}
                                    />
                                ))}
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
                onClick={props.onClose}
            />
        </div>
    );
}
