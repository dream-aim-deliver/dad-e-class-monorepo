import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideMenuCMS } from '../../lib/components/sidemenu/sidemenu-cms';
import {
  MenuItem,
  SideMenuItem,
} from '../../lib/components/sidemenu/sidemenu-item';
import { SideMenuSection } from '../../lib/components/sidemenu/sidemenu-section';
import { IconCourse } from '../../lib/components/icons/icon-course';
import { IconDashboard } from '../../lib/components/icons/icon-dashboard';
import { IconCoachingOffer } from '../../lib/components/icons/icon-coaching-offer';
import { IconCoachingSession } from '../../lib/components/icons/icon-coaching-session';
import { IconCoach } from '../../lib/components/icons/icon-coach';
import { IconSales } from '../../lib/components/icons/icon-sales';
import { IconGroup } from '../../lib/components/icons/icon-group';
import { IconAccountInformation } from '../../lib/components/icons/icon-account-information';
import { IconImage } from '../../lib/components/icons/icon-image';
import { IconEdit } from '../../lib/components/icons/icon-edit';
import { IconFile } from '../../lib/components/icons/icon-file';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock Data - CMS Menu Items matching the screenshot
const createCMSMenuItems = (): MenuItem[][] => [
  // Main content management items
  [
    {
      icon: <IconCourse />,
      label: 'All Courses',
      onClick: () => console.log('All Courses clicked'),
      notificationCount: 18,
    },
    {
      icon: <IconDashboard />,
      label: 'Packages',
      onClick: () => console.log('Packages clicked'),
      notificationCount: 2,
    },
    {
      icon: <IconDashboard />,
      label: 'Categories',
      onClick: () => console.log('Categories clicked'),
      notificationCount: 3,
    },
    {
      icon: <IconDashboard />,
      label: 'Topics',
      onClick: () => console.log('Topics clicked'),
      notificationCount: 12,
    },
    {
      icon: <IconEdit />,
      label: 'Pre-Course Assessment form',
      onClick: () => console.log('Pre-Course Assessment form clicked'),
    },
    {
      icon: <IconFile />,
      label: 'Terms & Conditions form',
      onClick: () => console.log('Terms & Conditions form clicked'),
    },
  ],
  // Coaching section
  [
    {
      icon: <IconCoachingOffer />,
      label: 'Coaching offering',
      onClick: () => console.log('Coaching offering clicked'),
      notificationCount: 8,
    },
    {
      icon: <IconCoachingSession />,
      label: 'Coaching sessions',
      onClick: () => console.log('Coaching sessions clicked'),
    },
    {
      icon: <IconCoach />,
      label: 'Coach skills form',
      onClick: () => console.log('Coach skills form clicked'),
    },
  ],
  // Other management items
  [
    {
      icon: <IconSales />,
      label: 'Coupons',
      onClick: () => console.log('Coupons clicked'),
      notificationCount: 23,
    },
    {
      icon: <IconGroup />,
      label: 'Users',
      onClick: () => console.log('Users clicked'),
    },
    {
      icon: <IconSales />,
      label: 'Transactions',
      onClick: () => console.log('Transactions clicked'),
    },
    {
      icon: <IconEdit />,
      label: 'Send Notification',
      onClick: () => console.log('Send Notification clicked'),
    },
    {
      icon: <IconAccountInformation />,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
  ],
];

// Website content section items
const websiteContentItems: MenuItem[] = [
  {
    icon: <IconImage />,
    label: 'Homepage',
    onClick: () => console.log('Homepage clicked'),
  },
  {
    icon: <IconSales />,
    label: 'Offers',
    onClick: () => console.log('Offers clicked'),
  },
  {
    icon: <IconFile />,
    label: 'About Page',
    onClick: () => console.log('About Page clicked'),
  },
  {
    icon: <IconFile />,
    label: 'Footer',
    onClick: () => console.log('Footer clicked'),
  },
];

// Component
const SideMenuCMSInteractive = (props: React.ComponentProps<typeof SideMenuCMS>) => {
  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsed || false);
  const [activeItem, setActiveItem] = useState('');
  const [currentLocale, setCurrentLocale] = useState<TLocale>(props.locale || 'en');

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

  // Handle language change
  const handleLanguageChange = (newLocale: TLocale) => {
    setCurrentLocale(newLocale);
    console.log('Language changed to:', newLocale);
  };

  return (
    <SideMenuCMS
      {...props}
      isCollapsed={isCollapsed}
      onClickToggle={handleToggle}
      locale={currentLocale}
      onChangeLanguage={handleLanguageChange}
    >
      {createCMSMenuItems().map((group, i) => (
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

      {/* Website Content Section */}
      <div className="h-[1px] bg-divider my-2" />
      <SideMenuSection title="Website content" isCollapsed={isCollapsed}>
        {websiteContentItems.map((item) => (
          <SideMenuItem
            key={item.label}
            item={{ ...item, isActive: item.label === activeItem }}
            onClickItem={handleItemClick}
            isCollapsed={isCollapsed}
          />
        ))}
      </SideMenuSection>
    </SideMenuCMS>
  );
};

// Story Config
const meta: Meta<typeof SideMenuCMSInteractive> = {
  title: 'Components/SideMenuCMS',
  component: SideMenuCMSInteractive,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    isCollapsed: { control: 'boolean' },
  },
};

export default meta;

// Stories
const baseArgs = {
  platformLogoUrl:
    'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748270861/a_wy7cuh_kwevw6.png',
  locale: 'en' as TLocale,
  availableLocales: ['en', 'de'] as TLocale[],
};

// Default Story - Just Do Ad Platform
export const Default: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Just Do Ad',
  },
};

// Collapsed State
export const Collapsed: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Just Do Ad',
    isCollapsed: true,
  },
};

// Different Platform
export const DifferentPlatform: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Learning Hub',
    platformLogoUrl:
      'https://res.cloudinary.com/dsyephqpf/image/upload/v1747650265/background-eln_mhvipu.jpg',
  },
};

// German Locale
export const GermanLocale: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Just Do Ad',
  },
};

// Without Logo
export const WithoutLogo: StoryObj<typeof meta> = {
  args: {
    platformName: 'My Platform',
    locale: 'en' as TLocale,
    availableLocales: ['en', 'de'] as TLocale[],
  },
};

// With Language Selector
export const WithLanguageSelector: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Just Do Ad',
    availableLocales: ['en', 'de', 'es', 'fr'] as TLocale[],
  },
};

// Single Language (No Selector)
export const SingleLanguage: StoryObj<typeof meta> = {
  args: {
    ...baseArgs,
    platformName: 'Just Do Ad',
    availableLocales: ['en'] as TLocale[],
  },
};
