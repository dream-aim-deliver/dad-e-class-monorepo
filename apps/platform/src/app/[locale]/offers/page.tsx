"use client";
import { ProfileTabs } from '@maany_shr/e-class-ui-kit';
import type { TProfiles, TPersonalProfile, TProfessionalProfile } from '../../../../../../packages/models/src/profile';

// Mock data for a coach/course creator
const mockPersonalProfile: TPersonalProfile = {
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1995-01-01",
  profilePicture: "",
  languages: [
    { code: "ENG", name: "English" },
    { code: "DEU", name: "German" }
  ],
  interfaceLanguage: { code: "ENG", name: "English" },
  receiveNewsletter: true,
  isRepresentingCompany: true, // Could be true for course creators representing an institution
  representingCompanyName: "Learning Academy",
  representedCompanyUID: "CH123456789",
  representedCompanyAddress: "123 Education Street, Zurich"
};

const mockProfessionalProfile: TProfessionalProfile = {
  bio: "Experienced education professional with 10+ years in online learning.",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  curriculumVitae: "https://example.com/cv.pdf",
  portfolioWebsite: "",
  associatedCompanyName: "Learning Academy",
  associatedCompanyRole: "Senior Course Creator",
  associatedCompanyIndustry: "Education Technology",
  skills: ["Course Design", "Instructional Design", "E-Learning", "Content Creation"],
  isPrivateProfile: false
};

export default function ProfilePage() {
  // For a coach/course creator, we pass both profiles
  const profiles: TProfiles = [mockPersonalProfile, mockProfessionalProfile];

  const handleSave = async (updatedProfiles: TProfiles) => {
    try {
      // You might want to validate that both profiles are present
      if (updatedProfiles.length !== 2) {
        throw new Error('Both personal and professional profiles are required');
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfiles),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profiles updated successfully');
    } catch (error) {
      console.error('Failed to update profiles:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-stone-50 mb-6">My Profile</h1>
      <ProfileTabs 
        initialProfiles={profiles} 
        onSave={handleSave}
      />
    </div>
  );
}