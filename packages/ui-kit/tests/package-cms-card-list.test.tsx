import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PackageCmsCardList } from '../lib/components/packages/package-cms-card-list';
import * as translations from '@maany_shr/e-class-translations';

describe('PackageCmsCardList', () => {
  const onClickCheckbox = vi.fn();
  const onCreatePackage = vi.fn();

  const mockDictionary = {
    allPackagesText: 'All Packages',
    showArchivedText: 'Show Archived',
    createPackageButton: 'Create Package',
    emptyState: 'No packages found.',
  };

  beforeEach(() => {
    vi.spyOn(translations, 'getDictionary').mockImplementation(() => ({
      components: { packages: mockDictionary },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  // Mock child components accepting a "status" prop
  const PublishedCard = ({ status }: { status: string }) => (
    <div data-testid="published-card">{`Published Card - status: ${status}`}</div>
  );

  const ArchivedCard = ({ status }: { status: string }) => (
    <div data-testid="archived-card">{`Archived Card - status: ${status}`}</div>
  );

  it('renders the title with package count', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={2}
        showArchived={false}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      >
        <PublishedCard status="published" />
        <ArchivedCard status="archived" />
      </PackageCmsCardList>
    );

    expect(screen.getByText(/All Packages \(2\)/i)).toBeInTheDocument();
  });

  it('shows only published cards when showArchived is false', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={2}
        showArchived={false}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      >
        <PublishedCard status="published" />
        <ArchivedCard status="archived" />
      </PackageCmsCardList>
    );

    expect(screen.getByTestId('published-card')).toBeInTheDocument();
    expect(screen.queryByTestId('archived-card')).not.toBeInTheDocument();
  });

  it('shows published and archived cards when showArchived is true', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={2}
        showArchived={true}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      >
        <PublishedCard status="published" />
        <ArchivedCard status="archived" />
      </PackageCmsCardList>
    );

    expect(screen.getByTestId('published-card')).toBeInTheDocument();
    expect(screen.getByTestId('archived-card')).toBeInTheDocument();
  });

  it('calls onClickCheckbox when the checkbox is toggled', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={1}
        showArchived={false}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      >
        <PublishedCard status="published" />
      </PackageCmsCardList>
    );

    const checkbox = screen.getByRole('checkbox', { name: mockDictionary.showArchivedText });
    fireEvent.click(checkbox);

    expect(onClickCheckbox).toHaveBeenCalledTimes(1);
  });

  it('calls onCreatePackage when Create Package button is clicked', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={0}
        showArchived={false}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      />
    );

    const createButton = screen.getByRole('button', { name: mockDictionary.createPackageButton });
    fireEvent.click(createButton);

    expect(onCreatePackage).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no cards match filter', () => {
    render(
      <PackageCmsCardList
        locale="en"
        packageCount={0}
        showArchived={false}
        onClickCheckbox={onClickCheckbox}
        onCreatePackage={onCreatePackage}
      >
        <ArchivedCard status="archived" />
      </PackageCmsCardList>
    );

    expect(screen.getByText(mockDictionary.emptyState)).toBeInTheDocument();
  });
});
