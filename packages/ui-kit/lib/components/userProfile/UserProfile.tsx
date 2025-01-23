import * as React from 'react';
import { DateField } from './DateField';
import { ProfilePicture } from './ProfilePicture';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '../button';
import { CheckBox } from '../checkBox';
import { profile } from '@dad-e-class/models';
import { TextInput } from '../textInput';

interface UserProfileProps {
  initialData?: profile.TPersonalProfile;
  onSave?: (profile: profile.TPersonalProfile) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  initialData,
  onSave,
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
          code: 'en',
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

  const handleChange = (
    field: keyof profile.TPersonalProfileRepresentingCompany,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave?.(formData);
  };

  return (
    <div className="flex flex-col justify-center p-6 rounded-lg border border-solid bg-stone-900 border-stone-800 max-md:px-5">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="text-xl leading-[120%] text-[#FAFAF9] mb-4">
          Personal Profile
        </div>

        <TextInput
          label="Name"
          inputField={{
            value: formData.name,
            setValue: (value) => handleChange('name', value),
          }}
        />

        <div className="mt-4">
          <TextInput
            label="Surname"
            inputField={{
              value: formData.surname,
              setValue: (value) => handleChange('surname', value),
            }}
          />
        </div>

        <div className="mt-4">
          <TextInput
            label="Email"
            inputField={{
              value: formData.email,
              setValue: (value) => handleChange('email', value),
            }}
          />
        </div>

        <div className="mt-4">
          <TextInput
            label="Phone Number"
            inputField={{
              value: formData.phoneNumber || '',
              setValue: (value) => handleChange('phoneNumber', value),
            }}
          />
        </div>

        <div className="mt-4">
          <DateField
            value={formData.dateOfBirth || ''}
            onChange={(value) => handleChange('dateOfBirth', value)}
          />
        </div>

        <div className="mt-4">
          <CheckBox
            name="isRepresentingCompany"
            value="isRepresentingCompany"
            label="I'm acting on behalf of a company"
            checked={formData.isRepresentingCompany}
            withText
            onChange={() =>
              handleChange(
                'isRepresentingCompany',
                !formData.isRepresentingCompany,
              )
            }
          />
        </div>

        {formData.isRepresentingCompany && (
          <div className="mt-4 transition-all duration-300 ease-in-out">
            <TextInput
              label="Company Name"
              inputField={{
                value: formData.representingCompanyName || '',
                setValue: (value) =>
                  handleChange('representingCompanyName', value),
              }}
            />
            <div className="mt-4">
              <TextInput
                label="Company UID (VAT)"
                inputField={{
                  value: formData.representedCompanyUID || '',
                  setValue: (value) =>
                    handleChange('representedCompanyUID', value),
                }}
              />
            </div>
            <div className="mt-4">
              <TextInput
                label="Company Address"
                inputField={{
                  value: formData.representedCompanyAddress || '',
                  setValue: (value) =>
                    handleChange('representedCompanyAddress', value),
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <ProfilePicture
            defaultImage={formData.profilePicture || ''}
            fileNameIs="ProfilePic.jpg"
            maxSizeInMB={5}
            onUpload={(value) => handleChange('profilePicture', value)}
          />
        </div>

        <div className="mt-4">
          <LanguageSelector
            selectedLanguages={formData.languages || []}
            onChange={(languages) => handleChange('languages', languages)}
          />
        </div>

        <div className="mt-4">
          <CheckBox
            name="newsletter"
            value="newsletter"
            label="Receive Newsletter"
            checked={formData.receiveNewsletter}
            withText={true}
            onChange={() =>
              handleChange('receiveNewsletter', !formData.receiveNewsletter)
            }
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center mt-4 w-full text-base font-bold leading-none max-md:max-w-full">
          <Button
            variant="secondary"
            size="medium"
            onClick={() =>
              setFormData({ ...initialData } as profile.TPersonalProfile)
            }
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
          >
            Discard
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
