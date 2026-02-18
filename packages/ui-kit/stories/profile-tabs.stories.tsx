import { ProfileTabs } from '../lib/components/profile-tabs';
import { fileMetadata } from '@maany_shr/e-class-models';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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

// Mock file upload handlers
const handlePersonalFileUpload = async (
  fileRequest: fileMetadata.TFileUploadRequest,
  abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
  console.log('Uploading personal file:', fileRequest.name);

  // Simulate upload delay
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      // Create final metadata with simulated server response
      const finalMetadata: fileMetadata.TFileMetadataImage = {
        id: `uploaded-${Date.now()}`,
        name: fileRequest.name,
        size: fileRequest.file.size,
        status: 'available' as const,
        category: 'image' as const,
        url: `https://example.com/uploads/${fileRequest.name}`,
        thumbnailUrl: `https://picsum.photos/200/300?random=${Math.random()}`
      };

      console.log('Upload completed:', finalMetadata);
      resolve(finalMetadata);
    }, 2000);

    abortSignal?.addEventListener('abort', () => {
      console.log('Upload aborted');
      clearTimeout(timeout);
      reject(new DOMException('Upload aborted', 'AbortError'));
    });
  });
};

const handleProfessionalFileUpload = async (
  fileRequest: fileMetadata.TFileUploadRequest,
  abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
  console.log('Uploading professional file:', fileRequest.name);

  // Simulate upload delay
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      // Create final metadata with simulated server response
      const finalMetadata: fileMetadata.TFileMetadata = {
        id: `uploaded-${Date.now()}`,
        name: fileRequest.name,
        size: fileRequest.file.size,
        status: 'available' as const,
        category: 'document' as const,
        url: `https://example.com/uploads/${fileRequest.name}`
      };

      console.log('Upload completed:', finalMetadata);
      resolve(finalMetadata);
    }, 2000);

    abortSignal?.addEventListener('abort', () => {
      console.log('Upload aborted');
      clearTimeout(timeout);
      reject(new DOMException('Upload aborted', 'AbortError'));
    });
  });
};

// Wrapper component that handles state
const ProfileTabsWrapper = ({
  personalProfile,
  professionalProfile,
  locale,
  preloadedFiles = false
}) => {
  const [personal, setPersonal] = useState(personalProfile);
  const [professional, setProfessional] = useState(professionalProfile);

  // Initialize file states based on preloadedFiles flag and existing URLs
  const [profilePictureFile, setProfilePictureFile] = useState<fileMetadata.TFileMetadataImage | null>(() => {
    if (!preloadedFiles || !personal?.avatarImage) return null;
    return {
      id: 'profile-picture',
      name: 'profile-picture.jpg',
      size: 0,
      status: 'available' as const,
      category: 'image' as const,
      url: personal.avatarImage.downloadUrl,
      thumbnailUrl: personal.avatarImage.downloadUrl,
    };
  });

  const [curriculumVitaeFile, setCurriculumVitaeFile] = useState<fileMetadata.TFileMetadata | null>(() => {
    if (!preloadedFiles || !professional?.curriculumVitae) return null;
    return {
      id: 'curriculum-vitae',
      name: 'curriculum-vitae.pdf',
      size: 0,
      status: 'available' as const,
      category: 'document' as const,
      url: professional.curriculumVitae.downloadUrl,
    };
  });

  const handlePersonalSave = (updatedProfile: typeof personal) => {
    console.log('Personal profile saved:', updatedProfile);
    setPersonal(updatedProfile);
  };

  const handleProfessionalSave = (updatedProfile: typeof professional) => {
    console.log('Professional profile saved:', updatedProfile);
    setProfessional(updatedProfile);
  };

  const handleProfilePictureUploadComplete = (fileMetadata: fileMetadata.TFileMetadataImage) => {
    console.log('Profile picture upload completed:', fileMetadata);
    setProfilePictureFile(fileMetadata);
  };

  const handleCurriculumVitaeUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
    console.log('Curriculum vitae upload completed:', fileMetadata);
    setCurriculumVitaeFile(fileMetadata);
  };

  return (
    <ProfileTabs
      personalProfile={personal}
      professionalProfile={professional}
      availableSkills={mockAvailableSkills}
      availableLanguages={mockAvailableLanguages}
      locale={locale}
      onSavePersonal={handlePersonalSave}
      onSaveProfessional={handleProfessionalSave}
      onPersonalFileUpload={handlePersonalFileUpload}
      onProfessionalFileUpload={handleProfessionalFileUpload}
      profilePictureFile={profilePictureFile}
      onProfilePictureUploadComplete={handleProfilePictureUploadComplete}
      curriculumVitaeFile={curriculumVitaeFile}
      onCurriculumVitaeUploadComplete={handleCurriculumVitaeUploadComplete}
    />
  );
};

// Default Export for Storybook
const meta: Meta<typeof ProfileTabsWrapper> = {
  title: 'Components/ProfileTabs',
  component: ProfileTabsWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    preloadedFiles: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfileTabsWrapper>;

// Stories
export const WithBothProfiles: Story = {
  args: {
    personalProfile: mockPersonalProfile,
    professionalProfile: mockProfessionalProfile,
    locale: 'en',
    preloadedFiles: false,
  },
};

export const WithOnlyPersonalProfile: Story = {
  args: {
    personalProfile: mockPersonalProfile,
    professionalProfile: null,
    locale: 'en',
    preloadedFiles: false,
  },
};

export const WithFilesPreloaded: Story = {
  args: {
    personalProfile: {
      ...mockPersonalProfile,
      avatarImage: {
        id: '1',
        name: 'profile-picture.jpg',
        downloadUrl: 'https://picsum.photos/200/300?random=1',
        size: 1024,
      },
    },
    professionalProfile: {
      ...mockProfessionalProfile,
      curriculumVitae: {
        id: '2',
        name: 'curriculum-vitae.pdf',
        downloadUrl: 'https://example.com/sample-cv.pdf',
        size: 2048,
      },
    },
    locale: 'en',
    preloadedFiles: true,
  },
};