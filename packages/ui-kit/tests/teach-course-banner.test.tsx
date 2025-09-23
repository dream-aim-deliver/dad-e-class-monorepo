import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TeachCourseBanner } from '../lib/components/teach-course-banner';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      teachCourseBanner: {
        title: locale === 'en' ? 'Turn Your Expertise into Earnings' : 'Verwandeln Sie Ihr Fachwissen in Einkommen',
        description: locale === 'en' ? 'Have the skills? Become a coach and inspire others! Share your knowledge, teach this course, and earn while making a difference. Join our community of experts.' : 'Haben Sie die Fähigkeiten? Werden Sie Coach und inspirieren Sie andere! Teilen Sie Ihr Wissen, unterrichten Sie diesen Kurs und verdienen Sie dabei einen Unterschied. Treten Sie unserer Experten-Community bei.',
        teachButtonText: locale === 'en' ? 'Teach this course' : 'Diesen Kurs unterrichten',
        placeHolderText: locale === 'en' ? 'Image not available' : 'Bild nicht verfügbar',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('./button', () => ({
  Button: ({ variant, size, text, className, onClick }: any) => (
    <button
      className={`justify-center font-bold transition-colors focus:outline-none
        ${variant === 'primary' ? 'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill' : ''}
        ${size === 'big' ? 'px-4 h-[3.5rem] text-xl' : ''}
        rounded-big ${className} cursor-pointer flex items-center gap-1`}
      onClick={onClick}
    >
      <span className="truncate">{text}</span>
    </button>
  ),
}));

describe('TeachCourseBanner', () => {
  const defaultProps = {
    locale: 'en' as 'en' | 'de',
    imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
    onClick: vi.fn(),
  };

  it('renders with correct English title', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const title = screen.getByText('Turn Your Expertise into Earnings');
    expect(title).toBeInTheDocument();
  });

  it('renders with correct German title', () => {
    render(<TeachCourseBanner {...defaultProps} locale="de" />);
    const title = screen.getByText('Verwandeln Sie Ihr Fachwissen in Einkommen');
    expect(title).toBeInTheDocument();
  });

  it('displays English description text', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const description = screen.getByText(
      'Have the skills? Become a coach and inspire others! Share your knowledge, teach this course, and earn while making a difference. Join our community of experts.'
    );
    expect(description).toBeInTheDocument();
  });

  it('displays German description text', () => {
    render(<TeachCourseBanner {...defaultProps} locale="de" />);
    const description = screen.getByText(
      'Haben Sie die Fähigkeiten? Werden Sie Coach und inspirieren Sie andere! Teilen Sie Ihr Wissen, unterrichten Sie diesen Kurs und verdienen Sie dabei einen Unterschied. Treten Sie unserer Experten-Community bei.'
    );
    expect(description).toBeInTheDocument();
  });

  it('renders button with English localized text', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Teach this course' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Teach this course');
  });

  it('renders button with German localized text', () => {
    render(<TeachCourseBanner {...defaultProps} locale="de" />);
    const button = screen.getByRole('button', { name: 'Diesen Kurs unterrichten' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Diesen Kurs unterrichten');
  });

  it('renders button with correct styles', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Teach this course' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-button-primary-fill');
    expect(button).toHaveClass('text-button-primary-text');
    expect(button).toHaveClass('h-[3.5rem]');
    expect(button).toHaveClass('self-start');
  });

  it('calls onClick handler when button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<TeachCourseBanner {...defaultProps} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Teach this course' });
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays image with correct attributes', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const image = screen.getByAltText('Banner image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3'
    );
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('shows placeholder when image fails to load', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const image = screen.getByAltText('Banner image');

    // Simulate image error
    fireEvent.error(image);

    const placeholder = screen.getByText('Image not available');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows German placeholder when image fails to load with German locale', () => {
    render(<TeachCourseBanner {...defaultProps} locale="de" />);
    const image = screen.getByAltText('Banner image');

    // Simulate image error
    fireEvent.error(image);

    const placeholder = screen.getByText('Bild nicht verfügbar');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows placeholder when imageUrl is empty', () => {
    render(<TeachCourseBanner {...defaultProps} imageUrl="" />);
    const placeholder = screen.getByText('Image not available');
    expect(placeholder).toBeInTheDocument();
  });

  it('applies correct grid layout classes', () => {
    const { container } = render(<TeachCourseBanner {...defaultProps} />);
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-3',
      'items-center',
      'w-full',
      'h-full',
      'gap-3',
      'md:gap-1'
    );
  });

  it('applies correct column span classes', () => {
    const { container } = render(<TeachCourseBanner {...defaultProps} />);

    // Image container should span 1 column
    const imageContainer = container.querySelector('.md\\:col-span-1');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('order-1', 'md:order-1', 'md:col-span-1');

    // Text container should span 2 columns
    const textContainer = container.querySelector('.md\\:col-span-2');
    expect(textContainer).toBeInTheDocument();
    expect(textContainer).toHaveClass('order-2', 'md:order-2', 'md:col-span-2');
  });

  it('applies correct responsive classes to image', () => {
    render(<TeachCourseBanner {...defaultProps} />);
    const image = screen.getByAltText('Banner image');
    expect(image).toHaveClass(
      'rounded-xl',
      'w-full',
      'h-auto',
      'lg:max-h-[320px]',
      'md:h-auto',
      'object-cover'
    );
  });

  it('applies correct text styling classes', () => {
    const { container } = render(<TeachCourseBanner {...defaultProps} />);

    // Title should be h3
    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Turn Your Expertise into Earnings');

    // Description should have correct classes
    const description = screen.getByText(/Have the skills\? Become a coach/);
    expect(description).toHaveClass('text-text-secondary', 'text-sm', 'md:text-md');
  });
});