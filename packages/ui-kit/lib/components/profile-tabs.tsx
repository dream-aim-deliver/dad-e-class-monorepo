import React, { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './tabs/tab';
import { ProfileInfo } from './profile/profile-info';
import { ProfessionalInfo } from './profile/professional-info';
import { profile, fileMetadata } from '@maany_shr/e-class-models';

import {
  TLocale,
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

export interface ProfileTabsProps extends isLocalAware {
  initialProfiles: profile.TProfiles;
  onSave?: (profiles: profile.TProfiles) => void;
  onFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  profilePictureFile?: fileMetadata.TFileMetadata | null;
  curriculumVitaeFile?: fileMetadata.TFileMetadata | null;
  onProfilePictureUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
  onCurriculumVitaeUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
}

/**
 * A reusable ProfileTabs component for managing personal and professional profiles.
 *
 * @param initialProfiles The initial array of profiles. The first profile is the personal profile, and the second (optional) is the professional profile.
 * @param onSave Callback function triggered when profiles are saved. Receives an updated array of profiles.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * <ProfileTabs
 *   initialProfiles={[
 *     { name: "John", surname: "Doe", email: "john.doe@example.com" }, // Personal profile
 *     { bio: "Experienced developer", linkedinUrl: "https://linkedin.com/in/johndoe" }, // Professional profile
 *   ]}
 *   onSave={(profiles) => console.log("Saved profiles:", profiles)}
 *   locale="en"
 * />
 */

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  initialProfiles,
  onSave,
  onFileUpload,
  profilePictureFile,
  curriculumVitaeFile,
  onProfilePictureUploadComplete,
  onCurriculumVitaeUploadComplete,
  locale,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const hasProfessionalProfile = initialProfiles.length > 1;
  const dictionary = getDictionary(locale);
  const personalProfile = initialProfiles[0] as profile.TPersonalProfile;
  const professionalProfile = hasProfessionalProfile
    ? (initialProfiles[1] as profile.TProfessionalProfile)
    : undefined;

  if (!hasProfessionalProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileInfo
          initialData={personalProfile}
          onSave={(profile) => onSave?.([profile])}
          onFileUpload={onFileUpload}
          profilePictureFile={profilePictureFile}
          onUploadComplete={onProfilePictureUploadComplete}
          locale={locale as TLocale}
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <Tabs.Root
        defaultTab="personal"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabList className="grid w-full grid-cols-2 mb-8">
          <TabTrigger value="personal">
            {dictionary.components.profileTab.personal}
          </TabTrigger>
          <TabTrigger value="professional">
            {dictionary.components.profileTab.professional}
          </TabTrigger>
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
            onFileUpload={onFileUpload}
            profilePictureFile={profilePictureFile}
            onUploadComplete={onProfilePictureUploadComplete}
            locale={locale as TLocale}
          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalProfile}
            onSave={(profile) => {
              onSave?.([personalProfile, profile]);
            }}
            onFileUpload={onFileUpload}
            curriculumVitaeFile={curriculumVitaeFile}
            onUploadComplete={onCurriculumVitaeUploadComplete}
            locale={locale as TLocale}
          />
        </TabContent>
      </Tabs.Root>
    </div>
  );
};
