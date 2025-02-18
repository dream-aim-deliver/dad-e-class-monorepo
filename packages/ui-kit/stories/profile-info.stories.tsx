import React from 'react';
import { ProfileTabs } from '../lib/components/profile-tabs'; // Adjust the import path
import { profile } from '../../models/src/index';

// Mock Personal Profile Data
const mockPersonalProfile: profile.TPersonalProfile = {
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1990-01-01",
  profilePicture: "https://example.com/profile.jpg",
  languages: [{ code: "ENG", name: "English" }, { code: "DEU", name: "German" }],
  interfaceLanguage: { code: "ENG", name: "English" },
  receiveNewsletter: true,
  isRepresentingCompany: false,
};

// Mock Professional Profile Data
const mockProfessionalProfile: profile.TProfessionalProfile = {
  bio: "Experienced software engineer with a passion for building scalable applications.",
  linkedinUrl: "https://www.linkedin.com/in/johndoe",
  curriculumVitae: "https://example.com/cv.pdf",
  portfolioWebsite: "https://johndoe.dev",
  associatedCompanyName: "Tech Corp",
  associatedCompanyRole: "Senior Software Engineer",
  associatedCompanyIndustry: "Technology",
  skills: ["React", "Node.js", "TypeScript", "AWS"],
  isPrivateProfile: false,
};

// Combine both profiles into a single array
const mockProfiles: profile.TProfiles = [mockPersonalProfile, mockProfessionalProfile];

// Default Export for Storybook
export default {
  title: 'Components/ProfileTabs',
  component: ProfileTabs,
  parameters: {
    layout: 'centered', // Center the component in the Storybook canvas
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'], 
    },
  },
};

// Template for the Story
const Template = (args) => <ProfileTabs {...args} />;

// Stories
export const WithBothProfiles = Template.bind({});
WithBothProfiles.args = {
  initialProfiles: mockProfiles,
  locale: 'en', 
};

export const WithOnlyPersonalProfile = Template.bind({});
WithOnlyPersonalProfile.args = {
  initialProfiles: [mockPersonalProfile], 
  locale: 'en',
};