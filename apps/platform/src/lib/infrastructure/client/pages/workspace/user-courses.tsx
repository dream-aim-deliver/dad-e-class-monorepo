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

interface UserCoursesProps {
    roles: string[];
}

function CreateCourseDialogContent() {
    const locale = useLocale() as TLocale;
    const { isOpen, setIsOpen } = useDialog();

    return (
        <div className="p-6">
            <CreateCourseModal
                locale={locale}
                isLoading={false}
                onCreateNew={() => console.log('Create New Course')}
                onDuplicate={(course) =>
                    console.log('Duplicate Course', course)
                }
                onQueryChange={(query) =>
                    console.log('Search Query Changed:', query)
                }
                onClose={() => setIsOpen(false)}
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
