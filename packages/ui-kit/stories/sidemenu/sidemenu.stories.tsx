import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SideMenu,
  MenuItem,
  SideMenuProps,
} from '../../lib/components/sidemenu/sidemenu';
import { IconDashboard } from '../../lib/components/icons/icon-dashboard';
import { IconCourse } from '../../lib/components/icons/icon-course';
import { IconCoachingSession } from '../../lib/components/icons/icon-coaching-session';
import { IconCalendarAlt } from '../../lib/components/icons/icon-calendar-alt';
import { IconGroup } from '../../lib/components/icons/icon-group';
import { IconStar } from '../../lib/components/icons/icon-star';
import { IconAccountInformation } from '../../lib/components/icons/icon-account-information';
import { IconSales } from '../../lib/components/icons/icon-sales';
import { IconLogOut } from '../../lib/components/icons/icon-log-out';

// Helper to set active menu item
function setActiveMenuItem(
  menuGroups: MenuItem[][],
  activeLabel: string,
): MenuItem[][] {
  return menuGroups.map((group) =>
    group.map((item) => ({
      ...item,
      isActive: item.label === activeLabel,
    })),
  );
}

// Wrapper component to manage state
const SideMenuInteractive: React.FC<SideMenuProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(
    props.isCollapsed ? true : false,
  );
  const [menuItems, setMenuItems] = useState<MenuItem[][]>(
    props.menuItems ?? [],
  );

  // Helper to set active menu item
  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
    if (props.onClickToggle) props.onClickToggle(!isCollapsed);
  };

  // Helper to set active menu item
  const handleItemClick = (clickedItem: MenuItem) => {
    setMenuItems((prev) => setActiveMenuItem(prev, clickedItem.label));
    if (props.onClickItem) props.onClickItem(clickedItem);
  };

  return (
    <SideMenu
      {...props}
      isCollapsed={isCollapsed}
      menuItems={menuItems}
      onClickToggle={handleToggle}
      onClickItem={handleItemClick}
    />
  );
};

const mockMenuItems: MenuItem[][] = [
  [
    {
      icon: <IconDashboard classNames="fill-text-primary" />,
      label: 'Dashboard',
      route: '/dashboard',
      isActive: false,
    },
    {
      icon: <IconCourse classNames="fill-text-primary" />,
      label: 'Your Courses',
      route: '/courses',
      isActive: false,
    },
    {
      icon: <IconCoachingSession classNames="fill-text-primary" />,
      label: 'Your Coaching sessions',
      route: '/sessions',
      isActive: false,
    },
    {
      icon: <IconCalendarAlt classNames="fill-text-primary" />,
      label: 'Calendar',
      route: '/calendar',
      isActive: false,
    },
    {
      icon: <IconGroup classNames="fill-text-primary" />,
      label: 'Your Students',
      route: '/students',
      isActive: false,
    },
    {
      icon: <IconStar classNames="fill-text-primary" />,
      label: 'Your Reviews',
      route: '/reviews',
      isActive: false,
    },
  ],
  [
    {
      icon: <IconAccountInformation classNames="fill-text-primary" />,
      label: 'Your Profile',
      route: '/profile',
      isActive: false,
    },
    {
      icon: <IconSales classNames="fill-text-primary" />,
      label: 'Orders & Payments',
      route: '/payments',
      isActive: false,
    },
  ],
  [
    {
      icon: <IconLogOut classNames="fill-text-primary" />,
      label: 'Logout',
      route: '/logout',
      isActive: false,
    },
  ],
];

const studentMockMenuItems: MenuItem[][] = [
  [
    {
      icon: <IconDashboard classNames="fill-text-primary" />,
      label: 'Dashboard',
      route: '/dashboard',
      isActive: false,
    },
    {
      icon: <IconCourse classNames="fill-text-primary" />,
      label: 'Courses',
      route: '/courses',
      isActive: false,
    },
    {
      icon: <IconCoachingSession classNames="fill-text-primary" />,
      label: 'Coaching sessions',
      route: '/sessions',
      isActive: false,
    },
    {
      icon: <IconCalendarAlt classNames="fill-text-primary" />,
      label: 'Calendar',
      route: '/calendar',
      isActive: false,
    },
  ],
  [
    {
      icon: <IconAccountInformation classNames="fill-text-primary" />,
      label: 'Your Profile',
      route: '/profile',
      isActive: false,
    },
    {
      icon: <IconSales classNames="fill-text-primary" />,
      label: 'Orders & Payments',
      route: '/payments',
      isActive: false,
    },
  ],
  [
    {
      icon: <IconLogOut classNames="fill-text-primary" />,
      label: 'Logout',
      route: '/logout',
      isActive: false,
    },
  ],
];

const meta: Meta<typeof SideMenuInteractive> = {
  title: 'Components/SideMenu',
  component: SideMenuInteractive,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    userRole: {
      control: { type: 'select' },
      options: ['student', 'coach', 'courseCreator'],
    },
    locale: {
      control: { type: 'select' },
      options: ['en', 'de'],
    },
    isCollapsed: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideMenuInteractive>;

// Default SideMenu (Expanded)
export const Default: Story = {
  args: {
    userName: 'Jane Doe',
    userRole: 'student',
    profileImageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    menuItems: studentMockMenuItems,
    rating: { score: 4.7, count: 120 },
    isCollapsed: false,
    locale: 'en',
    onClickItem: (item) => alert(`Clicked on ${item.label}`),
    onClickToggle: (collapsed) =>
      alert(`Menu ${!collapsed ? 'expanded' : 'collapsed'}`),
  },
};

// Coach SideMenu
export const Coach: Story = {
  args: {
    userName: 'Jane Doe',
    userRole: 'coach',
    profileImageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    menuItems: mockMenuItems,
    rating: { score: 4.9, count: 200 },
    isCollapsed: false,
    locale: 'de',
    onClickItem: (item) => alert(`Clicked on ${item.label}`),
    onClickToggle: (collapsed) =>
      alert(`Menu ${!collapsed ? 'expanded' : 'collapsed'}`),
  },
};

// CourseCreator SideMenu
export const CourseCreator: Story = {
  args: {
    userName: 'John Smith',
    userRole: 'courseCreator',
    profileImageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    menuItems: mockMenuItems,
    rating: { score: 4.3, count: 80 },
    isCollapsed: false,
    locale: 'en',
    onClickItem: (item) => alert(`Clicked on ${item.label}`),
    onClickToggle: (collapsed) =>
      alert(`Menu ${!collapsed ? 'expanded' : 'collapsed'}`),
  },
};

// SideMenu with no image
export const StudentNoImage: Story = {
  args: {
    userName: 'Emily Clark',
    userRole: 'student',
    profileImageUrl: '',
    menuItems: studentMockMenuItems,
    rating: undefined,
    isCollapsed: false,
    locale: 'en',
    onClickItem: (item) => alert(`Clicked on ${item.label}`),
    onClickToggle: (collapsed) =>
      alert(`Menu ${!collapsed ? 'expanded' : 'collapsed'}`),
  },
};

// Collapsed SideMenu and German locale
export const GermanLocale: Story = {
  args: {
    userName: 'Max Müller',
    userRole: 'coach',
    profileImageUrl:
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    menuItems: mockMenuItems,
    rating: { score: 4.8, count: 150 },
    isCollapsed: true,
    locale: 'de',
    onClickItem: (item) => alert(`Clicked on ${item.label}`),
    onClickToggle: (collapsed) =>
      alert(`Menu ${!collapsed ? 'expanded' : 'collapsed'}`),
  },
};
