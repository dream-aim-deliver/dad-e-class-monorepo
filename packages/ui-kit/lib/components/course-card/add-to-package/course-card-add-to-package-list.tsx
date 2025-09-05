import {
    useMemo,
    useState,
    ReactElement,
    isValidElement,
    Children,
    useEffect,
} from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconSearch } from '../../icons/icon-search';
import { InputField } from '../../input-field';
import { Button } from '../../button';
import Banner from '../../banner';

export interface CourseCardAddToPackageListProps extends isLocalAware {
    children?: React.ReactNode;
    onSearch: () => void;
}

interface CourseCardProps {
    title: string;
    author: {
        name: string;
    };
    courseAdded: boolean;
}

function useResponsiveSkeletonCount() {
    const [count, setCount] = useState(3);

    useEffect(() => {
        function updateCount() {
            if (window.innerWidth >= 1280) {
                setCount(3);
            } else if (window.innerWidth >= 768) {
                setCount(2);
            } else {
                setCount(1);
            }
        }
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    return count;
}

/**
 * CourseCardAddToPackageList
 *
 * A layout and filtering component that manages a list of `CourseCardAddToPackage` components.
 * It provides search functionality, distinguishes between included and not-included courses,
 * and displays appropriate UI for each section. This component is intended to be used in
 * course package configuration flows.
 *
 * Features:
 * - Displays included courses
 * - Filters not-included (available) courses using a search input
 * - Localized labels and messages using the provided `locale`
 * - Responsive skeleton loading when no results are found
 * - Handles UI layout across breakpoints with a responsive grid
 *
 * Props:
 * @param {React.ReactNode} [children] - The list of `CourseCardAddToPackage` components to display and manage
 * @param {TLocale} locale - The current locale for fetching translated labels
 * @param {() => void} onSearch - Callback triggered when the search button is clicked
 *
 * Course Card Child Requirements:
 * Each child passed to this component should be a valid ReactElement with at least the following props:
 * @param {string} title - Course title used for filtering
 * @param {{ name: string }} author - Author's name used for filtering
 * @param {boolean} courseAdded - Determines if the course is already included or not
 *
 * Usage:
 * ```tsx
 * <CourseCardAddToPackageList locale="en" onSearch={handleSearch}>
 *   {courses.map((course) => (
 *     <CourseCardAddToPackage
 *       key={course.id}
 *       title={course.title}
 *       rating={course.rating}
 *       reviewCount={course.reviewCount}
 *       language={course.language}
 *       sessions={course.sessions}
 *       author={course.author}
 *       duration={course.duration}
 *       sales={course.sales}
 *       imageUrl={course.imageUrl}
 *       courseAdded={course.isIncluded}
 *       onAddOrRemove={() => toggleCourse(course.id)}
 *       onClickUser={() => viewAuthor(course.author.id)}
 *       locale="en"
 *     />
 *   ))}
 * </CourseCardAddToPackageList>
 * ```
 */

export function CourseCardAddToPackageList({
    children,
    locale,
    onSearch,
}: CourseCardAddToPackageListProps) {
    const dictionary = getDictionary(locale).components.courseCard;
    const [search, setSearch] = useState('');

    const childrenArray = useMemo(() => {
        return Children.toArray(children).filter(isValidElement);
    }, [children]);

    // Always show included courses (not filtered by search)
    const includedCourses = useMemo(() => {
        return childrenArray.filter(
            (child): child is ReactElement<CourseCardProps> =>
                isValidElement<CourseCardProps>(child) &&
                child.props.courseAdded === false,
        );
    }, [childrenArray]);

    // Filter only not-included courses by search
    const filteredNotIncludedCourses = useMemo(() => {
        const searchLower = search.toLowerCase();
        return childrenArray.filter(
            (child): child is ReactElement<CourseCardProps> =>
                isValidElement<CourseCardProps>(child) &&
                child.props.courseAdded === true &&
                (child.props.title.toLowerCase().includes(searchLower) ||
                    child.props.author?.name
                        .toLowerCase()
                        .includes(searchLower)),
        );
    }, [search, childrenArray]);

    const showNoResultsSkeleton =
        search.length > 0 && filteredNotIncludedCourses.length === 0;

    const skeletonCount = useResponsiveSkeletonCount();

    return (
        <div className="flex flex-col border border-card-stroke bg-card-fill p-6 gap-6 w-full rounded-medium">
            <h3 className="text-text-primary">
                {dictionary.includeCoursesTitle}
            </h3>

            {/* Included courses section */}
            <div className="flex flex-col gap-4 justify-center w-full">
                {includedCourses.length > 0 && (
                    <h5 className="text-text-primary">
                        {`${dictionary.includedCoursesCount} (${includedCourses.length})`}
                    </h5>
                )}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full"
                    role="list"
                >
                    {includedCourses.length > 0 ? (
                        includedCourses.map((child, index) => (
                            <div
                                key={
                                    child.key ?? `included-course-card-${index}`
                                }
                                role="listitem"
                            >
                                {child}
                            </div>
                        ))
                    ) : (
                        <Banner
                            title={dictionary.emptyState}
                            style="warning"
                            className="w-fit"
                        />
                    )}
                </div>
            </div>

            {/* All courses & searchbox section */}
            <div className="flex flex-col gap-4 justify-center w-full">
                <h5 className="text-text-primary">
                    {dictionary.allCoursesTitle}
                </h5>
                <div className="flex flex-row w-full items-center gap-3">
                    <InputField
                        value={search}
                        setValue={setSearch}
                        hasLeftContent
                        inputText={dictionary.searchCourse}
                        leftContent={<IconSearch />}
                        className="w-full"
                    />
                    <Button
                        variant="primary"
                        onClick={onSearch}
                        size="medium"
                        text={dictionary.searchButton}
                        hasIconLeft
                        iconLeft={<IconSearch />}
                    />
                </div>

                {showNoResultsSkeleton ? (
                    <div className="flex flex-col w-full gap-4 mt-4">
                        <p className="text-text-primary text-md">
                            {dictionary.noFoundLabel}
                        </p>
                        <div className="flex flex-row gap-3">
                            {Array.from({ length: skeletonCount }).map(
                                (_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="flex flex-col pb-4 bg-base-neutral-800 border border-base-neutral-700 w-full lg:w-[21rem] rounded-lg animate-pulse"
                                    >
                                        <div className="w-full h-40 bg-base-neutral-700 rounded-md" />
                                        <div className="flex flex-col gap-4 p-4">
                                            <div className="w-3/4 h-6 bg-base-neutral-700 rounded-md" />
                                            <div className="w-1/2 h-4 bg-base-neutral-700 rounded-md" />
                                            <div className="w-1/3 h-4 bg-base-neutral-700 rounded-md" />
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full"
                        role="list"
                    >
                        {filteredNotIncludedCourses.map((child, index) => (
                            <div
                                key={
                                    child.key ??
                                    `not-included-course-card-${index}`
                                }
                                role="listitem"
                            >
                                {child}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
