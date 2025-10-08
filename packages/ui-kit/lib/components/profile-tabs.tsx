'use client';

import React, { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './tabs/tab';
import { ProfileInfo } from './profile/profile-info';
import { ProfessionalInfo } from './profile/professional-info';
import { viewModels, fileMetadata } from '@maany_shr/e-class-models';

import {
  TLocale,
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';
import { TLanguageListSuccess } from 'packages/models/src/view-models';

type TPersonalProfile = viewModels.TGetPersonalProfileSuccess['profile'];
type TProfessionalProfile = viewModels.TGetProfessionalProfileSuccess['profile'];
type TSkill = { id: number; name: string; slug: string };

export interface ProfileTabsProps extends isLocalAware {
  personalProfile?: TPersonalProfile | null;
  professionalProfile?: TProfessionalProfile | null;
  availableSkills: TSkill[];
  availableLanguages: TLanguageListSuccess["languages"];
  onSavePersonal?: (profile: TPersonalProfile) => void;
  onSaveProfessional?: (
    profile: TProfessionalProfile
  ) => void;
  onPersonalFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  onProfessionalFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  profilePictureFile?: fileMetadata.TFileMetadataImage | null;
  onProfilePictureUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
  onProfilePictureDelete: (id: string) => void;
  profilePictureUploadProgress?: number;
  curriculumVitaeFile?: fileMetadata.TFileMetadata | null;
  onCurriculumVitaeUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
  onCurriculumVitaeDelete: (id: string) => void;
  curriculumVitaeUploadProgress?: number;
}

/**
 * A reusable ProfileTabs component for managing personal and professional profiles.
 *
 * @param personalProfile Optional personal profile data.
 * @param professionalProfile Optional professional profile data.
 * @param onSavePersonal Callback function triggered when the personal profile is saved.
 * @param onSaveProfessional Callback function triggered when the professional profile is saved.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * <ProfileTabs
 *   personalProfile={{ name: "John", surname: "Doe", email: "john.doe@example.com" }}
 *   professionalProfile={{ bio: "Experienced developer", linkedinUrl: "https://linkedin.com/in/johndoe" }}
 *   onSavePersonal={(profile) => console.log("Saved personal profile:", profile)}
 *   onSaveProfessional={(profile) => console.log("Saved professional profile:", profile)}
 *   locale="en"
 * />
 */

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  personalProfile,
  professionalProfile,
  availableSkills = [],
  availableLanguages = [],
  onSavePersonal,
  onSaveProfessional,
  onPersonalFileUpload,
  onProfessionalFileUpload,
  profilePictureFile,
  onProfilePictureUploadComplete,
  onProfilePictureDelete,
  profilePictureUploadProgress,
  curriculumVitaeFile,
  onCurriculumVitaeUploadComplete,
  onCurriculumVitaeDelete,
  curriculumVitaeUploadProgress,
  locale,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const hasProfessionalProfile = Boolean(professionalProfile);
  const dictionary = getDictionary(locale);

  if (!hasProfessionalProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileInfo
          initialData={personalProfile!}
          onSave={onSavePersonal}
          onFileUpload={onPersonalFileUpload}
          profilePictureFile={profilePictureFile}
          onUploadComplete={onProfilePictureUploadComplete}
          onFileDelete={onProfilePictureDelete}
          availableLanguages={availableLanguages}
          locale={locale as TLocale}
          uploadProgress={profilePictureUploadProgress}
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
          <TabTrigger value="personal" isLast={false}>
            {dictionary.components.profileTab.personal}
          </TabTrigger>
          <TabTrigger value="professional" isLast={true}>
            {dictionary.components.profileTab.professional}
          </TabTrigger>
        </TabList>

        <TabContent value="personal">
          <ProfileInfo
            initialData={personalProfile!}
            onSave={onSavePersonal}
            onFileUpload={onPersonalFileUpload}
            profilePictureFile={profilePictureFile}
            onUploadComplete={onProfilePictureUploadComplete}
            onFileDelete={onProfilePictureDelete}
            availableLanguages={availableLanguages}
            locale={locale as TLocale}

          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalProfile!}
            availableSkills={availableSkills}
            onSave={onSaveProfessional!}
            onFileUpload={onProfessionalFileUpload}
            curriculumVitaeFile={curriculumVitaeFile}
            onUploadComplete={onCurriculumVitaeUploadComplete}
            onFileDelete={onCurriculumVitaeDelete}
            locale={locale as TLocale}
            uploadProgress={curriculumVitaeUploadProgress}
          />
        </TabContent>
      </Tabs.Root>
    </div>
  );
};
