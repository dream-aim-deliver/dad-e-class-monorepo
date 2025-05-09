import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModuleCompletionModal } from '../lib/components/module-completion-modal';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      moduleCompletionModal: {
        moduleCompletedText: 'Module Completed!',
        moduleText: 'Module',
        descriptionText: 'You have finished this module. Continue to the next one.',
        goToNextModuleText: 'Go to Next Module',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

// Mock icons and subcomponents
vi.mock('../lib/components/icon-button', () => ({
  IconButton: ({ icon, onClick, className, dataTestid }: any) => (
    <button
      data-testid={dataTestid || 'icon-button'}
      onClick={onClick}
      className={className}
    >
      {icon}
    </button>
  ),
}));
vi.mock('../lib/components/icons/icon-close', () => ({
  IconClose: () => <span data-testid="icon-close">Close</span>,
}));
vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className, disabled, iconRight }: any) => (
    <button
      data-testid={`button-${text}`}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {text}
      {iconRight}
    </button>
  ),
}));
vi.mock('../lib/components/icons/icon-module', () => ({
  IconModule: ({ classNames }: { classNames: string }) => (
    <span data-testid="icon-module" className={classNames}>ModuleIcon</span>
  ),
}));
vi.mock('../lib/components/icons/icon-success', () => ({
  IconSuccess: ({ classNames }: { classNames: string }) => (
    <span data-testid="icon-success" className={classNames}>Success</span>
  ),
}));
vi.mock('../lib/components/icons/icon-chevron-right', () => ({
  IconChevronRight: () => <span data-testid="icon-chevron-right">→</span>,
}));

describe('ModuleCompletionModal', () => {
  const defaultProps = {
    currentModule: 2,
    totalModules: 5,
    moduleTitle: 'Deep Learning Basics',
    onClose: vi.fn(),
    onClickNextModule: vi.fn(),
    locale: 'en' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main elements and module info', () => {
    render(<ModuleCompletionModal {...defaultProps} />);
    // Success icon
    expect(screen.getByTestId('icon-success')).toBeInTheDocument();
    // Module completed text
    expect(screen.getByText('Module Completed!')).toBeInTheDocument();
    // Module info
    expect(screen.getByText('Module 2/5')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning Basics')).toBeInTheDocument();
    // Description
    expect(screen.getByText('You have finished this module. Continue to the next one.')).toBeInTheDocument();
    // Module icon
    expect(screen.getByTestId('icon-module')).toBeInTheDocument();
    // Go to next module button
    expect(screen.getByTestId('button-Go to Next Module')).toBeInTheDocument();
    // Chevron icon
    expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
  });

  it('calls onClickNextModule when next module button is clicked', () => {
    render(<ModuleCompletionModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-Go to Next Module'));
    expect(defaultProps.onClickNextModule).toHaveBeenCalledTimes(1);
  });

  it('renders correct module number and title', () => {
    render(<ModuleCompletionModal {...defaultProps} />);
    expect(screen.getByText('Module 2/5')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning Basics')).toBeInTheDocument();
  });

  it('renders localized text based on dictionary', () => {
    render(<ModuleCompletionModal {...defaultProps} />);
    expect(screen.getByText('Module Completed!')).toBeInTheDocument();
    expect(screen.getByText('Go to Next Module')).toBeInTheDocument();
  });

  it('renders with different module values', () => {
    render(
      <ModuleCompletionModal
        {...defaultProps}
        currentModule={5}
        totalModules={10}
        moduleTitle="Advanced NLP"
      />
    );
    expect(screen.getByText('Module 5/10')).toBeInTheDocument();
    expect(screen.getByText('Advanced NLP')).toBeInTheDocument();
  });
});
