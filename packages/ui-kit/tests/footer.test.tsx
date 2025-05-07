import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from '../lib/components/footer'; // Adjust the import path as needed
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({}), // Mock dictionary content if needed
  isLocalAware: vi.fn(),
  locales: ['en', 'de'] as TLocale[],
}));

vi.mock('./dropdown', () => ({
  Dropdown: ({ options, onSelectionChange, defaultValue }: any) => (
    <button
      className="flex items-center justify-between p-2 pl-4 w-full bg-base-neutral-800 text-base-white rounded-medium border-[1px] border-base-neutral-700"
      onClick={() => {
        const nextOption = options.find((opt: any) => opt.value !== defaultValue);
        if (nextOption) onSelectionChange(nextOption.value);
      }}
      data-testid="language-dropdown"
    >
      <div className="text-base-white text-sm leading-[100%] whitespace-nowrap">
        {options.find((opt: any) => opt.value === defaultValue)?.label || 'EN'} {/* Updated default to 'EN' */}
      </div>
      <svg className="h-6 w-6 fill-base-neutral-50 cursor-pointer" viewBox="0 0 24 24">
        <path d="M16.293 9.29297L12 13.586L7.70697 9.29297L6.29297 10.707L12 16.414L17.707 10.707L16.293 9.29297Z" />
      </svg>
    </button>
  ),
}));

vi.mock('./button', () => ({
  Button: ({ text, onClick, className }: { text: string; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  ),
}));

describe('Footer', () => {
  const defaultProps = {
    locale: 'en' as TLocale,
    logoSrc: 'https://example.com/logo.png',
    onChangeLanguage: vi.fn(),
    children: (
      <>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </>
    ),
    footerChildren: <span>© 2025 MyCompany</span>,
    availableLocales: ['en', 'de'] as TLocale[],
  };

  it('renders logo, navigation links, company info, and language dropdown', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getAllByAltText('Logo')[0]).toHaveAttribute('src', defaultProps.logoSrc);
    expect(screen.getAllByText('About')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Contact')[0]).toBeInTheDocument();
    expect(screen.getAllByText('© 2025 MyCompany')[0]).toBeInTheDocument();
    const mobileDropdown = screen.getByRole('contentinfo').querySelector('.lg\\:hidden button');
    expect(within(mobileDropdown as HTMLElement).getByText('EN')).toBeInTheDocument(); // Changed 'ENG' to 'EN'
  });

  it('renders nothing if no props are provided except locale and availableLocales', () => {
    render(<Footer locale="en" availableLocales={['en', 'de']} />);
    expect(screen.queryByAltText('Logo')).not.toBeInTheDocument();
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    expect(screen.queryByText('© 2025 MyCompany')).not.toBeInTheDocument();
    const mobileDropdown = screen.getByRole('contentinfo').querySelector('.lg\\:hidden button');
    expect(within(mobileDropdown as HTMLElement).getByText('EN')).toBeInTheDocument(); // Changed 'ENG' to 'EN'
  });

  it('applies mobile layout classes on small screens', () => {
    global.innerWidth = 500;
    render(<Footer {...defaultProps} />);
    const mobileSection = screen.getByRole('contentinfo').querySelector('.lg\\:hidden');
    expect(mobileSection).toHaveClass('lg:hidden');
    const desktopSection = screen.getByRole('contentinfo').querySelector('.hidden.lg\\:flex');
    expect(desktopSection).toHaveClass('hidden');
  });

  it('applies desktop layout classes on large screens', () => {
    global.innerWidth = 1200;
    render(<Footer {...defaultProps} />);
    const desktopSection = screen.getByRole('contentinfo').querySelector('.hidden.lg\\:flex');
    expect(desktopSection).toHaveClass('lg:flex');
    const mobileSection = screen.getByRole('contentinfo').querySelector('.lg\\:hidden');
    expect(mobileSection).toHaveClass('lg:hidden');
  });

  it('renders navigation links with correct styling', () => {
    render(<Footer {...defaultProps} />);
    const mobileLinks = screen.getByRole('contentinfo').querySelector('.lg\\:hidden .flex.flex-wrap');
    expect(mobileLinks).toHaveClass('text-button-primary-fill');
    expect(mobileLinks).toHaveClass('text-sm');
  });

  it('renders company info with correct styling', () => {
    render(<Footer {...defaultProps} />);
    const mobileFooter = screen.getByRole('contentinfo').querySelector('.lg\\:hidden');
    const companyInfoContainer = within(mobileFooter as HTMLElement).getByText('© 2025 MyCompany').closest('div');
    expect(companyInfoContainer).toHaveClass('text-text-secondary');
    expect(companyInfoContainer).toHaveClass('text-sm');
  });

  it('links logo to homepage', () => {
    render(<Footer {...defaultProps} />);
    const logos = screen.getAllByAltText('Logo');
    const logoLink = logos[0].closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('handles window resize to switch layouts', async () => {
    const { rerender } = render(<Footer {...defaultProps} />);

    global.innerWidth = 1200;
    fireEvent(window, new Event('resize'));
    rerender(<Footer {...defaultProps} />);
    expect(screen.getByRole('contentinfo').querySelector('.hidden.lg\\:flex')).toHaveClass('lg:flex');

    global.innerWidth = 500;
    fireEvent(window, new Event('resize'));
    rerender(<Footer {...defaultProps} />);
    await vi.waitFor(() => {
      expect(screen.getByRole('contentinfo').querySelector('.lg\\:hidden')).toHaveClass('lg:hidden');
    }, { timeout: 200 });
  });
});