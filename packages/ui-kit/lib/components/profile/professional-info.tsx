import * as React from 'react';
import { Button } from '../button';
import { profile, fileMetadata } from '@maany_shr/e-class-models';
import { IconButton } from '../icon-button';
import { TextInput } from '../text-input';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { CheckBox } from '../checkbox';
import { IconPlus } from '../icons/icon-plus';
import { IconClose } from '../icons/icon-close';
import { IconSearch } from '../icons/icon-search';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { UploadedFileType, Uploader } from '../drag-and-drop-uploader/uploader';
import { useState } from 'react';

interface ProfessionalInfoProps extends isLocalAware {
  initialData?: profile.TProfessionalProfile;
  onSave?: (profile: profile.TProfessionalProfile) => void;
}


/**
 * A reusable form component for managing and editing professional profile information.
 *
 * @param initialData Optional initial data to prefill the form fields with professional profile information.
 * @param onSave Callback function triggered when the form is submitted. Receives the updated `TProfessionalProfile` object.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * <ProfessionalInfo
 *   initialData={{
 *     bio: "Experienced software developer",
 *     linkedinUrl: "https://linkedin.com/in/example",
 *     curriculumVitae: "",
 *     portfolioWebsite: "https://portfolio.example.com",
 *     associatedCompanyName: "Tech Corp",
 *     associatedCompanyRole: "Software Engineer",
 *     associatedCompanyIndustry: "Technology",
 *     skills: ["JavaScript", "React"],
 *     isPrivateProfile: false,
 *   }}
 *   onSave={(profile) => console.log("Saved professional profile:", profile)}
 *   locale="en"
 * />
 */

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  initialData,
  onSave,
  locale,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const dictionary = getDictionary(locale);
  const [formData, setFormData] = React.useState<profile.TProfessionalProfile>(
    () => ({
      bio: initialData?.bio || '',
      linkedinUrl: initialData?.linkedinUrl || '',
      curriculumVitae: initialData?.curriculumVitae || '',
      portfolioWebsite: initialData?.portfolioWebsite || '',
      associatedCompanyName: initialData?.associatedCompanyName || '',
      associatedCompanyRole: initialData?.associatedCompanyRole || '',
      associatedCompanyIndustry: initialData?.associatedCompanyIndustry || '',
      skills: initialData?.skills || [],
      isPrivateProfile: initialData?.isPrivateProfile || false,
    }),
  );

  const [skillSearchQuery, setSkillSearchQuery] = React.useState('');
  const [files, setFiles] = useState<UploadedFileType | null>(null);
  const [allSkills, setAllSkills] = React.useState<string[]>(
    () => formData.skills ?? [],
  );

  const handleChange = (
    field: keyof profile.TProfessionalProfile,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillName: string) => {
    setAllSkills((prevSkills) =>
      prevSkills.includes(skillName)
        ? prevSkills.filter((skill) => skill !== skillName)
        : [...prevSkills, skillName],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };
  const handleUploadedFiles = async (newFiles: UploadedFileType[]): Promise<fileMetadata.TFileMetadata> => {
    // Get the uploaded file
    const newFile = newFiles[0];

    // Set state immediately to show loading
    setFiles(newFile);

    try {
      // TODO: remove this simulation and handle actual file upload logic
      // Simulate API call - create a TFileMetadata response for document
      const response: fileMetadata.TFileMetadata = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random(),
            name: newFile.request.name,
            url: `/uploads/${newFile.request.name}`,
            size: newFile.request.file.size,
            mimeType: 'application/pdf',
            checksum: 'mock-checksum',
            status: 'available' as const,
            category: 'document' as const
          });
        }, 2000);
      });

      // Update state after successful upload
      setFiles({
        ...newFile,
        responseData: response
      });

      // Update form data with the file URL (safe access since we know it's a document)
      if (response.category === 'document') {
        handleChange('curriculumVitae', response.url);
      }

      return response;
    } catch (error) {
      // Handle errors by updating state
      setFiles({
        ...newFile,
        responseData: undefined
      });

      throw error;
    }
  };

  const handleDiscard = () => {
    setFormData(
      initialData || {
        bio: '',
        linkedinUrl: '',
        curriculumVitae: '',
        portfolioWebsite: '',
        associatedCompanyName: '',
        associatedCompanyRole: '',
        associatedCompanyIndustry: '',
        skills: [],
        isPrivateProfile: false,
      },
    );
  };

  return (
    <form
      className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke w-full min-w-[240px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 gap-4 shrink w-full basis-0">
        <h1 className="text-xl font-bold leading-tight flex items-start text-text-primary max-md:max-w-full">
          {dictionary.components.professionalInfo.title}
        </h1>

        <div className="flex flex-col  w-full max-md:max-w-full">
          <TextAreaInput
            className="h-[104px]"
            label={dictionary.components.professionalInfo.bio}
            value={formData.bio}
            setValue={(value: string) => handleChange('bio', value)}
            placeholder={dictionary.components.professionalInfo.bioPlaceholder}
          />
        </div>

        <div className="w-full">
          <TextInput
            label={dictionary.components.professionalInfo.linkedinUrl}
            inputField={{
              className: "w-full",
              value: formData.linkedinUrl ? formData.linkedinUrl : '',
              setValue: (value) => handleChange('linkedinUrl', value),
              inputText:
                dictionary.components.professionalInfo.linkedinPlaceholder,
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-secondary flex items-start">
            {' '}
            {dictionary.components.professionalInfo.curriculumVitae}
          </p>
          <Uploader
            type="single"
            variant="document"
            file={files as UploadedFileType}
            acceptedFileTypes={['application/pdf']}
            onFilesChange={handleUploadedFiles}
            onDelete={() => {
              // Handle file deletion logic here
            }}
            onDownload={() => {
              // Handle download logic here
            }}
            locale={locale}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={dictionary.components.professionalInfo.portfolioWebsite}
            inputField={{
              value: formData.portfolioWebsite ? formData.portfolioWebsite : '',
              setValue: (value) => handleChange('portfolioWebsite', value),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .portfolioWebsitePlaceholder,
            }}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={dictionary.components.professionalInfo.associatedCompanyName}
            inputField={{
              value: formData.associatedCompanyName
                ? formData.associatedCompanyName
                : '',
              setValue: (value) => handleChange('associatedCompanyName', value),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .associatedCompanyPlaceholder,
            }}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={dictionary.components.professionalInfo.associatedCompanyRole}
            inputField={{
              value: formData.associatedCompanyRole
                ? formData.associatedCompanyRole
                : '',
              setValue: (value) => handleChange('associatedCompanyRole', value),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .associatedCompanyIndustryPlaceholder,
            }}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={
              dictionary.components.professionalInfo.associatedCompanyIndustry
            }
            inputField={{
              value: formData.associatedCompanyIndustry
                ? formData.associatedCompanyIndustry
                : '',
              setValue: (value) =>
                handleChange('associatedCompanyIndustry', value),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .associatedCompanyPlaceholder,
            }}
          />
        </div>

        <div className="flex flex-col py-2 pr-2 pl-4  w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700 max-md:max-w-full">
          <div className="flex flex-wrap items-center justify-between w-full">
            <h2 className="text-lg font-bold text-text-primary">
              {dictionary.components.professionalInfo.skills}
            </h2>
            <Button
              onClick={() => setShowModal(true)}
              className="md:ml-auto gap-2"
              variant="secondary"
              size="medium"
              text={dictionary.components.professionalInfo.addSkills}
              hasIconLeft
              iconLeft={<IconPlus />}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-2 w-full text-sm font-bold leading-none text-button-text-text">
            {allSkills?.map((skill, index) => (
              <Button
                variant="text"
                text={skill}
                className="p-0"
                hasIconRight
                iconRight={<IconClose />}
                onClick={() =>
                  setAllSkills((prevSkills) =>
                    prevSkills.filter((s) => s !== skill),
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Skills Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[340px] flex flex-col gap-4 h-fit bg-card-fill border border-card-stroke rounded-medium p-4 relative shadow-lg">
              <div className="absolute right-0 top-0">
                <IconButton
                  data-testid="close-modal-button"
                  styles="text"
                  icon={<IconClose />}
                  size="small"
                  onClick={() => setShowModal(false)}
                  className="text-button-text-text"
                />
              </div>

              <h3 className="text-lg leading-[100%] font-bold text-text-primary ">
                Select Skills
              </h3>
              <InputField
                value={skillSearchQuery}
                setValue={(value: string) => setSkillSearchQuery(value)}
                hasLeftContent={true}
                inputText="Search Skills"
                leftContent={<IconSearch />}
              />
              <div className=" space-y-2 max-h-60 overflow-y-auto gap-2">
                {formData.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <CheckBox
                      label={skill}
                      name={`skill-${index}`}
                      labelClass="text-text-primary text-sm  leading-[100%]"
                      value={skill}
                      checked={allSkills?.includes(skill)}
                      withText={true}
                      onChange={() => toggleSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start  w-full">
          <CheckBox
            label={dictionary.components.professionalInfo.privateProfile}
            labelClass="text-text-primary text-sm flex items-start  leading-[100%]"
            name="profile-visibility"
            value="private-profile"
            withText={true}
            checked={formData.isPrivateProfile}
            onChange={() =>
              handleChange('isPrivateProfile', !formData.isPrivateProfile)
            }
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center  w-full text-base font-bold leading-none max-md:max-w-full">
          <Button
            variant="secondary"
            size="medium"
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            onClick={handleDiscard}
            text={dictionary.components.professionalInfo.buttontext1}
          />
          <Button
            variant="primary"
            size="medium"
            className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
            text={dictionary.components.professionalInfo.buttontext2}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfessionalInfo;
