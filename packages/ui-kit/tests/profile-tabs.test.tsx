import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileTabs } from '../lib/components/profile-tabs';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      profileTab: {
        personal: 'Personal',
        professional: 'Professional',
      },
      profileInfo: {
        title: 'Personal Information',
        name: 'Name',
        namePlaceholder: 'Enter your name',
        surname: 'Surname',
        surnamePlaceholder: 'Enter your surname',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        username: 'Username',
        usernamePlaceholder: 'Enter your username',
        phoneNumber: 'Phone Number',
        phoneNumberPlaceholder: 'Enter your phone number',
        date: 'Date of Birth',
        checkboxtext1: 'I am representing a company',
        checkboxtext2: 'Subscribe to newsletter',
        companyName: 'Company Name',
        companyNamePlaceholder: 'Enter company name',
        companyUID: 'Company UID',
        companyUIDPlaceholder: 'Enter company UID',
        address: 'Address',
        addressPlaceholder: 'Enter address',
        profilePicture: 'Profile Picture',
        buttontext1: 'Cancel',
        buttontext2: 'Save',
      },
      professionalInfo: {
        title: 'Professional Information',
        bio: 'Bio',
        bioPlaceholder: 'Enter your bio',
        linkedinUrl: 'LinkedIn URL',
        linkedinPlaceholder: 'Enter your LinkedIn URL',
        curriculumVitae: 'Curriculum Vitae',
        portfolioWebsite: 'Portfolio Website',
        portfolioWebsitePlaceholder: 'Enter your portfolio website',
        associatedCompanyName: 'Company Name',
        associatedCompanyNamePlaceholder: 'Enter company name',
        associatedCompanyRole: 'Company Role',
        associatedCompanyRolePlaceholder: 'Enter your role',
        associatedCompanyIndustry: 'Company Industry',
        associatedCompanyIndustryPlaceholder: 'Enter company industry',
        skills: 'Skills',
        addSkills: 'Add Skills',
        privateProfile: 'Private Profile',
        buttontext1: 'Cancel',
        buttontext2: 'Save',
      },
      dateInput: {
        placeholder: 'Select date',
      },
      languageSelector: {
        title: 'Languages spoken fluently (C1 and above)',
        choosetext: '',
        interface: 'Preferred language',
        chooseLanguage: 'Choose language',
        chooseColor: 'Choose color',
        chooseOptions: 'Choose options',
        languageNames: {
          en: 'English',
          de: 'German',
          it: 'Italian',
          fr: 'French',
          es: 'Spanish',
          pt: 'Portuguese',
        },
      },
      uploadingSection: {
        uploadImage: 'Upload Image',
        uploadVideo: 'Upload Video',
        uploadFile: 'Upload File',
        maxSizeText: 'Maximum file size',
        fileUploadFailedText: 'File upload failed',
        uploadingText: 'Uploading',
        processingText: 'Processing',
        deleteButtonText: 'Delete',
        changeButtonText: 'Change',
        downloadButtonText: 'Download',
      },
    },
    pages: {
      profile: {
        unsavedChangesDialog: {
          title: 'Unsaved Changes',
          description: 'You have unsaved changes. What would you like to do?',
          saveButton: 'Save',
          discardButton: 'Discard',
        },
      },
    },
  }),
  isLocalAware: {},
}));

// Mock Personal Profile Data (matching viewModels.TGetPersonalProfileSuccess['profile'])
const mockPersonalProfile = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  username: 'johndoe',
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
  { id: 1, code: 'ENG', name: 'English', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, code: 'DEU', name: 'German', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, code: 'FRA', name: 'French', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, code: 'SPA', name: 'Spanish', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
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
  const mockOnProfilePictureDelete = vi.fn();
  const mockOnCurriculumVitaeDelete = vi.fn();
  const mockOnProfilePictureUploadComplete = vi.fn();
  const mockOnCurriculumVitaeUploadComplete = vi.fn();

  beforeEach(() => {
    mockOnSavePersonal.mockClear();
    mockOnSaveProfessional.mockClear();
    mockFileUpload.mockClear();
    mockOnProfilePictureDelete.mockClear();
    mockOnCurriculumVitaeDelete.mockClear();
    mockOnProfilePictureUploadComplete.mockClear();
    mockOnCurriculumVitaeUploadComplete.mockClear();
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
        onProfilePictureDelete={mockOnProfilePictureDelete}
        onCurriculumVitaeDelete={mockOnCurriculumVitaeDelete}
        onProfilePictureUploadComplete={mockOnProfilePictureUploadComplete}
        onCurriculumVitaeUploadComplete={mockOnCurriculumVitaeUploadComplete}
        hasProfessionalProfile={true}
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
        onProfilePictureDelete={mockOnProfilePictureDelete}
        onCurriculumVitaeDelete={mockOnCurriculumVitaeDelete}
        onProfilePictureUploadComplete={mockOnProfilePictureUploadComplete}
        onCurriculumVitaeUploadComplete={mockOnCurriculumVitaeUploadComplete}
        hasProfessionalProfile={true}
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
        onProfilePictureDelete={mockOnProfilePictureDelete}
        onCurriculumVitaeDelete={mockOnCurriculumVitaeDelete}
        onProfilePictureUploadComplete={mockOnProfilePictureUploadComplete}
        onCurriculumVitaeUploadComplete={mockOnCurriculumVitaeUploadComplete}
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
        onProfilePictureDelete={mockOnProfilePictureDelete}
        onCurriculumVitaeDelete={mockOnCurriculumVitaeDelete}
        onProfilePictureUploadComplete={mockOnProfilePictureUploadComplete}
        onCurriculumVitaeUploadComplete={mockOnCurriculumVitaeUploadComplete}
        hasProfessionalProfile={true}
        locale="en"
        onSavePersonal={onSavePersonalMock}
        onSaveProfessional={onSaveProfessionalMock}
      />,
    );

    // Simulate saving personal profile
    const tabpanels = screen.getAllByRole('tabpanel');
    const visiblePanel = tabpanels.find(panel => !panel.classList.contains('hidden'));
    expect(visiblePanel).toBeTruthy(); // Ensure you found the visible panel

    const nameInput = within(visiblePanel!).getByDisplayValue('John');
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Jane' } });
    });

    const saveButton = within(visiblePanel!).getByText(/save/i);
    expect(saveButton).toBeVisible();
    expect(saveButton).not.toBeDisabled();

    act(() => {
      fireEvent.click(saveButton);
    });
    expect(onSavePersonalMock).toHaveBeenCalled();

    // Simulate saving professional profile
    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: /professional/i }));
    });

    const professionalPanel = screen
      .getAllByRole('tabpanel')
      .find(panel => !panel.classList.contains('hidden') && panel.textContent?.toLowerCase().includes('professional'));

    expect(professionalPanel).toBeTruthy();

    const bioTextarea = within(professionalPanel!).getByDisplayValue(/Experienced software engineer/i);
    act(() => {
      fireEvent.change(bioTextarea, { target: { value: 'Updated bio' } });
    });

    const professionalVisibleSaveButton = within(professionalPanel!).getByText(/save/i);
    expect(professionalVisibleSaveButton).toBeVisible();
    expect(professionalVisibleSaveButton).not.toBeDisabled();

    act(() => {
      fireEvent.click(professionalVisibleSaveButton);
    });
    expect(onSaveProfessionalMock).toHaveBeenCalled();
  });

});
