import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileTabs } from '../lib/components/profile-tabs';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock Personal Profile Data (matching viewModels.TGetPersonalProfileSuccess['profile'])
const mockPersonalProfile = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  languages: [
    { id: 1, languageCode: 'ENG', language: 'English', name: 'English', code: 'ENG', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, languageCode: 'DEU', language: 'German', name: 'German', code: 'DEU', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  ],
  interfaceLanguage: { id: 1, languageCode: 'ENG', language: 'English', name: 'English', code: 'ENG', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  receiveNewsletter: true,
  companyDetails: { isRepresentingCompany: false as const },
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  avatarImage: null as any,
};

// Mock Professional Profile Data (matching viewModels.TGetProfessionalProfileSuccess['profile'])
const mockProfessionalProfile = {
  id: 1,
  bio: 'Experienced software engineer with a passion for building scalable applications.',
  skills: [
    { id: 1, name: 'React', slug: 'react', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Node.js', slug: 'nodejs', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'TypeScript', slug: 'typescript', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: 'AWS', slug: 'aws', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  ],
  private: false,
  linkedinUrl: 'https://www.linkedin.com/in/johndoe',
  curriculumVitae: null as any,
  portfolioWebsite: 'https://johndoe.dev',
  companyName: 'Tech Corp',
  companyRole: 'Senior Software Engineer',
  companyIndustry: 'Technology',
};

// Mock available skills
const mockAvailableSkills = [
  { id: 1, name: 'React', slug: 'react' },
  { id: 2, name: 'Node.js', slug: 'nodejs' },
  { id: 3, name: 'TypeScript', slug: 'typescript' },
  { id: 4, name: 'AWS', slug: 'aws' },
  { id: 5, name: 'Python', slug: 'python' },
  { id: 6, name: 'Java', slug: 'java' },
];

// Mock available languages
const mockAvailableLanguages = [
  { languageCode: 'ENG', language: 'English' },
  { languageCode: 'DEU', language: 'German' },
  { languageCode: 'FRA', language: 'French' },
  { languageCode: 'SPA', language: 'Spanish' },
];

// Mock file upload handler
const mockFileUpload = vi.fn().mockResolvedValue({
  id: 'uploaded-file',
  name: 'test-file.jpg',
  size: 1024,
  status: 'available',
  category: 'image',
  url: 'https://example.com/test-file.jpg',
} as fileMetadata.TFileMetadata);

describe('ProfileTabs', () => {
  const mockOnSavePersonal = vi.fn();
  const mockOnSaveProfessional = vi.fn();

  beforeEach(() => {
    mockOnSavePersonal.mockClear();
    mockOnSaveProfessional.mockClear();
    mockFileUpload.mockClear();
  });

  it('renders personal profile tab by default', () => {
    render(
      <ProfileTabs
        personalProfile={mockPersonalProfile}
        professionalProfile={mockProfessionalProfile}
        availableSkills={mockAvailableSkills}
        availableLanguages={mockAvailableLanguages}
        onPersonalFileUpload={mockFileUpload}
        onProfessionalFileUpload={mockFileUpload}
        locale="en"
      />
    );

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
    render(
      <ProfileTabs
        personalProfile={mockPersonalProfile}
        professionalProfile={mockProfessionalProfile}
        availableSkills={mockAvailableSkills}
        availableLanguages={mockAvailableLanguages}
        onPersonalFileUpload={mockFileUpload}
        onProfessionalFileUpload={mockFileUpload}
        locale="en"
      />
    );

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
        personalProfile={mockPersonalProfile}
        professionalProfile={null}
        availableSkills={mockAvailableSkills}
        availableLanguages={mockAvailableLanguages}
        onPersonalFileUpload={mockFileUpload}
        onProfessionalFileUpload={mockFileUpload}
        onSavePersonal={mockOnSavePersonal}
        locale="en"
      />,
    );

    // Check that the personal profile form is rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });

  it('calls onSave with updated profiles', () => {
    const onSavePersonalMock = vi.fn();
    const onSaveProfessionalMock = vi.fn();

    render(
      <ProfileTabs
        personalProfile={mockPersonalProfile}
        professionalProfile={mockProfessionalProfile}
        availableSkills={mockAvailableSkills}
        availableLanguages={mockAvailableLanguages}
        onPersonalFileUpload={mockFileUpload}
        onProfessionalFileUpload={mockFileUpload}
        locale="en"
        onSavePersonal={onSavePersonalMock}
        onSaveProfessional={onSaveProfessionalMock}
      />,
    );

    // Simulate saving personal profile
    const tabpanels = screen.getAllByRole('tabpanel');
    const visiblePanel = tabpanels.find(panel => !panel.classList.contains('hidden'));
    expect(visiblePanel).toBeTruthy(); // Ensure you found the visible panel

    const saveButton = within(visiblePanel!).getByText(/save/i);
    expect(saveButton).toBeVisible();

    fireEvent.click(saveButton);
    expect(onSavePersonalMock).toHaveBeenCalled();

    // Simulate saving professional profile
    fireEvent.click(screen.getByRole('tab', { name: /professional/i }));

    const professionalPanel = screen
      .getAllByRole('tabpanel')
      .find(panel => !panel.classList.contains('hidden') && panel.textContent?.toLowerCase().includes('professional'));

    expect(professionalPanel).toBeTruthy();

    const professionalVisibleSaveButton = within(professionalPanel!).getByText(/save/i);
    expect(professionalVisibleSaveButton).toBeVisible();

    fireEvent.click(professionalVisibleSaveButton);
    expect(onSaveProfessionalMock).toHaveBeenCalled();
  });

});
