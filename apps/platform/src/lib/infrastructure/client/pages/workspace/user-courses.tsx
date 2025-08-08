'use client';

import {
    Breadcrumbs,
    Button,
    CreateCourseModal,
    Dialog,
    DialogContent,
    DialogTrigger,
    PageTitle,
    useDialog,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import UserCoursesList from './user-courses-list';
import { trpc } from '../../trpc/client';
import { useEffect, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useSearchCoursesPresenter } from '../../hooks/use-courses-presenter';
import { useRouter } from 'next/navigation';

interface UserCoursesProps {
    roles: string[];
}

function useDebounce(value: any, delay: number): any {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function CreateCourseDialogContent() {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const { setIsOpen } = useDialog();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 250);

    const {
        data: searchResponse,
        isFetching,
        error,
    } = trpc.searchCourses.useQuery(
        {
            titleContains: debouncedSearchQuery,
            pagination: {
                page: 1,
                pageSize: 4,
            },
        },
        {},
    );
    const [searchViewModel, setSearchViewModel] = useState<
        viewModels.TCourseSearchViewModel | undefined
    >(undefined);
    const { presenter } = useSearchCoursesPresenter(setSearchViewModel);
    useEffect(() => {
        if (searchResponse) {
            presenter.present(searchResponse, searchViewModel);
        }
    }, [searchResponse, setSearchViewModel]);

    const courses =
        searchViewModel?.mode === 'default' ? searchViewModel.data.courses : [];

    return (
        <div className="p-6">
            <CreateCourseModal
                locale={locale}
                isLoading={isFetching}
                onCreateNew={() => {
                    router.push('/create/course');
                    setIsOpen(false);
                }}
                onDuplicate={(course) => {
                    router.push(`/create/course?duplicate=${course.slug}`);
                    setIsOpen(false);
                }}
                onQueryChange={(query) => setSearchQuery(query)}
                courses={courses.map((course) => ({
                    ...course,
                    author: {
                        ...course.author,
                        isYou: false,
                        avatarUrl: course.author.avatarUrl ?? '',
                    },
                }))}
                onClose={() => setIsOpen(false)}
                hasSearchError={!!error || searchViewModel?.mode === 'kaboom'}
            />
        </div>
    );
}

function CreateCourseDialog() {
    const pageTranslations = useTranslations('pages.userCourses');

    return (
        <Dialog open={undefined} onOpenChange={() => {}} defaultOpen={false}>
            <DialogTrigger asChild>
                <Button text={pageTranslations('createCourse')} />
            </DialogTrigger>
            <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                <CreateCourseDialogContent />
            </DialogContent>
        </Dialog>
    );
}

export default function UserCourses(props: UserCoursesProps) {
    const locale = useLocale() as TLocale;
    const isAdmin = props.roles.includes('admin');

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const pageTranslations = useTranslations('pages.userCourses');

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => {},
                    },
                    {
                        label: breadcrumbsTranslations('workspace'),
                        onClick: () => {},
                    },
                    {
                        label: breadcrumbsTranslations('courses'),
                        onClick: () => {},
                    },
                ]}
            />
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <PageTitle text={pageTranslations('yourCourses')} />
                {isAdmin && <CreateCourseDialog />}
                {!isAdmin && (
                    <Button text={pageTranslations('becomeCourseCreator')} />
                )}
            </div>
            <UserCoursesList />
        </div>
    );
}
