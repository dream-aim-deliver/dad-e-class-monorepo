import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    GroupOverviewCard,
    GroupOverviewCardDetails,
} from '../lib/components/groups-card/groups-overview-card';

vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            groupCard: {
                students: 'students',
                course: 'Course',
                coaches: 'Coach(es)',
                you: 'You',
                manage: 'Manage',
            },
        },
    }),
}));

vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        title,
    }: {
        text: string;
        onClick?: () => void;
        title?: string;
    }) => (
        <button type="button" onClick={onClick} title={title}>
            {text}
        </button>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: () => <div data-testid="avatar" />,
}));

vi.mock('../lib/components/icons', () => ({
    IconGroup: () => null,
    IconCourse: () => null,
    IconAccountInformation: () => null,
}));

const baseDetails: GroupOverviewCardDetails = {
    groupId: 1,
    groupName: 'AP_Oktober_26',
    currentStudents: 8,
    totalStudents: 50,
    course: {
        image: '',
        title: 'Application Bootcamp',
        slug: 'bootcamp',
    },
    coaches: [
        {
            name: 'Zoran Stojanovic',
            isCurrentUser: false,
        },
    ],
};

describe('GroupOverviewCard manage visibility', () => {
    it('hides Manage when user is not a group coach and has no oversight flag', () => {
        render(
            <GroupOverviewCard
                locale="en"
                cardDetails={baseDetails}
                onClickManage={vi.fn()}
            />,
        );
        expect(screen.queryByText('Manage')).not.toBeInTheDocument();
    });

    it('shows Manage when current user is a group coach', () => {
        const onClickManage = vi.fn();
        render(
            <GroupOverviewCard
                locale="en"
                cardDetails={{
                    ...baseDetails,
                    coaches: [
                        { name: 'Conny', isCurrentUser: true },
                    ],
                }}
                onClickManage={onClickManage}
            />,
        );
        fireEvent.click(screen.getByText('Manage'));
        expect(onClickManage).toHaveBeenCalledTimes(1);
    });

    it('shows Manage for course managers without group membership', () => {
        const onClickManage = vi.fn();
        render(
            <GroupOverviewCard
                locale="en"
                cardDetails={baseDetails}
                canManageWithoutMembership
                onClickManage={onClickManage}
            />,
        );
        fireEvent.click(screen.getByText('Manage'));
        expect(onClickManage).toHaveBeenCalledTimes(1);
    });
});
