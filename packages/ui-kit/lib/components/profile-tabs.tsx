'use client';
import React, { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './tabs/tab';
import { ProfileInfo } from './profile/profile-info';
import { ProfessionalInfo } from './profile/professional-info';
import {profile} from '@maany_shr/e-class-models';
/**
 * A component that manages profile information using tabs for personal and professional profiles.
 *
 * @param initialProfiles The initial profile data, containing personal and optionally professional profiles.
 * @param onSave Callback function triggered when profile information is saved.
 * @returns A profile management interface with tabs for switching between personal and professional profiles.
 */
interface ProfileTabsProps {
  initialProfiles: profile.TProfiles;
  onSave?: (profiles: profile.TProfiles) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  initialProfiles,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const hasProfessionalProfile = initialProfiles.length > 1;
  const personalProfile = initialProfiles[0] as profile.TPersonalProfile;
  const professionalProfile = hasProfessionalProfile
    ? (initialProfiles[1] as profile.TProfessionalProfile)
    : undefined;

  if (!hasProfessionalProfile) {
    // If there's only a personal profile, render ProfileInfo without tabs
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileInfo
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
          <ProfileInfo
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
