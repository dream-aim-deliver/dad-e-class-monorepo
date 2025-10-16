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
  onProfilePictureUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
  onProfilePictureDelete: (id: string) => void;
  profilePictureUploadProgress?: number;
  curriculumVitaeFile?: fileMetadata.TFileMetadata | null;
  onCurriculumVitaeUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
  onCurriculumVitaeDelete: (id: string) => void;
  curriculumVitaeUploadProgress?: number;
  isSaving?: boolean;
  hasProfessionalProfile?: boolean;
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
  profilePictureUploadProgress,
  curriculumVitaeFile,
  onCurriculumVitaeUploadComplete,
  onCurriculumVitaeDelete,
  curriculumVitaeUploadProgress,
  locale,
  isSaving = false,
  hasProfessionalProfile = false,
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
      if (tab === 'personal') return personalForm.isDirty;
      if (tab === 'professional') return professionalForm.isDirty;
      return false;
    },
    onDiscardChanges: (tab) => {
      if (tab === 'personal') personalForm.reset();
      else if (tab === 'professional') professionalForm.reset();
    },
  });

  const handleTabChange = useCallback((newTab: string) => {
    const canChange = unsavedGuard.handleTabChangeRequest(newTab, currentTab);
    if (!canChange) {
      return false;
    }
    setCurrentTab(newTab as 'personal' | 'professional');
    return true;
  }, [currentTab, unsavedGuard]);

  const handleConfirmDiscard = () => {
    unsavedGuard.confirmDiscard();
    if (unsavedGuard.pendingTab) {
      setCurrentTab(unsavedGuard.pendingTab as 'personal' | 'professional');
    }
  };

  const handlePersonalSave = (profile: TPersonalProfile) => {
    onSavePersonal?.(profile);
    personalForm.markAsSaved();
  };


  const handleProfessionalSave = (profile: TProfessionalProfile) => {
    onSaveProfessional?.(profile);
    professionalForm.markAsSaved();
  };

  // ⚠️ REMOVED useCallback - performance analysis showed it's slower
  const handleSaveFromDialog = () => {
    if (unsavedGuard.sourceTab === 'personal' && personalForm.value) {
      handlePersonalSave(personalForm.value);
    } else if (unsavedGuard.sourceTab === 'professional' && professionalForm.value) {
      handleProfessionalSave(professionalForm.value);
    }
    // Close dialog after saving
    unsavedGuard.cancelChange();
    // Switch to pending tab if there was one
    if (unsavedGuard.pendingTab) {
      setCurrentTab(unsavedGuard.pendingTab as 'personal' | 'professional');
    }
  };

  if (!hasProfessionalProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileInfo
          initialData={personalForm.value!}
          onChange={personalForm.setValue}
          onSave={handlePersonalSave}
          onFileUpload={onPersonalFileUpload}
          profilePictureFile={profilePictureFile}
          onUploadComplete={onProfilePictureUploadComplete}
          onFileDelete={onProfilePictureDelete}
          availableLanguages={availableLanguages}
          locale={locale as TLocale}
          uploadProgress={profilePictureUploadProgress}
          isSaving={isSaving}
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
            onFileUpload={onPersonalFileUpload}
            profilePictureFile={profilePictureFile}
            onUploadComplete={onProfilePictureUploadComplete}
            onFileDelete={onProfilePictureDelete}
            availableLanguages={availableLanguages}
            locale={locale as TLocale}
            uploadProgress={profilePictureUploadProgress}
            isSaving={isSaving}
          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalForm.value!}
            onChange={professionalForm.setValue}
            availableSkills={availableSkills}
            onSave={handleProfessionalSave}
            onFileUpload={onProfessionalFileUpload}
            curriculumVitaeFile={curriculumVitaeFile}
            onUploadComplete={onCurriculumVitaeUploadComplete}
            onFileDelete={onCurriculumVitaeDelete}
            locale={locale as TLocale}
            uploadProgress={curriculumVitaeUploadProgress}
            isSaving={isSaving}
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
