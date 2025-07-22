import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import {
    useMemo,
    useState,
    ReactElement,
    isValidElement,
    Children,
} from 'react';
import { IconSearch } from '../../icons/icon-search';
import { InputField } from '../../input-field';
import { Button } from '../../button';

export interface CourseCardAddToPackageListProps extends isLocalAware {
    children?: React.ReactNode;
    onSearch: string;
}

interface CourseCardProps {
    title: string;
    author: {
        name: string;
    };
}

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

    const filteredCourses = useMemo(() => {
        const searchLower = search.toLowerCase();
        return childrenArray.filter(
            (child): child is ReactElement<CourseCardProps> => {
                return (
                    isValidElement<CourseCardProps>(child) &&
                    (child.props.title.toLowerCase().includes(searchLower) ||
                        child.props.author?.name
                            .toLowerCase()
                            .includes(searchLower))
                );
            },
        );
    }, [search, childrenArray]);

    const isEmpty = childrenArray.length === 0;

    return (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
            {isEmpty ? (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {dictionary.emptyState}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-row w-full items-center">
                        <InputField
                            value={search}
                            setValue={setSearch}
                            hasLeftContent
                            inputText={dictionary.searchCourse}
                            leftContent={<IconSearch />}
                            className='w-full'
                        />
                        <Button
                            className="w-full"
                            variant="primary"
                            size="medium"
                            text={dictionary.searchButton}
                            iconLeft={<IconSearch/>}
                        />
                    </div>

                    <div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full"
                        role="list"
                    >
                        {filteredCourses.map((child, index) => (
                            <div
                                key={child.key ?? `course-card-${index}`}
                                role="listitem"
                            >
                                {child}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
