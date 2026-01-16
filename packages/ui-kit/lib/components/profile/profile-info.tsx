'use client';

import * as React from 'react';
import { DateInput } from '../date-input';
import { Button } from '../button';
import { CheckBox } from '../checkbox';
import { viewModels, fileMetadata } from '@maany_shr/e-class-models';
import { TextInput } from '../text-input';
import { LanguageSelector } from '../language-selector';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { TLanguageListSuccess } from 'packages/models/src/view-models';

type TPersonalProfileAPI = viewModels.TGetPersonalProfileSuccess['profile'];

interface ProfileInfoProps extends isLocalAware {
  initialData: TPersonalProfileAPI;
  onChange: (data: TPersonalProfileAPI) => void;
  availableLanguages: TLanguageListSuccess["languages"];
  onSave: (profile: TPersonalProfileAPI) => void;
  onDiscard: () => void;
  onFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  profilePictureFile?: fileMetadata.TFileMetadata | null;
  onUploadComplete: (fileMetadata: fileMetadata.TFileMetadata) => void;
  onFileDelete?: (id: string) => void;
  onFileDownload?: (id: string) => void;
  uploadProgress?: number;
  isSaving?: boolean;
}


/**
 * A reusable form component for managing and editing user profile information.
 *
 * @param initialData Optional initial data to prefill the form fields with user profile information.
 * @param onSave Callback function triggered when the form is submitted. Receives the updated `TPersonalProfile` object.
 * @param onFileUpload Callback function to handle file uploads. This is required for the component to function properly.
 * @param profilePictureFile The current profile picture file metadata to display in the uploader.
 * @param onUploadComplete Callback function triggered when a file upload is completed. Receives the uploaded file metadata.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * <ProfileInfo
 *   initialData={{
 *     name: "John",
 *     surname: "Doe",
 *     email: "john.doe@example.com",
 *     phoneNumber: "+123456789",
 *     dateOfBirth: "1990-01-01",
 *     profilePicture: "",
 *     languages: [],
 *     interfaceLanguage: { code: "ENG", name: "English" },
 *     receiveNewsletter: true,
 *   }}
 *   onSave={(profile) => console.log("Saved profile:", profile)}
 *   onFileUpload={async (fileRequest, abortSignal) => {
 *     // Your API upload logic here
 *     const formData = new FormData();
 *     formData.append('file', fileRequest.file);
 *     const response = await fetch('/api/upload', { method: 'POST', body: formData });
 *     return await response.json();
 *   }}
 *   profilePictureFile={currentProfilePictureFile}
 *   onUploadComplete={(fileMetadata) => console.log("Upload completed:", fileMetadata)}
 *   locale="en"
 * />
 */

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  initialData,
  onChange,
  onSave,
  onDiscard,
  onFileUpload,
  profilePictureFile,
  onUploadComplete,
  onFileDelete,
  onFileDownload,
  availableLanguages = [],
  locale,
  uploadProgress,
  isSaving = false,
}) => {
  const dictionary = getDictionary(locale);

  const handleChange = <
    K extends keyof TPersonalProfileAPI,
  >(
    field: K,
    value: TPersonalProfileAPI[K],
  ) => {
    const newData = { ...initialData, [field]: value };
    onChange(newData);
  };

  const handleCompanyDetailsChange = (
    isRepresenting: boolean,
    field?: 'companyName' | 'companyUid' | 'companyAddress',
    value?: string,
  ) => {
    const newData = { ...initialData };
    if (!isRepresenting) {
      newData.companyDetails = { isRepresentingCompany: false };
    } else {
      const currentDetails = initialData.companyDetails;
      if (currentDetails.isRepresentingCompany && field) {
        newData.companyDetails = {
          ...currentDetails,
          [field]: value,
        };
      } else {
        // Transitioning from false to true
        newData.companyDetails = {
          isRepresentingCompany: true,
          companyName: field === 'companyName' ? (value || '') : '',
          companyUid: field === 'companyUid' ? value : null,
          companyAddress: field === 'companyAddress' ? (value || '') : '',
        };
      }
    }
    onChange(newData);
  };

  const handleUploadedFiles = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ): Promise<fileMetadata.TFileMetadata> => {
    return await onFileUpload(fileRequest, abortSignal);
  };


  const handleSubmit = () => {
    onSave?.(initialData);
  };

  const handleDiscard = () => {
    onDiscard?.();
  };

  return (
    <div className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke w-full">
      <div className="flex flex-col flex-1 gap-4 shrink w-full basis-0">
        <h1 className="text-xl flex items-start font-bold leading-[120%] text-text-primary">
          {dictionary.components.profileInfo.title}
        </h1>
        <TextInput

          label={dictionary.components.profileInfo.name}
          inputField={{
            id: 'name',
            className: "w-full",
            value: initialData.name,
            setValue: (value) => handleChange('name', value),
            inputText: dictionary.components.profileInfo.namePlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.surname}
          inputField={{
            id: 'surname',
            className: "w-full",
            value: initialData.surname,
            setValue: (value) => handleChange('surname', value),
            inputText: dictionary.components.profileInfo.surnamePlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.email}
          inputField={{
            id: 'email',
            className: "w-full",
            value: initialData.email,
            setValue: (value) => handleChange('email', value),
            inputText: dictionary.components.profileInfo.emailPlaceholder,
            state: 'disabled'
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.username}
          inputField={{
            id: 'username',
            className: "w-full",
            value: initialData.username,
            setValue: (value) => handleChange('username', value),
            inputText: dictionary.components.profileInfo.usernamePlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.phoneNumber}
          inputField={{
            id: 'phone',
            className: "w-full",
            value: initialData.phone || '',
            setValue: (value) => handleChange('phone', value || null),
            inputText: dictionary.components.profileInfo.phoneNumberPlaceholder,
          }}
        />
        <DateInput
          label={dictionary.components.profileInfo.date}
          value={initialData.dateOfBirth || ''}
          onChange={(value) => handleChange('dateOfBirth', value || null)}
          locale={locale}
        />
        <CheckBox
          name="isRepresentingCompany"
          value="isRepresentingCompany"
          label={dictionary.components.profileInfo.checkboxtext1}
          labelClass="text-text-primary text-sm leading-[100%]"
          checked={initialData.companyDetails.isRepresentingCompany}
          withText
          onChange={() =>
            handleCompanyDetailsChange(
              !initialData.companyDetails.isRepresentingCompany,
            )
          }
        />
        {initialData.companyDetails.isRepresentingCompany && (
          <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
            <TextInput
              label={dictionary.components.profileInfo.companyName}
              inputField={{
                id: 'companyName',
                inputText: dictionary.components.profileInfo.companyNamePlaceholder,
                value: initialData.companyDetails.isRepresentingCompany ? initialData.companyDetails.companyName : '',
                setValue: (value) =>
                  handleCompanyDetailsChange(true, 'companyName', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.companyUID}
              inputField={{
                id: 'companyUID',
                value: initialData.companyDetails.isRepresentingCompany ? (initialData.companyDetails.companyUid || '') : '',
                inputText: dictionary.components.profileInfo.companyUIDPlaceholder,
                setValue: (value) =>
                  handleCompanyDetailsChange(true, 'companyUid', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.address}
              inputField={{
                id: 'companyAddress',
                value: initialData.companyDetails.isRepresentingCompany ? initialData.companyDetails.companyAddress : '',
                inputText: dictionary.components.profileInfo.addressPlaceholder,
                setValue: (value) =>
                  handleCompanyDetailsChange(true, 'companyAddress', value),
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 ">
          <p className="text-sm text-text-secondary flex justify-start">
            {' '}
            {dictionary.components.profileInfo.profilePicture}{' '}
          </p>
          <Uploader
            type="single"
            file={profilePictureFile ?? null}
            onFilesChange={handleUploadedFiles}
            onUploadComplete={onUploadComplete}
            variant='image'
            onDownload={(id) => onFileDownload?.(id)}
            onDelete={(id) => onFileDelete?.(id)}
            locale={locale}
            className="w-full"
            maxSize={20} // 20 MB
            uploadProgress={uploadProgress}
          />
        </div>

        <LanguageSelector
          text={dictionary.components.languageSelector}
          // Convert initialData languages to simple format for LanguageSelector
          selectedLanguages={initialData.languages?.map(lang => ({
            name: lang.name,
            code: lang.code
          })) || []}
          // Convert API languages to simple format for LanguageSelector dropdown
          availableLanguages={availableLanguages.map(lang => ({
            name: lang.name,
            code: lang.code
          }))}
          // Convert initialData interface language to simple format
          selectedInterfaceLanguage={initialData.interfaceLanguage ? {
            name: initialData.interfaceLanguage.name,
            code: initialData.interfaceLanguage.code
          } : null}
          onChange={(selectedSimpleLanguages) => {
            // User checked/unchecked languages - convert back to full format
            const fullLanguages = selectedSimpleLanguages.map((simpleLang) => {
              // Check if this language already exists in initialData (keeps existing data)
              const existingLang = initialData.languages?.find(l => l.code === simpleLang.code);
              if (existingLang) {
                return existingLang;
              }

              // New language selected - find full details from availableLanguages
              const availableLang = availableLanguages.find(l => l.code === simpleLang.code);
              if (availableLang) {
                return {
                  name: availableLang.name,
                  code: availableLang.code,
                  id: availableLang.id,
                  state: 'created' as const,
                  createdAt: new Date(),
                  updatedAt: new Date()
                } as any;
              }
            }).filter(Boolean);
            handleChange('languages', fullLanguages);
          }}
          onInterfaceLanguageChange={(selectedSimpleLang) => {
            if (selectedSimpleLang) {
              // Check if this language already exists in initialData
              const existingLang = initialData.languages?.find(l => l.code === selectedSimpleLang.code)
                || (initialData.interfaceLanguage?.code === selectedSimpleLang.code ? initialData.interfaceLanguage : null);
              if (existingLang) {
                handleChange('interfaceLanguage', existingLang);
                return;
              }

              // New language selected - find full details from availableLanguages
              const availableLang = availableLanguages.find(l => l.code === selectedSimpleLang.code);
              if (availableLang) {
                handleChange('interfaceLanguage', {
                  name: availableLang.name,
                  code: availableLang.code,
                  id: availableLang.id,
                  state: 'created' as const,
                  createdAt: new Date(),
                  updatedAt: new Date()
                } as any);
              }
            }
          }}
        />

        <CheckBox
          name="newsletter"
          value="newsletter"
          label={dictionary.components.profileInfo.checkboxtext2}
          labelClass="text-text-primary text-sm leading-[100%]"
          checked={initialData.receiveNewsletter}
          withText={true}
          onChange={() =>
            handleChange('receiveNewsletter', !initialData.receiveNewsletter)
          }
        />

        <div className="flex flex-wrap gap-4 items-center  w-full text-base font-bold leading-none max-md:max-w-full">
          <Button
            variant="secondary"
            size="medium"
            onClick={handleDiscard}
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            text={dictionary.components.profileInfo.buttontext1}
            type="button"
          />

          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            text={dictionary.components.profileInfo.buttontext2}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};
