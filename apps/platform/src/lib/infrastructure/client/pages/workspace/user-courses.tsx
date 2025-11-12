'use client';

import {
    Breadcrumbs,
    Button,
    CreateCourseModal,
    Dialog,
    DialogContent,
    DialogTrigger,
    useDialog,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import UserCoursesList from './user-courses-list';
import { trpc } from '../../trpc/cms-client';
import { useEffect, useState } from 'react';
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
        data: coursesResponse,
        isFetching,
        error,
    } = trpc.listPlatformCoursesShort.useQuery({});

    const courses = coursesResponse?.success && (coursesResponse as any).data.courses
        ? (coursesResponse as any).data.courses.filter((course: any) =>
              course.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          )
        : [];

    const utils = trpc.useUtils();
    const duplicateCourseMutation = trpc.duplicateCourse.useMutation();

    return (
        <div className="p-6">
            <CreateCourseModal
                locale={locale}
                isLoading={isFetching}
                onCreateNew={() => {
                    router.push('/create/course');
                    setIsOpen(false);
                }}
                onDuplicate={async (course) => {
                    await duplicateCourseMutation.mutateAsync({
                        sourceCourseSlug: course.slug,
                    });
                    setIsOpen(false);
                    // Invalidate the user courses list to refetch and show the new duplicated course
                    utils.listUserCourses.invalidate();
                    utils.listPlatformCoursesShort.invalidate();
                }}
                onQueryChange={(query) => setSearchQuery(query)}
                courses={courses.map((course: any) => ({
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    author: {
                        name: '',
                        surname: '',
                        isYou: false,
                    },
                }))}
                onClose={() => setIsOpen(false)}
                hasSearchError={!!error || (coursesResponse?.success === false)}
            />
        </div>
    );
}

function CreateCourseDialog() {
    const pageTranslations = useTranslations('pages.userCourses');

    return (
        <Dialog
            open={undefined}
            onOpenChange={() => {
                // This function is called when the dialog is opened or closed
            }}
            defaultOpen={false}
        >
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
    const canCreateCourse = props.roles.includes('superadmin') || props.roles.includes('admin') || props.roles.includes('course_creator');
    const isStudent = props.roles.includes('student');
    const router = useRouter();

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const pageTranslations = useTranslations('pages.userCourses');

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                        {
                            label: breadcrumbsTranslations('home'),
                            onClick: () => router.push('/'),
                        },
                        {
                            label: breadcrumbsTranslations('workspace'),
                            onClick: () => router.push('/workspace'),
                        },
                    {
                        label: breadcrumbsTranslations('courses'),
                        onClick: () => {
                            // Nothing should happen on clicking the current page
                        },
                    },
                ]}
            />
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <h1> {pageTranslations('yourCourses')} </h1>
                {canCreateCourse && <CreateCourseDialog />}
                {!canCreateCourse && !isStudent && (
                    <Button text={pageTranslations('becomeCourseCreator')} />
                )}
            </div>
            <UserCoursesList />
        </div>
    );
}
