"use client";
import { Button } from '../button';
import { viewModels, fileMetadata } from '@maany_shr/e-class-models';
import { IconButton } from '../icon-button';
import { TextInput } from '../text-input';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { CheckBox } from '../checkbox';
import { IconPlus } from '../icons/icon-plus';
import { IconClose } from '../icons/icon-close';
import { IconSearch } from '../icons/icon-search';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { useState } from 'react';
import Tooltip from '../tooltip';

type TProfessionalProfileAPI = viewModels.TGetProfessionalProfileSuccess['profile'];
type TSkill = { id: string | number; name: string; slug: string };

interface ProfessionalInfoProps extends isLocalAware {
  initialData: TProfessionalProfileAPI;
  onChange: (data: TProfessionalProfileAPI) => void;
  availableSkills: TSkill[];
  onSave: (profile: TProfessionalProfileAPI) => void;
  onDiscard?: () => void;
  onFileUpload: (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ) => Promise<fileMetadata.TFileMetadata>;
  curriculumVitaeFile?: fileMetadata.TFileMetadata | null;
  onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
  onFileDelete: (id: string) => void;
  onFileDownload?: (id: string) => void;
  uploadProgress?: number;
  isSaving?: boolean;
  variant?: 'professionalInfo' | 'becomeACoach';
  skillsLanguageHint?: string;
}


