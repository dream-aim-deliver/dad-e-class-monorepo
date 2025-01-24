import type { Meta, StoryObj } from '@storybook/react';
import { ProfileTabs } from '@/components/profile-tabs';
import { profile } from '@dad-e-class/models';

const meta: Meta<typeof ProfileTabs> = {
  title: 'Components/ProfileTabs',
  component: ProfileTabs,
  tags: ['autodocs'],
  argTypes: {
    initialProfiles: { 
      description: 'Initial profile data to populate the form',
      control: 'object' 
    },
    onSave: { 
      description: 'Callback function when profiles are saved',
      action: 'saved' 
    }
  }
};

export default meta;

type Story = StoryObj<typeof ProfileTabs>;

const personalProfileFixture: profile.TPersonalProfile = {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '2025-02-01',
    profilePicture: 'abc.com',
    languages: [
      { code: 'ENG', name: 'English' },
      { code: 'DEU', name: 'German' },
    ],
    interfaceLanguage: { code: 'ENG', name: 'English' },
    receiveNewsletter: true,
    isRepresentingCompany: true, // Could be true for course creators representing an institution
    representingCompanyName: 'Learning Academy',
    representedCompanyUID: 'CH123456789',
    representedCompanyAddress: '123 Education Street, Zurich',
};

const professionalProfileFixture: profile.TProfessionalProfile = {
    bio: 'Experienced education professional with 10+ years in online learning.',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    curriculumVitae: '',
    portfolioWebsite: '',
    associatedCompanyName: 'Learning Academy',
    associatedCompanyRole: 'Senior Course Creator',
    associatedCompanyIndustry: 'Education Technology',
    skills: [
      'Course Design',
      'Instructional Design',
      'E-Learning',
      'Content Creation',
    ],
    isPrivateProfile: false,
};

export const SingleProfile: Story = {
  args: {
    initialProfiles: [personalProfileFixture],
    onSave: (profiles) => console.log('Saved profiles:', profiles)
  },
  name: 'Single Profile (Personal Only)'
};

export const BothProfiles: Story = {
  args: {
    initialProfiles: [
      personalProfileFixture, 
      professionalProfileFixture
    ],
    onSave: (profiles) => console.log('Saved profiles:', profiles)
  },
  name: 'Both Personal and Professional Profiles'
};
