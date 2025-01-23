'use client';
import React, { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './Tabs/Tab';
import { UserProfile } from './userProfile/UserProfile';
import { ProfessionalInfo } from './professionalCard/ProfessionalInfo';
import { profile } from '@/models';

interface ProfileTabsProps {
  initialProfiles: profile.TProfiles;
  onSave?: (profiles: profile.TProfiles) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  initialProfiles,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  // Check if we have a professional profile
  const hasProfessionalProfile = initialProfiles.length > 1;

  // Extract profiles
  const personalProfile = initialProfiles[0] as profile.TPersonalProfile;
  const professionalProfile = hasProfessionalProfile
    ? (initialProfiles[1] as profile.TProfessionalProfile)
    : undefined;

  if (!hasProfessionalProfile) {
    // If there's only a personal profile, render UserProfile without tabs
    return (
      <div className="w-full max-w-3xl mx-auto">
        <UserProfile
          initialData={personalProfile}
          onSave={(profile) => onSave?.([profile])}
        />
      </div>
    );
  }

  // If we have both profiles, render with tabs
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs.Root
        defaultTab="personal"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabList className="grid w-full grid-cols-2 mb-8">
          <TabTrigger value="personal">Personal</TabTrigger>
          <TabTrigger value="professional">Professional</TabTrigger>
        </TabList>

        <TabContent value="personal">
          <UserProfile
            initialData={personalProfile}
            onSave={(profile) => {
              if (professionalProfile) {
                onSave?.([profile, professionalProfile]);
              } else {
                onSave?.([profile]);
              }
            }}
          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalProfile}
            onSave={(profile) => {
              onSave?.([personalProfile, profile]);
            }}
          />
        </TabContent>
      </Tabs.Root>
    </div>
  );
};

export default ProfileTabs;
