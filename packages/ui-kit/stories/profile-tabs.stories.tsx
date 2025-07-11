import { ProfileTabs } from '../lib/components/profile-tabs';
import { profile, fileMetadata } from '@maany_shr/e-class-models';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

// Mock Personal Profile Data
const mockPersonalProfile: profile.TPersonalProfile = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
  profilePicture: '', // Start with empty string to show uploader
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
  curriculumVitae: '', // Start with empty string to show uploader
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

// Mock file upload handler
const handleFileUpload = async (
  fileRequest: fileMetadata.TFileUploadRequest,
  abortSignal?: AbortSignal
): Promise<fileMetadata.TFileMetadata> => {
  console.log('Uploading file:', fileRequest.name);

  // Simulate upload delay
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      // Create final metadata with simulated server response
      const finalMetadata: fileMetadata.TFileMetadata = {
        id: `uploaded-${Date.now()}`,
        name: fileRequest.name,
        mimeType: fileRequest.file.type || 'application/octet-stream',
        size: fileRequest.file.size,
        checksum: `checksum-${Math.random().toString(36).substr(2, 9)}`,
        status: 'available' as const,
        category: fileRequest.file.type?.startsWith('image/') ? 'image' as const : 'document' as const,
        url: `https://example.com/uploads/${fileRequest.name}`,
        ...(fileRequest.file.type?.startsWith('image/') && {
          thumbnailUrl: `https://picsum.photos/200/300?random=${Math.random()}`
        })
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
const ProfileTabsWrapper = ({ initialProfiles, locale, preloadedFiles = false }) => {
  const [profiles, setProfiles] = useState(initialProfiles);

  // Initialize file states based on preloadedFiles flag and existing URLs
  const [profilePictureFile, setProfilePictureFile] = useState<fileMetadata.TFileMetadata | null>(() => {
    if (!preloadedFiles) return null;
    const profilePicture = profiles[0]?.profilePicture;
    return profilePicture ? {
      id: 'profile-picture',
      name: 'profile-picture.jpg',
      mimeType: 'image/jpeg',
      size: 0,
      checksum: '',
      status: 'available' as const,
      category: 'image' as const,
      url: profilePicture,
      thumbnailUrl: profilePicture,
    } : null;
  });

  const [curriculumVitaeFile, setCurriculumVitaeFile] = useState<fileMetadata.TFileMetadata | null>(() => {
    if (!preloadedFiles) return null;
    const curriculumVitae = profiles[1]?.curriculumVitae;
    return curriculumVitae ? {
      id: 'curriculum-vitae',
      name: 'curriculum-vitae.pdf',
      mimeType: 'application/pdf',
      size: 0,
      checksum: '',
      status: 'available' as const,
      category: 'document' as const,
      url: curriculumVitae,
    } : null;
  });

  const handleProfileSave = (updatedProfiles: profile.TProfiles) => {
    console.log('Profiles saved:', updatedProfiles);
    setProfiles(updatedProfiles);
  };

  const handleProfilePictureUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
    console.log('Profile picture upload completed:', fileMetadata);
    setProfilePictureFile(fileMetadata);
  };

  const handleCurriculumVitaeUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
    console.log('Curriculum vitae upload completed:', fileMetadata);
    setCurriculumVitaeFile(fileMetadata);
  };

  return (
    <ProfileTabs
      initialProfiles={profiles}
      locale={locale}
      onSave={handleProfileSave}
      onFileUpload={handleFileUpload}
      profilePictureFile={profilePictureFile}
      curriculumVitaeFile={curriculumVitaeFile}
      onProfilePictureUploadComplete={handleProfilePictureUploadComplete}
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
    initialProfiles: mockProfiles,
    locale: 'en',
    preloadedFiles: false,
  },
};

export const WithOnlyPersonalProfile: Story = {
  args: {
    initialProfiles: [mockPersonalProfile],
    locale: 'en',
    preloadedFiles: false,
  },
};

export const WithFilesPreloaded: Story = {
  args: {
    initialProfiles: [
      {
        ...mockPersonalProfile,
        profilePicture: 'https://picsum.photos/200/300?random=1',
      },
      {
        ...mockProfessionalProfile,
        curriculumVitae: 'https://example.com/sample-cv.pdf',
      },
    ],
    locale: 'en',
    preloadedFiles: true,
  },
};