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
  availableLanguages: TLanguageListSuccess["languages"];
  onSave?: (profile: TPersonalProfileAPI) => void;
  onFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  profilePictureFile?: fileMetadata.TFileMetadata | null;
  onUploadComplete?: (fileMetadata: fileMetadata.TFileMetadata) => void;
  onFileDelete?: (id: string) => void;
  uploadProgress?: number;
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
  onSave,
  onFileUpload,
  profilePictureFile,
  onUploadComplete,
  onFileDelete,
  availableLanguages = [],
  locale,
  uploadProgress,
}) => {
  const [formData, setFormData] = React.useState<TPersonalProfileAPI>(initialData);
  const [password, setPassword] = React.useState('');

  const dictionary = getDictionary(locale);



  const handleChange = <
    K extends keyof TPersonalProfileAPI,
  >(
    field: K,
    value: TPersonalProfileAPI[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyDetailsChange = (
    isRepresenting: boolean,
    field?: 'companyName' | 'companyUid' | 'companyAddress',
    value?: string,
  ) => {
    setFormData((prev) => {
      if (!isRepresenting) {
        return {
          ...prev,
          companyDetails: { isRepresentingCompany: false },
        };
      }

      const currentDetails = prev.companyDetails;
      if (currentDetails.isRepresentingCompany && field) {
        return {
          ...prev,
          companyDetails: {
            ...currentDetails,
            [field]: value,
          },
        };
      }

      // Transitioning from false to true
      return {
        ...prev,
        companyDetails: {
          isRepresentingCompany: true,
          companyName: field === 'companyName' ? (value || '') : '',
          companyUid: field === 'companyUid' ? value : null,
          companyAddress: field === 'companyAddress' ? (value || '') : '',
        },
      };
    });
  };

  const handleUploadedFiles = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ): Promise<fileMetadata.TFileMetadata> => {
    return await onFileUpload(fileRequest, abortSignal);
  };

  const handleUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
    // Update form data with the uploaded file metadata
    if (fileMetadata.category === 'image') {
      // Use the file metadata directly without transformation
      handleChange('avatarImage', fileMetadata as any);
    }

    // Notify parent component that upload is complete
    onUploadComplete?.(fileMetadata);
  };

  const handleFileDelete = (id: string) => {
    handleChange('avatarImage', null);
    // Notify parent component about deletion
    onFileDelete?.(id);
  };


  const handleSubmit = () => {
    onSave?.(formData);
  };

  return (
    <div className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke w-full min-w-[240px]">
      <div className="flex flex-col flex-1 gap-4 shrink w-full basis-0">
        <h1 className="text-xl flex items-start font-bold leading-[120%] text-text-primary">
          {dictionary.components.profileInfo.title}
        </h1>
        <TextInput

          label={dictionary.components.profileInfo.name}
          inputField={{
            id: 'name',
            className: "w-full",
            value: formData.name,
            setValue: (value) => handleChange('name', value),
            inputText: dictionary.components.profileInfo.namePlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.surname}
          inputField={{
            id: 'surname',
            className: "w-full",
            value: formData.surname,
            setValue: (value) => handleChange('surname', value),
            inputText: dictionary.components.profileInfo.surnamePlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.email}
          inputField={{
            id: 'email',
            className: "w-full",
            value: formData.email,
            setValue: (value) => handleChange('email', value),
            inputText: dictionary.components.profileInfo.emailPlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.phoneNumber}
          inputField={{
            id: 'phone',
            className: "w-full",
            value: formData.phone || '',
            setValue: (value) => handleChange('phone', value || null),
            inputText: dictionary.components.profileInfo.phoneNumberPlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.password}
          inputField={{
            id: 'password',
            className: "w-full",
            value: password,
            setValue: setPassword,
            inputText: dictionary.components.profileInfo.password,
            type: 'password',
            hasRightContent: true,
            rightContent: (
              <Button
                variant="text"
                size="small"
                className="p-0"
                text={dictionary.components.profileInfo.changePassword}
              />
            ),
          }}
        />
        <DateInput
          label={dictionary.components.profileInfo.date}
          value={formData.dateOfBirth || ''}
          onChange={(value) => handleChange('dateOfBirth', value || null)}
          locale={locale}
        />
        <CheckBox
          name="isRepresentingCompany"
          value="isRepresentingCompany"
          label={dictionary.components.profileInfo.checkboxtext1}
          labelClass="text-text-primary text-sm leading-[100%]"
          checked={formData.companyDetails.isRepresentingCompany}
          withText
          onChange={() =>
            handleCompanyDetailsChange(
              !formData.companyDetails.isRepresentingCompany,
            )
          }
        />
        {formData.companyDetails.isRepresentingCompany && (
          <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
            <TextInput
              label={dictionary.components.profileInfo.companyName}
              inputField={{
                id: 'companyName',
                inputText: dictionary.components.profileInfo.companyNamePlaceholder,
                value: formData.companyDetails.isRepresentingCompany ? formData.companyDetails.companyName : '',
                setValue: (value) =>
                  handleCompanyDetailsChange(true, 'companyName', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.companyUID}
              inputField={{
                id: 'companyUID',
                value: formData.companyDetails.isRepresentingCompany ? (formData.companyDetails.companyUid || '') : '',
                inputText: dictionary.components.profileInfo.companyUIDPlaceholder,
                setValue: (value) =>
                  handleCompanyDetailsChange(true, 'companyUid', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.address}
              inputField={{
                id: 'companyAddress',
                value: formData.companyDetails.isRepresentingCompany ? formData.companyDetails.companyAddress : '',
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
            onUploadComplete={handleUploadComplete}
            variant='image'
            onDownload={() => {
              // Handle download logic here
            }}
            onDelete={handleFileDelete}
            locale={locale}
            className="w-full"
            maxSize={5}
            uploadProgress={uploadProgress}
          />
        </div>

        <LanguageSelector
          text={dictionary.components.languageSelector}
          // Convert formData languages to simple format for LanguageSelector
          selectedLanguages={formData.languages?.map(lang => ({
            name: lang.name,
            code: lang.code
          })) || []}
          // Convert API languages to simple format for LanguageSelector dropdown
          availableLanguages={availableLanguages.map(lang => ({
            name: lang.name,
            code: lang.code
          }))}
          // Convert formData interface language to simple format
          selectedInterfaceLanguage={formData.interfaceLanguage ? {
            name: formData.interfaceLanguage.name,
            code: formData.interfaceLanguage.code
          } : null}
          onChange={(selectedSimpleLanguages) => {
            // User checked/unchecked languages - convert back to full format
            const fullLanguages = selectedSimpleLanguages.map((simpleLang) => {
              // Check if this language already exists in formData (keeps existing data)
              const existingLang = formData.languages?.find(l => l.code === simpleLang.code);
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
              // Check if this language already exists in formData
              const existingLang = formData.languages?.find(l => l.code === selectedSimpleLang.code)
                || (formData.interfaceLanguage?.code === selectedSimpleLang.code ? formData.interfaceLanguage : null);
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
          checked={formData.receiveNewsletter}
          withText={true}
          onChange={() =>
            handleChange('receiveNewsletter', !formData.receiveNewsletter)
          }
        />

        <div className="flex flex-wrap gap-4 items-center  w-full text-base font-bold leading-none max-md:max-w-full">
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setFormData(initialData)}
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            text={dictionary.components.profileInfo.buttontext1}
          />

          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            text={dictionary.components.profileInfo.buttontext2}
          />
        </div>
      </div>
    </div>
  );
};