/**
 * A reusable form component for managing and editing professional profile information.
 *
 * @param initialData Optional initial data to prefill the form fields with professional profile information.
 * @param onSave Callback function triggered when the form is submitted. Receives the updated `TProfessionalProfile` object.
 * @param onFileUpload Callback function to handle file uploads. This is required for the component to function properly.
 * @param curriculumVitaeFile The current curriculum vitae file metadata to display in the uploader.
 * @param onUploadComplete Callback function triggered when a file upload is completed. Receives the uploaded file metadata.
 * @param variant Optional variant to customize the component's appearance and behavior.
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
 *   onFileUpload={async (fileRequest, abortSignal) => {
 *     // Your API upload logic here
 *     const formData = new FormData();
 *     formData.append('file', fileRequest.file);
 *     const response = await fetch('/api/upload-cv', { method: 'POST', body: formData });
 *     return await response.json();
 *   }}
 *   curriculumVitaeFile={currentCurriculumVitaeFile}
 *   onUploadComplete={(fileMetadata) => console.log("Upload completed:", fileMetadata)}
 *   variant="professionalInfo"
 *   locale="en"
 * />
 */

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  initialData,
  onChange,
  availableSkills = [],
  onSave,
  onDiscard,
  onFileUpload,
  curriculumVitaeFile,
  onUploadComplete,
  onFileDelete,
  onFileDownload,
  locale,
  uploadProgress,
  isSaving = false,
  variant = 'professionalInfo',
  skillsLanguageHint,
}) => {
  const [showModal, setShowModal] = useState(false);
  const dictionary = getDictionary(locale);

  const [skillSearchQuery, setSkillSearchQuery] = useState('');

  const handleChange = <K extends keyof TProfessionalProfileAPI>(
    field: K,
    value: TProfessionalProfileAPI[K],
  ) => {
    const newData = { ...initialData, [field]: value };
    onChange(newData);
  };

  const toggleSkill = (skill: TSkill) => {
    const skillExists = initialData.skills.some(s => s.id === skill.id);
    const updatedSkills = skillExists
      ? initialData.skills.filter((s) => s.id !== skill.id)
      : [...initialData.skills, {
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        state: 'created' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

    const newData = { ...initialData, skills: updatedSkills };
    onChange(newData);
  };

  const removeSkill = (skillId: string | number) => {
    const updatedSkills = initialData.skills.filter((s) => s.id !== skillId);
    const newData = { ...initialData, skills: updatedSkills };
    onChange(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(initialData);
  };
  const handleUploadedFiles = async (
    fileRequest: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal
  ): Promise<fileMetadata.TFileMetadata> => {
    return await onFileUpload(fileRequest, abortSignal);
  };


  const handleDiscard = () => {
    onDiscard?.();
  };

  return (
    <form
      className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke w-full min-w-[240px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 gap-4 shrink w-full basis-0">
        {variant === 'professionalInfo' && (
          <h1 className="text-xl font-bold leading-tight flex items-start text-text-primary max-md:max-w-full">
            {dictionary.components.professionalInfo.title}
          </h1>
        )}

        <div className="flex flex-col  w-full max-md:max-w-full">
          <TextAreaInput
            className="h-[104px]"
            label={dictionary.components.professionalInfo.bio}
            value={initialData.bio as string}
            setValue={(value: string) => handleChange('bio', value)}
            placeholder={dictionary.components.professionalInfo.bioPlaceholder}
          />
        </div>

        <div className="w-full">
          <TextInput
            label={dictionary.components.professionalInfo.linkedinUrl}
            inputField={{
              className: "w-full",
              value: initialData.linkedinUrl ? initialData.linkedinUrl : '',
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
            file={curriculumVitaeFile ?? null}
            acceptedFileTypes={['application/pdf']}
            onFilesChange={handleUploadedFiles}
            onUploadComplete={onUploadComplete}
            onDelete={(id) => onFileDelete?.(id)}
            onDownload={(id) => onFileDownload?.(id)}
            locale={locale}
            uploadProgress={uploadProgress}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={dictionary.components.professionalInfo.portfolioWebsite}
            inputField={{
              value: initialData.portfolioWebsite ? initialData.portfolioWebsite : '',
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
              value: initialData.companyName || '',
              setValue: (value) => handleChange('companyName', value || null),
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
              value: initialData.companyRole || '',
              setValue: (value) => handleChange('companyRole', value || null),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .associatedCompanyRolePlaceholder,
            }}
          />
        </div>

        <div className=" w-full ">
          <TextInput
            label={
              dictionary.components.professionalInfo.associatedCompanyIndustry
            }
            inputField={{
              value: initialData.companyIndustry || '',
              setValue: (value) =>
                handleChange('companyIndustry', value || null),
              className: "w-full",
              inputText:
                dictionary.components.professionalInfo
                  .associatedCompanyIndustryPlaceholder,
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
            {initialData.skills?.map((skill, index) => (
              <Button
                key={skill.id}
                variant="text"
                text={skill.name}
                className="p-0"
                hasIconRight
                iconRight={<IconClose />}

                onClick={() => removeSkill(skill.id)}
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
                  type="button"
                />
              </div>

              <h3 className="text-lg font-bold text-text-primary">
                <Tooltip
                  text={dictionary.components.professionalInfo.selectSkills}
                  description={skillsLanguageHint || ''}
                  tipPosition="right"
                />
              </h3>
              <InputField
                value={skillSearchQuery}
                setValue={(value: string) => setSkillSearchQuery(value)}
                hasLeftContent={true}
                inputText={dictionary.components.professionalInfo.searchSkillsPlaceholder}
                leftContent={<IconSearch />}
              />
              <div className=" space-y-2 max-h-60 overflow-y-auto gap-2">
                {availableSkills
                  .filter((skill) =>
                    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
                  )
                  .map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <CheckBox
                        label={skill.name}
                        name={`skill-${skill.id}`}
                        labelClass="text-text-primary text-sm  leading-[100%]"
                        value={skill.name}
                        checked={initialData.skills.some((s) => s.id === skill.id)}
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
            checked={initialData.private}
            onChange={() =>
              handleChange('private', !initialData.private)
            }
          />
        </div>

        {variant === 'becomeACoach' ? (
          <Button
            variant="primary"
            size="medium"
            className="flex-1 w-full min-h-[40px]"
            text={dictionary.components.professionalInfo.sendApplicationButton}
            type="submit"
            disabled={isSaving}
          />
        ) : (
          <div className="flex flex-wrap gap-4 items-center  w-full text-base font-bold leading-none max-md:max-w-full">
            <Button
              variant="secondary"
              size="medium"
              className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
              onClick={handleDiscard}
              text={dictionary.components.professionalInfo.buttontext1}
              type="button"
            />
            <Button
              variant="primary"
              size="medium"
              className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
              text={dictionary.components.professionalInfo.buttontext2}
              type="submit"
              disabled={isSaving}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfessionalInfo;