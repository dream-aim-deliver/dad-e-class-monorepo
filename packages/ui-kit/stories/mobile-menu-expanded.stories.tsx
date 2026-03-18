import { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../lib/components/button';
import { Dropdown } from '../lib/components/dropdown';
import { MobileMenuExpanded } from '../lib/components/mobile-menu-expanded';

const logoContent = (
  <a href="/" className="block h-12">
    <img
      src="https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png"
      alt="Logo"
      className="h-full w-auto"
    />
  </a>
);

const menuLinks = (
  <>
    <a href="/home">
      <span>Home</span>
    </a>
    <a href="/offers">
      <span>Offers</span>
    </a>
    <a href="/coaching">
      <span>Coaching</span>
    </a>
    <a href="/about">
      <span>About</span>
    </a>
  </>
);

const languageSelector = (
  <Dropdown
    type="simple"
    options={[
      { label: 'ENG', value: 'en' },
      { label: 'DE', value: 'de' },
    ]}
    onSelectionChange={() => {}}
    text={{ simpleText: '' }}
    defaultValue="en"
  />
);

const meta: Meta<typeof MobileMenuExpanded> = {
  title: 'Components/MobileMenuExpanded',
  component: MobileMenuExpanded,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      story: {
        inline: false,
        height: '812px',
      },
    },
  },
  argTypes: {
    onClose: { action: 'closed' },
    logoContent: { control: false },
    children: { control: false },
    languageSelector: { control: false },
    loginButton: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof MobileMenuExpanded>;

export const LoggedOut: Story = {
  args: {
    onClose: () => {},
    logoContent,
    children: menuLinks,
    languageSelector,
    loginButton: (
      <Button
        text="Login"
        variant="primary"
        size="medium"
      />
    ),
  },
};

export const LoggedIn: Story = {
  args: {
    onClose: () => {},
    logoContent,
    children: menuLinks,
    languageSelector,
  },
};
