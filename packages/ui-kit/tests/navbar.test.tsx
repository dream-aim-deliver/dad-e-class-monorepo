import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../lib/components/navbar';
import { vi } from 'vitest';

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale) => ({
    components: {
      navbar: {
        workspace: locale === 'en' ? 'Workspace' : 'Arbeitsbereich',
        login: locale === 'en' ? 'Login' : 'Anmelden',
      },
    },
  }),
  isLocalAware: vi.fn(),
  locales: ['en', 'de'], // Added locales to match component usage
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, iconRight, hasIconRight, variant, size, className }) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
      data-has-icon-right={hasIconRight ? 'true' : 'false'}
      data-testid="mock-button"
    >
      {text}
      {iconRight && <span data-testid="icon-right">{iconRight}</span>}
    </button>
  ),
}));

vi.mock('../lib/components/dropdown', () => ({
  Dropdown: ({ options, onSelectionChange, defaultValue, type, text }) => (
    <select
      onChange={(e) => onSelectionChange(e.target.value)}
      defaultValue={defaultValue}
      data-type={type}
      data-text={text?.simpleText}
      data-testid="language-dropdown"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('../lib/components/icons/icon-close', () => ({
  IconClose: ({ classNames }) => (
    <div data-testid="icon-close" className={classNames}>
      Close Icon
    </div>
  ),
}));

vi.mock('../lib/components/icons/icon-hamburger-menu', () => ({
  IconHamburgerMenu: ({ size }) => (
    <div data-testid="icon-hamburger" data-size={size}>
      Hamburger Icon
    </div>
  ),
}));

vi.mock('../lib/components/icons/icon-chat', () => ({
  IconChat: ({ size, classNames }) => (
    <div data-testid="icon-chat" data-size={size} className={classNames}>
      Chat Icon
    </div>
  ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
  UserAvatar: ({ imageUrl, size, fullName, className }) => (
    <div
      data-testid="user-avatar"
      data-image-url={imageUrl}
      data-size={size}
      data-full-name={fullName}
      className={className}
    >
      Avatar
    </div>
  ),
}));

describe('Navbar Component', () => {
  test('renders correctly when not logged in with English locale', () => {
    const onChangeLanguageMock = vi.fn();
    render(
      <Navbar
        isLoggedIn={false}
        locale="en"
        onChangeLanguage={onChangeLanguageMock}
        availableLocales={['en', 'de']}
        logoSrc={'https://example.com/logo.png'}
        showNotifications
      >
        <a href="/home">Home</a>
        <a href="/about">About</a>
      </Navbar>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('language-dropdown')).toHaveValue('en');
  });

  it('renders user profile and workspace when logged in', () => {
    render(
      <Navbar isLoggedIn={true} locale="en" availableLocales={['en', 'de']} dropdownTriggerText="Workspace" showNotifications>
        <a href="/home">Home</a>
      </Navbar>
    );
    const userAvatars = screen.getAllByTestId('user-avatar');
    expect(userAvatars.length).toBe(2); // Desktop and mobile
    expect(userAvatars[0]).toHaveClass('p-0', 'ml-3'); // Desktop version
    const workspaceLinks = screen.getAllByText('Workspace');
    expect(workspaceLinks.length).toBe(2); // Desktop and mobile
    expect(workspaceLinks[0]).toBeInTheDocument();
  });

  it('displays notification count and icon when provided', () => {
    render(
      <Navbar
        isLoggedIn={true}
        locale="en"
        notificationCount={2}
        availableLocales={['en', 'de']}
        showNotifications
      >
        <a href="/home">Home</a>
      </Navbar>
    );
    const notifications = screen.getAllByText('2');
    expect(notifications.length).toBe(2); // Desktop and mobile
    expect(notifications[0]).toHaveClass('h-[18px]'); // Desktop version
    expect(screen.getAllByTestId('icon-chat').length).toBe(2); // Desktop and mobile
  });

  test('calls onChangeLanguage when language dropdown changes', () => {
    const onChangeLanguageMock = vi.fn();
    render(
      <Navbar
        isLoggedIn={false}
        locale="en"
        onChangeLanguage={onChangeLanguageMock}
        availableLocales={['en', 'de']}
        showNotifications
      >
        <a href="/home">Home</a>
      </Navbar>
    );

    const dropdown = screen.getByTestId('language-dropdown');
    fireEvent.change(dropdown, { target: { value: 'de' } });
    expect(onChangeLanguageMock).toHaveBeenCalledWith('de');
    expect(dropdown).toHaveValue('de');
  });

  test('renders custom user profile when provided', () => {
    const customProfile = <div data-testid="custom-profile">Custom Profile</div>;
    render(
      <Navbar
        isLoggedIn={true}
        locale="en"
        onChangeLanguage={vi.fn()}
        userProfile={customProfile}
        availableLocales={['en', 'de']}
        showNotifications
      >
        <a href="/home">Home</a>
      </Navbar>
    );

    const customProfiles = screen.getAllByTestId('custom-profile');
    expect(customProfiles.length).toBe(2); // Desktop and mobile
    expect(customProfiles[1].parentElement).toHaveClass('scale-75'); // Mobile version
    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument();
  });

  test('renders correctly in German when locale is "de"', () => {
    render(
      <Navbar
        isLoggedIn={true}
        locale="de"
        onChangeLanguage={vi.fn()}
        availableLocales={['en', 'de']}
        dropdownTriggerText="Arbeitsbereich"
        showNotifications
      >
        <a href="/home">Home</a>
      </Navbar>
    );

    const workspaces = screen.getAllByText('Arbeitsbereich');
    expect(workspaces.length).toBe(2); // Desktop and mobile
    
    // Check that the mobile version's parent container has text-sm class
    const mobileWorkspaceContainer = workspaces[1].parentElement;
    expect(mobileWorkspaceContainer).toHaveClass('text-sm'); // Mobile version
    expect(screen.getByTestId('language-dropdown')).toHaveValue('de');
  });

  test('shows hamburger menu and includes desktop menu structure', () => {
    render(
      <Navbar
        isLoggedIn={true}
        locale="en"
        onChangeLanguage={vi.fn()}
        availableLocales={['en', 'de']}
        showNotifications
      >
        <a href="/home">Home</a>
      </Navbar>
    );

    const desktopMenu = screen.getByText('Home').closest('div');
    expect(desktopMenu).toHaveClass('hidden', 'lg:flex');
    expect(
      screen.getByTestId('mock-button').querySelector('[data-testid="icon-right"]')
    ).toBeInTheDocument();
  });
});
