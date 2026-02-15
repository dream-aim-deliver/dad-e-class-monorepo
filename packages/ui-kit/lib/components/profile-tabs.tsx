'use client';

import React, { useCallback, useMemo, useState } from 'react';
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
import { Dialog, DialogContent, DialogBody } from './dialog';
import { Button } from './button';
import { useFormState } from '../hooks/use-form-state';
import { useUnsavedChangesGuard } from '../hooks/use-unsaved-changes-guard';

type TPersonalProfile = viewModels.TGetPersonalProfileSuccess['profile'];
type TProfessionalProfile = viewModels.TGetProfessionalProfileSuccess['profile'];
type TSkill = { id: number; name: string; slug: string };

export interface ProfileTabsProps extends isLocalAware {
  personalProfile?: TPersonalProfile | null;
  professionalProfile?: TProfessionalProfile | null;
  availableSkills: TSkill[];
  availableLanguages: TLanguageListSuccess['languages'];
  onSavePersonal?: (profile: TPersonalProfile) => void;
  onSaveProfessional?: (profile: TProfessionalProfile) => void;
  onPersonalFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  onProfessionalFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  profilePictureFile?: fileMetadata.TFileMetadataImage | null;
  onProfilePictureUploadComplete: (file: fileMetadata.TFileMetadata) => void;
  onProfilePictureDelete: (id: string) => void;
  onProfilePictureDownload?: (id: string) => void;
  profilePictureUploadProgress?: number;
  curriculumVitaeFile?: fileMetadata.TFileMetadata | null;
  onCurriculumVitaeUploadComplete: (file: fileMetadata.TFileMetadata) => void;
  onCurriculumVitaeDelete: (id: string) => void;
  onCurriculumVitaeDownload?: (id: string) => void;
  curriculumVitaeUploadProgress?: number;
  isSaving?: boolean;
  hasProfessionalProfile?: boolean;
  onTabChange?: (tab: string) => boolean;
  skillsLanguageHint?: string;
  showApplyToCoachButton?: boolean;
  onApplyToCoachClick?: () => void;
  usernameValidator?: (username: string) => string | null;
}

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
  onProfilePictureDownload,
  profilePictureUploadProgress,
  curriculumVitaeFile,
  onCurriculumVitaeUploadComplete,
  onCurriculumVitaeDelete,
  onCurriculumVitaeDownload,
  curriculumVitaeUploadProgress,
  locale,
  isSaving = false,
  hasProfessionalProfile = false,
  onTabChange,
  skillsLanguageHint,
  showApplyToCoachButton = false,
  onApplyToCoachClick,
  usernameValidator,
}) => {
  const personalForm = useFormState(personalProfile, {
    enableReloadProtection: true
  });

  const professionalForm = useFormState(professionalProfile, {
    enableReloadProtection: true,
  });
  const [currentTab, setCurrentTab] = useState<'personal' | 'professional'>('personal');
  const dictionary = getDictionary(locale as TLocale);

  const unsavedGuard = useUnsavedChangesGuard({
    checkHasChanges: (tab) => {
      if (tab === 'personal') return personalForm.isDirty || personalProfile?.avatarImage?.id !== profilePictureFile?.id;
      if (tab === 'professional') return professionalForm.isDirty || professionalProfile?.curriculumVitae?.id !== curriculumVitaeFile?.id;
      return false;
    },
    onDiscardChanges: (tab) => {
      if (tab === 'personal') personalForm.reset();
      else if (tab === 'professional') professionalForm.reset();
    },
  });

  const handleTabChange = useCallback((newTab: string) => {
    // First call the external tab change handler if provided
    if (onTabChange && !onTabChange(newTab)) {
      return false;
    }

    // Then handle internal unsaved changes guard
    const canChange = unsavedGuard.handleTabChangeRequest(newTab, currentTab);
    if (!canChange) {
      return false;
    }
    setCurrentTab(newTab as 'personal' | 'professional');
    return true;
  }, [currentTab, unsavedGuard, onTabChange]);

  const handleConfirmDiscard = () => {
    unsavedGuard.confirmDiscard();
    if (unsavedGuard.pendingTab) {
      setCurrentTab(unsavedGuard.pendingTab as 'personal' | 'professional');
    }
  };

  const handlePersonalSave = async (profile: TPersonalProfile) => {
    try {
      await onSavePersonal?.(profile);
      personalForm.markAsSaved();
    } catch (error) {
      console.error('Personal profile save failed:', error);
    }
  };

  const handleProfessionalSave = async (profile: TProfessionalProfile) => {
    try {
      await onSaveProfessional?.(profile);
      // Only mark as saved if the save operation succeeded (no exception thrown)
      professionalForm.markAsSaved();
    } catch (error) {
      // Don't mark as saved if there was an error (validation or server error)
      console.error('Professional profile save failed:', error);
    }
  };

  const handleSaveFromDialog = () => {
    if (unsavedGuard.sourceTab === 'personal' && personalForm.value) {
      handlePersonalSave(personalForm.value);
    } else if (unsavedGuard.sourceTab === 'professional' && professionalForm.value) {
      handleProfessionalSave(professionalForm.value);
    }
    unsavedGuard.cancelChange();
    if (unsavedGuard.pendingTab) {
      setCurrentTab(unsavedGuard.pendingTab as 'personal' | 'professional');
    }
  };
  const transformSkills = useMemo(() => {
    return availableSkills.map((skill) => ({
     id: skill.id,
     name: skill.name,
     slug: skill.slug,
    }));
  }, [availableSkills]);


  // Track if files have changed
  const hasPersonalFileChanges = personalProfile?.avatarImage?.id !== profilePictureFile?.id;
  const hasProfessionalFileChanges = professionalProfile?.curriculumVitae?.id !== curriculumVitaeFile?.id;

  // Determine if save button should be disabled
  const isPersonalSaveDisabled = isSaving || (!personalForm.isDirty && !hasPersonalFileChanges);
  const isProfessionalSaveDisabled = isSaving || (!professionalForm.isDirty && !hasProfessionalFileChanges);

  if (!hasProfessionalProfile) {
    return (
      <div className="w-full  mx-auto">
        <ProfileInfo
          initialData={personalForm.value!}
          onChange={personalForm.setValue}
          onSave={handlePersonalSave}
          onDiscard={personalForm.reset}
          onFileUpload={onPersonalFileUpload}
          profilePictureFile={profilePictureFile}
          onUploadComplete={onProfilePictureUploadComplete}
          onFileDelete={onProfilePictureDelete}
          onFileDownload={onProfilePictureDownload}
          availableLanguages={availableLanguages}
          locale={locale as TLocale}
          uploadProgress={profilePictureUploadProgress}
          isSaving={isPersonalSaveDisabled}
          showApplyToCoachButton={showApplyToCoachButton}
          onApplyToCoachClick={onApplyToCoachClick}
          usernameValidator={usernameValidator}
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <Tabs.Root
        defaultTab="personal"
        onValueChange={handleTabChange}
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
            initialData={personalForm.value!}
            onChange={personalForm.setValue}
            onSave={handlePersonalSave}
            onDiscard={personalForm.reset}
            onFileUpload={onPersonalFileUpload}
            profilePictureFile={profilePictureFile}
            onUploadComplete={onProfilePictureUploadComplete}
            onFileDelete={onProfilePictureDelete}
            onFileDownload={onProfilePictureDownload}
            availableLanguages={availableLanguages}
            locale={locale as TLocale}
            uploadProgress={profilePictureUploadProgress}
            isSaving={isPersonalSaveDisabled}
            showApplyToCoachButton={showApplyToCoachButton}
            onApplyToCoachClick={onApplyToCoachClick}
            usernameValidator={usernameValidator}
          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalForm.value!}
            onChange={professionalForm.setValue}
            availableSkills={transformSkills}
            onSave={handleProfessionalSave}
            onDiscard={professionalForm.reset}
            onFileUpload={onProfessionalFileUpload}
            curriculumVitaeFile={curriculumVitaeFile}
            onUploadComplete={onCurriculumVitaeUploadComplete}
            onFileDelete={onCurriculumVitaeDelete}
            onFileDownload={onCurriculumVitaeDownload}
            locale={locale as TLocale}
            uploadProgress={curriculumVitaeUploadProgress}
            isSaving={isSaving}
            isSaveDisabled={isProfessionalSaveDisabled}
            skillsLanguageHint={skillsLanguageHint}
          />
        </TabContent>
      </Tabs.Root>
      <Dialog defaultOpen={false} open={unsavedGuard.showDialog} onOpenChange={(open) => !open && unsavedGuard.cancelChange()}>
        <DialogContent showCloseButton={false} closeOnOverlayClick={false} closeOnEscape={false}>
          <DialogBody>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {dictionary.pages.profile.unsavedChangesDialog.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {dictionary.pages.profile.unsavedChangesDialog.description}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={handleSaveFromDialog}
                  className="px-4 py-2"
                  disabled={isSaving}
                >
                  {dictionary.pages.profile.unsavedChangesDialog.saveButton}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleConfirmDiscard}
                  className="px-4 py-2"
                >
                  {dictionary.pages.profile.unsavedChangesDialog.discardButton}
                </Button>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
};
