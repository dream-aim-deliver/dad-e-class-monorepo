import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileTabs } from '../lib/components/profile-tabs';
import { profile } from '@maany_shr/e-class-models';

// Mock Personal Profile Data
const mockPersonalProfile: profile.TPersonalProfile = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
  profilePicture: 'https://example.com/profile.jpg',
  languages: [
    { code: 'ENG', name: 'English' },
    { code: 'DEU', name: 'German' },
  ],
  interfaceLanguage: { code: 'ENG', name: 'English' },
  receiveNewsletter: true,
  isRepresentingCompany: false,
};

// Mock Professional Profile Data
const mockProfessionalProfile: profile.TProfessionalProfile = {
  bio: 'Experienced software engineer with a passion for building scalable applications.',
  linkedinUrl: 'https://www.linkedin.com/in/johndoe',
  curriculumVitae: 'https://example.com/cv.pdf',
  portfolioWebsite: 'https://johndoe.dev',
  associatedCompanyName: 'Tech Corp',
  associatedCompanyRole: 'Senior Software Engineer',
  associatedCompanyIndustry: 'Technology',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  isPrivateProfile: false,
};

// Combine both profiles into a single array
const mockProfiles: profile.TProfiles = [
  mockPersonalProfile,
  mockProfessionalProfile,
];

describe('ProfileTabs', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders personal profile tab by default', () => {
    render(<ProfileTabs initialProfiles={mockProfiles} locale="en" />);

    // Check selected tab label
    const selectedTab = screen.getByRole('tab', { selected: true });
    expect(selectedTab).toHaveTextContent(/personal/i);

    // Check content inside visible tabpanel
    const tabpanels = screen.getAllByRole('tabpanel');
    const visiblePanel = tabpanels.find(panel => !panel.classList.contains('hidden'));
    expect(visiblePanel).toBeTruthy();

    const withinVisible = within(visiblePanel!);
    expect(withinVisible.getByDisplayValue('John')).toBeInTheDocument();
    expect(withinVisible.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('switches to professional profile tab on click', () => {
    render(<ProfileTabs initialProfiles={mockProfiles} locale="en" />);

    // Click the "Professional" tab
    fireEvent.click(screen.getByRole('tab', { name: /professional/i }));

    // Check that the Professional tab is now selected
    const selectedTab = screen.getByRole('tab', { selected: true });
    expect(selectedTab).toHaveTextContent(/professional/i);

    // Check the visible tab panel
    const tabpanels = screen.getAllByRole('tabpanel');
    const visiblePanel = tabpanels.find(panel => !panel.classList.contains('hidden'));
    expect(visiblePanel).toBeDefined();

    // Assert content unique to professional profile
    expect(
      screen.getByText(/Experienced software engineer/i),
    ).toBeInTheDocument();

  });

  it('renders only the personal profile when no professional profile is provided', () => {
    render(
      <ProfileTabs
        initialProfiles={[mockPersonalProfile]}
        onSave={mockOnSave}
        locale="en"
      />,
    );

    // Check that the personal profile form is rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });

  it('calls onSave with updated profiles', () => {
    const onSaveMock = vi.fn();
    render(
      <ProfileTabs
        initialProfiles={mockProfiles}
        locale="en"
        onSave={onSaveMock}
      />,
    );

    // Simulate saving personal profile
    const tabpanels = screen.getAllByRole('tabpanel');
    const visiblePanel = tabpanels.find(panel => !panel.classList.contains('hidden'));
    expect(visiblePanel).toBeTruthy(); // Ensure you found the visible panel

    const saveButton = within(visiblePanel!).getByText(/save/i);
    expect(saveButton).toBeVisible();

    fireEvent.click(saveButton);
    expect(onSaveMock).toHaveBeenCalledWith([
      mockPersonalProfile,
      mockProfessionalProfile,
    ]);

    // Simulate saving professional profile
    fireEvent.click(screen.getByRole('tab', { name: /professional/i }));

    const professionalPanel = screen
      .getAllByRole('tabpanel')
      .find(panel => !panel.classList.contains('hidden') && panel.textContent?.toLowerCase().includes('professional'));

    expect(professionalPanel).toBeTruthy();

    const professionalVisibleSaveButton = within(professionalPanel!).getByText(/save/i);
    expect(professionalVisibleSaveButton).toBeVisible();

    fireEvent.click(professionalVisibleSaveButton);
    expect(onSaveMock).toHaveBeenCalledWith([
      mockPersonalProfile,
      mockProfessionalProfile,
    ]);
  });

});
