'use client';

import { Button, IconGroup } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../../trpc/cms-client';

interface StudentGroupButtonProps {
    courseSlug: string;
    currentRole: string;
}

/**
 * A button that navigates students to their group workspace.
 * Only renders if the student is part of a group for this course.
 * Uses getGroupIntroduction with requestForStudent to check group membership.
 */
export default function StudentGroupButton({
    courseSlug,
    currentRole,
}: StudentGroupButtonProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const t = useTranslations('pages.course');

    // Only render for students
    if (currentRole !== 'student') {
        return null;
    }

    // Check if student is part of a group by calling getGroupIntroduction
    const groupIntroQuery = trpc.getGroupIntroduction.useQuery(
        {
            courseSlug,
            additionalParams: {
                requestType: 'requestForStudent',
            },
        },
        {
            // Don't retry on error - if student is not in a group, we just don't show the button
            retry: false,
            // Don't refetch on window focus to avoid unnecessary calls
            refetchOnWindowFocus: false,
        }
    );

    // If loading, error, or no data, don't render anything
    if (groupIntroQuery.isLoading || groupIntroQuery.isError || !groupIntroQuery.data) {
        return null;
    }

    // Check if the response indicates success (student is in a group)
    const response = groupIntroQuery.data;
    if (!response.success) {
        return null;
    }

    // Student is in a group - show the button
    return (
        <Button
            variant="secondary"
            size="medium"
            hasIconLeft
            iconLeft={<IconGroup />}
            text={t('goToGroup')}
            onClick={() => router.push(`/${locale}/courses/${courseSlug}/group`)}
        />
    );
}
