import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideMenu } from '../../lib/components/sidemenu/sidemenu';
import {
  MenuItem,
  SideMenuItem,
} from '../../lib/components/sidemenu/sidemenu-item';
import { IconDashboard } from '../../lib/components/icons/icon-dashboard';
import { IconCourse } from '../../lib/components/icons/icon-course';
import { IconCoachingSession } from '../../lib/components/icons/icon-coaching-session';
import { IconCalendarAlt } from '../../lib/components/icons/icon-calendar-alt';
import { IconGroup } from '../../lib/components/icons/icon-group';
import { IconStar } from '../../lib/components/icons/icon-star';
import { IconAccountInformation } from '../../lib/components/icons/icon-account-information';
import { IconSales } from '../../lib/components/icons/icon-sales';
import { IconLogOut } from '../../lib/components/icons/icon-log-out';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock Data
const createMenuItems = (isStudent = false): MenuItem[][] => [
  [
    {
      icon: <IconDashboard />,
      label: 'Dashboard',
      onClick: () => console.log('Dashboard clicked'),
      notificationCount: isStudent ? 3 : 7,
    },
    {
      icon: <IconCourse />,
      label: isStudent ? 'Courses' : 'Your Courses',
      onClick: () => console.log('Courses clicked'),
    },
    {
      icon: <IconCoachingSession />,
      label: isStudent ? 'Coaching sessions' : 'Your Coaching sessions',
      onClick: () => console.log('Coaching sessions clicked'),
      notificationCount: isStudent ? 5 : 230,
    },
    {
      icon: <IconCalendarAlt />,
      label: 'Calendar',
      onClick: () => console.log('Calendar clicked'),
    },
    ...(!isStudent
      ? [
        {
          icon: <IconGroup />,
          label: 'Your Students',
          onClick: () => console.log('Students clicked'),
          notificationCount: 2,
        },
        {
          icon: <IconStar />,
          label: 'Your Reviews',
          onClick: () => console.log('Reviews clicked'),
        },
      ]
      : []),
  ],
  [
    {
      icon: <IconAccountInformation />,
      label: 'Your Profile',
      onClick: () => console.log('Profile clicked'),
      notificationCount: isStudent ? 100 : 23,
    },
    {
      icon: <IconSales />,
      label: 'Orders & Payments',
      onClick: () => console.log('Orders & Payments clicked'),
    },
  ],
  [
    {
      icon: <IconLogOut />,
      label: 'Logout',
      onClick: () => console.log('Logout clicked'),
    },
  ],
];

// Component
const SideMenuInteractive = (props: React.ComponentProps<typeof SideMenu>) => {
  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
  const [activeItem, setActiveItem] = useState('');

  // Handle Item Click
  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.label);
    alert(`Item "${item.label}" clicked`);
    item.onClick();
  };

  // handle toggle
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SideMenu {...props} isCollapsed={isCollapsed} onClickToggle={handleToggle}>
      {createMenuItems(props.userRole === 'student').map((group, i) => (
        <div key={i} className="flex flex-col w-full">
          <div className="h-[1px] bg-divider my-2" />
          {group.map((item) => (
            <SideMenuItem
              key={item.label}
              item={{ ...item, isActive: item.label === activeItem }}
              onClickItem={handleItemClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      ))}
    </SideMenu>
  );
};

// Story Config
const meta: Meta<typeof SideMenuInteractive> = {
  title: 'Components/SideMenu',
  component: SideMenuInteractive,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    userRole: {
      control: 'select',
      options: ['student', 'coach', 'courseCreator'],
    },
    locale: { control: 'select', options: ['en', 'de'] },
    isCollapsed: { control: 'boolean' },
  },
};

export default meta;

// Stories
const baseArgs = {
  profileImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  locale: 'en' as TLocale,
};

// Default Story
export const Default: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    userName: 'Jane Doe',
    userRole: 'student',
    rating: { score: 4.7, count: 120 },
  },
};

// Coach Story
export const Coach: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    userName: 'Jane Doe',
    userRole: 'coach',
    rating: { score: 4.9, count: 200 },
    locale: 'de',
  },
};

// Course Creator Story
export const CourseCreator: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    userName: 'John Smith',
    userRole: 'courseCreator',
    rating: { score: 4.3, count: 80 },
    locale: 'de',
    profileImageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v17334649482151206389_1_c38sda.jpg',
  },
};

// No Image Story
export const StudentNoImage: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    userName: 'Emily Clark',
    userRole: 'student',
    profileImageUrl: '',
  },
};

// Collapsed Story and German Locale
export const GermanLocale: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    userName: 'Max Müller',
    userRole: 'coach',
    rating: { score: 4.8, count: 150 },
    isCollapsed: true,
    locale: 'de',
  },
};
