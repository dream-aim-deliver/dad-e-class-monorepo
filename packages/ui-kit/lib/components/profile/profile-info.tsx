import * as React from 'react';
import { DateInput } from '../date-input';
import { Button } from '../button';
import { CheckBox } from '../checkbox';
import { profile, fileMetadata } from '@maany_shr/e-class-models';
import { TextInput } from '../text-input';
import { LanguageSelector } from '../language-selector';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { language } from '@maany_shr/e-class-models';
import { UploadedFileType, Uploader } from '../drag-and-drop-uploader/uploader';
import { useState } from 'react';

interface ProfileInfoProps extends isLocalAware {
  initialData?: profile.TPersonalProfile;
  onSave?: (profile: profile.TPersonalProfile) => void;
}


/**
 * A reusable form component for managing and editing user profile information.
 *
 * @param initialData Optional initial data to prefill the form fields with user profile information.
 * @param onSave Callback function triggered when the form is submitted. Receives the updated `TPersonalProfile` object.
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
 *   locale="en"
 * />
 */

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  initialData,
  onSave,
  locale,
}) => {
  const [formData, setFormData] = React.useState<profile.TPersonalProfile>(
    () =>
      ({
        name: initialData?.name || '',
        surname: initialData?.surname || '',
        email: initialData?.email || '',
        phoneNumber: initialData?.phoneNumber || '',
        dateOfBirth: initialData?.dateOfBirth || '',
        profilePicture: initialData?.profilePicture || '',
        languages: initialData?.languages || [],
        interfaceLanguage: initialData?.interfaceLanguage || {
          code: 'ENG',
          name: 'English',
        },
        receiveNewsletter: initialData?.receiveNewsletter || false,

        isRepresentingCompany: initialData?.isRepresentingCompany ?? false,
        ...(initialData?.isRepresentingCompany
          ? {
            representingCompanyName: initialData.representingCompanyName,
            representedCompanyUID: initialData.representedCompanyUID,
            representedCompanyAddress: initialData.representedCompanyAddress,
          }
          : {}),
      }) as profile.TPersonalProfile,
  );
  const [file, setFile] = useState<UploadedFileType | null>(null);
  const dictionary = getDictionary(locale);

  const handleChange = (
    field: keyof profile.TPersonalProfileRepresentingCompany,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadedFiles = async (newFiles: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    // Set the files immediately with loading state
    const newFile = newFiles[0];

    // Update our local state immediately to show loading
    setFile(newFile);
    try {
      // Return a Promise that resolves to TFileMetadata for image
      const response: fileMetadata.TFileMetadata = await new Promise((resolve) => {
        setTimeout(() => {
          // Create a proper TFileMetadata object for image
          resolve({
            lfn: `img-${Math.random().toString(36).substr(2, 9)}`,
            name: newFile.request.name,
            url: URL.createObjectURL(new Blob([newFile.request.buffer])),
            thumbnailUrl: URL.createObjectURL(new Blob([newFile.request.buffer])),
            size: newFile.request.buffer.length,
            mimeType: 'image/jpeg',
            checksum: 'mock-checksum',
            status: 'available' as const,
            category: 'image' as const
          });
        }, 100);
      });

      setFile({
        ...newFile,
        responseData: response
      });

      // Update form data with the image URL
      if (response.category === 'image') {
        handleChange('profilePicture', response.url);
      }

      return response;
    } catch (error) {
      // Handle error properly by updating state
      setFile({
        ...newFile,
        responseData: undefined
      });

      throw error;
    }
  };
  console.log(file)
  const handleSubmit = () => {
    onSave?.(formData);
  };
  const languages: language.TLanguage[] = [
    {
      name: dictionary.components.languageSelector.english as 'English',
      code: 'ENG',
    },
    {
      name: dictionary.components.languageSelector.german as 'German',
      code: 'DEU',
    },
  ];

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
            value: formData.phoneNumber || '',
            setValue: (value) => handleChange('phoneNumber', value),
            inputText: dictionary.components.profileInfo.phoneNumberPlaceholder,
          }}
        />
        <TextInput
          label={dictionary.components.profileInfo.password}
          inputField={{
            id: 'password',
            className: "w-full",
            value: formData.phoneNumber || '',
            setValue: (value) => handleChange('phoneNumber', value),
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
          onChange={(value) => handleChange('dateOfBirth', value)}
          locale={locale}
        />
        <CheckBox
          name="isRepresentingCompany"
          value="isRepresentingCompany"
          label={dictionary.components.profileInfo.checkboxtext1}
          labelClass="text-text-primary text-sm leading-[100%]"
          checked={formData.isRepresentingCompany}
          withText
          onChange={() =>
            handleChange(
              'isRepresentingCompany',
              !formData.isRepresentingCompany,
            )
          }
        />
        {formData.isRepresentingCompany && (
          <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
            <TextInput
              label={dictionary.components.profileInfo.companyName}
              inputField={{
                id: 'companyName',
                inputText: dictionary.components.profileInfo.companyNamePlaceholder,
                value: formData.representingCompanyName || '',
                setValue: (value) =>
                  handleChange('representingCompanyName', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.companyUID}
              inputField={{
                id: 'companyUID',
                value: formData.representedCompanyUID || '',
                inputText: dictionary.components.profileInfo.companyUIDPlaceholder,
                setValue: (value) =>
                  handleChange('representedCompanyUID', value),
              }}
            />
            <TextInput
              label={dictionary.components.profileInfo.address}
              inputField={{
                id: 'companyAddress',
                value: formData.representedCompanyAddress || '',
                inputText: dictionary.components.profileInfo.addressPlaceholder,
                setValue: (value) =>
                  handleChange('representedCompanyAddress', value),
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
            file={file as UploadedFileType}
            onFilesChange={handleUploadedFiles}
            variant='image'
            onDownload={() => {
              // Handle download logic here
            }}
            locale={locale}
            className="w-full"
            maxSize={5}
            onDelete={() => {
              // Handle delete logic here
            }}
          />
        </div>

        <LanguageSelector
          text={dictionary.components.languageSelector}
          selectedLanguages={languages}
          onChange={(languages) =>
            console.log('Selected languages:', languages)
          }
          onInterfaceLanguageChange={(language) =>
            console.log('Interface language:', language)
          }
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
            onClick={() =>
              setFormData({ ...initialData } as profile.TPersonalProfile)
            }
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
