'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from '../tabs/tab';
import { Button } from '../button';
import { IconPlus } from '../icons/icon-plus';
import { IconSearch } from '../icons/icon-search';
import { InputField } from '../input-field';
import DefaultError from '../default-error';
import { ConfirmationModal } from '../confirmation-modal';

interface DuplicationCourse {
    id: number;
    slug: string;
    title: string;
    author: {
        name: string;
        surname: string;
        isYou: boolean;
        avatarUrl?: string;
    };
}

interface CreateCourseModalProps extends isLocalAware {
    courses?: DuplicationCourse[];
    isLoading: boolean;
    onCreateNew: () => void;
    onDuplicate: (course: DuplicationCourse) => void | Promise<void>;
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
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                    <h6 className="text-text-primary">{course.title}</h6>
                    <p className="text-sm text-text-secondary">
                        {dictionary.slug} {course.slug}
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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<DuplicationCourse | null>(null);
    const [isDuplicating, setIsDuplicating] = useState(false);

    const isQuerySuccessful = !props.isLoading && !props.hasSearchError;

    // Filter courses locally based on search query
    const filteredCourses = props.courses?.filter((course) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            course.title.toLowerCase().includes(query) ||
            course.slug.toLowerCase().includes(query) ||
            `${course.author.name} ${course.author.surname}`.toLowerCase().includes(query)
        );
    });

    const handleCourseClick = (course: DuplicationCourse) => {
        setSelectedCourse(course);
        setShowConfirmModal(true);
    };

    const handleConfirmDuplicate = async () => {
        if (selectedCourse) {
            setIsDuplicating(true);
            try {
                await props.onDuplicate(selectedCourse);
            } finally {
                setIsDuplicating(false);
                setShowConfirmModal(false);
                setSelectedCourse(null);
            }
        }
    };

    const handleCancelDuplicate = () => {
        if (!isDuplicating) {
            setShowConfirmModal(false);
            setSelectedCourse(null);
        }
    };

    const tabs = [
        {
            value: CreateCourseModalTab.CREATE_NEW,
            label: dictionary.startFromScratch,
        },
        {
            value: CreateCourseModalTab.DUPLICATE,
            label: dictionary.duplicateCourse,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <Tabs.Root
                defaultTab={CreateCourseModalTab.CREATE_NEW}
                defaultValue={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as CreateCourseModalTab)
                }
                className="w-full"
            >
                <TabList className="mb-4 bg-base-neutral-800 border border-base-neutral-700">
                    {tabs.map((tab, index) => (
                        <TabTrigger
                            key={tab.value}
                            value={tab.value}
                            isLast={index === tabs.length - 1}
                        >
                            {tab.label}
                        </TabTrigger>
                    ))}
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
                        {isQuerySuccessful &&
                            filteredCourses &&
                            filteredCourses.length === 0 && (
                                <h6 className="text-text-primary">
                                    {dictionary.noCourseFound}
                                </h6>
                            )}
                        {!props.isLoading && props.hasSearchError && (
                            <DefaultError
                                type="simple"
                                locale={props.locale}
                                title={dictionary.searchFailedTitle}
                                description={dictionary.searchFailedDescription}
                            />
                        )}
                        {isQuerySuccessful &&
                            filteredCourses &&
                            filteredCourses.length > 0 && (
                                <ul className="flex flex-col max-h-70 overflow-y-auto">
                                    {filteredCourses.map((course) => (
                                        <DuplicationCourseCard
                                            key={course.id}
                                            course={course}
                                            locale={props.locale}
                                            onSelect={handleCourseClick}
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

            <ConfirmationModal
                type="accept"
                isOpen={showConfirmModal}
                onClose={handleCancelDuplicate}
                onConfirm={handleConfirmDuplicate}
                title={dictionary.confirmDuplicateTitle}
                message={`${dictionary.confirmDuplicateMessage} "${selectedCourse?.title}"`}
                confirmText={dictionary.confirmDuplicateButton}
                cancelText={dictionary.goBack}
                locale={props.locale}
                isLoading={isDuplicating}
            />
        </div>
    );
}
