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
  availableSkillsEn?: TSkill[];
  availableSkillsDe?: TSkill[];
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
  isSaveDisabled?: boolean;
  variant?: 'professionalInfo' | 'becomeACoach';
  skillsLanguageHint?: string;
  applicationMode?: boolean;
  requireCV?: boolean;
  onValidationError?: (error: string) => void;
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
  availableSkillsEn,
  availableSkillsDe,
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
  isSaveDisabled = false,
  variant = 'professionalInfo',
  skillsLanguageHint,
  applicationMode = false,
  requireCV = false,
  onValidationError,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEn, setShowModalEn] = useState(false);
  const [showModalDe, setShowModalDe] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const dictionary = getDictionary(locale);

  // Determine if we have dual language mode (both EN and DE skill lists available)
  const hasDualLanguage = Boolean(availableSkillsEn && availableSkillsDe);

  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [skillSearchQueryEn, setSkillSearchQueryEn] = useState('');
  const [skillSearchQueryDe, setSkillSearchQueryDe] = useState('');

  const handleChange = <K extends keyof TProfessionalProfileAPI>(
    field: K,
    value: TProfessionalProfileAPI[K],
  ) => {
    const newData = { ...initialData, [field]: value };
    onChange(newData);
  };

  // Helper to create a skill entry from a TSkill
  const makeSkillEntry = (skill: TSkill) => ({
    id: skill.id,
    name: skill.name,
    slug: skill.slug,
    state: 'created' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const toggleSkill = (skill: TSkill) => {
    const skillExists = initialData.skills.some(s => s.id === skill.id);
    const updatedSkills = skillExists
      ? initialData.skills.filter((s) => s.id !== skill.id)
      : [...initialData.skills, makeSkillEntry(skill)];

    const newData = { ...initialData, skills: updatedSkills };
    onChange(newData);
  };

  const removeSkill = (skillId: string | number) => {
    const updatedSkills = initialData.skills.filter((s) => s.id !== skillId);
    const newData = { ...initialData, skills: updatedSkills };
    onChange(newData);
  };

  // Language-specific skill toggles (for dual mode)
  const toggleSkillEn = (skill: TSkill) => {
    const currentSkillsEn = (initialData as any).skillsEn || [];
    const skillExists = currentSkillsEn.some((s: TSkill) => s.id === skill.id);
    const updatedSkillsEn = skillExists
      ? currentSkillsEn.filter((s: TSkill) => s.id !== skill.id)
      : [...currentSkillsEn, makeSkillEntry(skill)];
    // Also update combined skills list
    const updatedSkills = skillExists
      ? initialData.skills.filter((s) => s.id !== skill.id)
      : [...initialData.skills, makeSkillEntry(skill)];
    onChange({ ...initialData, skillsEn: updatedSkillsEn, skills: updatedSkills } as any);
  };

  const removeSkillEn = (skillId: string | number) => {
    const currentSkillsEn = (initialData as any).skillsEn || [];
    const updatedSkillsEn = currentSkillsEn.filter((s: TSkill) => s.id !== skillId);
    const updatedSkills = initialData.skills.filter((s) => s.id !== skillId);
    onChange({ ...initialData, skillsEn: updatedSkillsEn, skills: updatedSkills } as any);
  };

  const toggleSkillDe = (skill: TSkill) => {
    const currentSkillsDe = (initialData as any).skillsDe || [];
    const skillExists = currentSkillsDe.some((s: TSkill) => s.id === skill.id);
    const updatedSkillsDe = skillExists
      ? currentSkillsDe.filter((s: TSkill) => s.id !== skill.id)
      : [...currentSkillsDe, makeSkillEntry(skill)];
    const updatedSkills = skillExists
      ? initialData.skills.filter((s) => s.id !== skill.id)
      : [...initialData.skills, makeSkillEntry(skill)];
    onChange({ ...initialData, skillsDe: updatedSkillsDe, skills: updatedSkills } as any);
  };

  const removeSkillDe = (skillId: string | number) => {
    const currentSkillsDe = (initialData as any).skillsDe || [];
    const updatedSkillsDe = currentSkillsDe.filter((s: TSkill) => s.id !== skillId);
    const updatedSkills = initialData.skills.filter((s) => s.id !== skillId);
    onChange({ ...initialData, skillsDe: updatedSkillsDe, skills: updatedSkills } as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // CV validation in application mode
    if (requireCV && !curriculumVitaeFile) {
      const errorMessage = dictionary.components.professionalInfo.cvRequired || 'CV is required';
      // In application mode, only show error in banner, not inline
      if (applicationMode) {
        onValidationError?.(errorMessage);
      } else {
        setCvError(errorMessage);
      }
      return;
    }

    setCvError(null);
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

        {hasDualLanguage ? (
          <>
            <div className="flex flex-col w-full max-md:max-w-full">
              <TextAreaInput
                className="h-[104px]"
                label={dictionary.components.professionalInfo.bioEn}
                value={((initialData as any).bioEn as string) || ''}
                setValue={(value: string) => handleChange('bioEn' as any, value)}
                placeholder={dictionary.components.professionalInfo.bioPlaceholder}
              />
            </div>
            <div className="flex flex-col w-full max-md:max-w-full">
              <TextAreaInput
                className="h-[104px]"
                label={dictionary.components.professionalInfo.bioDe}
                value={((initialData as any).bioDe as string) || ''}
                setValue={(value: string) => handleChange('bioDe' as any, value)}
                placeholder={dictionary.components.professionalInfo.bioPlaceholder}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full max-md:max-w-full">
            <TextAreaInput
              className="h-[104px]"
              label={dictionary.components.professionalInfo.bio}
              value={initialData.bio as string}
              setValue={(value: string) => handleChange('bio', value)}
              placeholder={dictionary.components.professionalInfo.bioPlaceholder}
            />
          </div>
        )}

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
            {requireCV && <span className="text-error ml-1">*</span>}
          </p>
          <Uploader
            type="single"
            variant="document"
            file={curriculumVitaeFile ?? null}
            acceptedFileTypes={['application/pdf']}
            onFilesChange={handleUploadedFiles}
            onUploadComplete={(file) => {
              setCvError(null);
              if (applicationMode) {
                onValidationError?.(''); // Clear validation error in parent
              }
              onUploadComplete(file);
            }}
            onDelete={(id) => {
              setCvError(null);
              if (applicationMode) {
                onValidationError?.(''); // Clear validation error in parent
              }
              onFileDelete?.(id);
            }}
            onDownload={(id) => onFileDownload?.(id)}
            locale={locale}
            uploadProgress={uploadProgress}
          />
          {cvError && !applicationMode && (
            <p className="text-sm text-error">{cvError}</p>
          )}
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

        {hasDualLanguage ? (
          <>
            {/* Two-column skills layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Skills (English) */}
              <div className="flex flex-col py-2 pr-2 pl-4 w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700">
                <div className="flex flex-wrap items-center justify-between w-full">
                  <h2 className="text-lg font-bold text-text-primary">
                    {dictionary.components.professionalInfo.skillsEn}
                  </h2>
                  <Button
                    onClick={() => setShowModalEn(true)}
                    className="md:ml-auto gap-2"
                    variant="secondary"
                    size="medium"
                    text={dictionary.components.professionalInfo.addSkills}
                    hasIconLeft
                    disabled={isSaving}
                    iconLeft={<IconPlus />}
                  />
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-2 w-full text-sm font-bold leading-none text-button-text-text">
                  {((initialData as any).skillsEn || []).map((skill: TSkill) => (
                    <Button
                      key={skill.id}
                      variant="text"
                      text={skill.name}
                      className="p-0"
                      hasIconRight
                      iconRight={<IconClose />}
                      onClick={() => removeSkillEn(skill.id)}
                      disabled={isSaving}
                    />
                  ))}
                </div>
              </div>

              {/* Skills (German) */}
              <div className="flex flex-col py-2 pr-2 pl-4 w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700">
                <div className="flex flex-wrap items-center justify-between w-full">
                  <h2 className="text-lg font-bold text-text-primary">
                    {dictionary.components.professionalInfo.skillsDe}
                  </h2>
                  <Button
                    onClick={() => setShowModalDe(true)}
                    className="md:ml-auto gap-2"
                    variant="secondary"
                    size="medium"
                    text={dictionary.components.professionalInfo.addSkills}
                    hasIconLeft
                    disabled={isSaving}
                    iconLeft={<IconPlus />}
                  />
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-2 w-full text-sm font-bold leading-none text-button-text-text">
                  {((initialData as any).skillsDe || []).map((skill: TSkill) => (
                    <Button
                      key={skill.id}
                      variant="text"
                      text={skill.name}
                      className="p-0"
                      hasIconRight
                      iconRight={<IconClose />}
                      onClick={() => removeSkillDe(skill.id)}
                      disabled={isSaving}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Skills EN Selection Modal */}
            {showModalEn && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-[340px] flex flex-col gap-4 h-fit bg-card-fill border border-card-stroke rounded-medium p-4 relative shadow-lg">
                  <div className="absolute right-0 top-0">
                    <IconButton
                      styles="text"
                      icon={<IconClose />}
                      size="small"
                      onClick={() => setShowModalEn(false)}
                      className="text-button-text-text"
                      type="button"
                      disabled={isSaving}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {dictionary.components.professionalInfo.skillsEn}
                  </h3>
                  <InputField
                    value={skillSearchQueryEn}
                    setValue={(value: string) => setSkillSearchQueryEn(value)}
                    hasLeftContent={true}
                    inputText={dictionary.components.professionalInfo.searchSkillsPlaceholder}
                    leftContent={<IconSearch />}
                  />
                  <div className="space-y-2 max-h-60 overflow-y-auto gap-2">
                    {(availableSkillsEn || [])
                      .filter((skill) =>
                        skill.name.toLowerCase().includes(skillSearchQueryEn.toLowerCase())
                      )
                      .map((skill) => (
                        <div key={skill.id} className="flex items-center">
                          <CheckBox
                            label={skill.name}
                            name={`skill-en-${skill.id}`}
                            labelClass="text-text-primary text-sm leading-[100%]"
                            value={skill.name}
                            checked={((initialData as any).skillsEn || []).some((s: TSkill) => s.id === skill.id)}
                            withText={true}
                            onChange={() => toggleSkillEn(skill)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills DE Selection Modal */}
            {showModalDe && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-[340px] flex flex-col gap-4 h-fit bg-card-fill border border-card-stroke rounded-medium p-4 relative shadow-lg">
                  <div className="absolute right-0 top-0">
                    <IconButton
                      styles="text"
                      icon={<IconClose />}
                      size="small"
                      onClick={() => setShowModalDe(false)}
                      className="text-button-text-text"
                      type="button"
                      disabled={isSaving}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {dictionary.components.professionalInfo.skillsDe}
                  </h3>
                  <InputField
                    value={skillSearchQueryDe}
                    setValue={(value: string) => setSkillSearchQueryDe(value)}
                    hasLeftContent={true}
                    inputText={dictionary.components.professionalInfo.searchSkillsPlaceholder}
                    leftContent={<IconSearch />}
                  />
                  <div className="space-y-2 max-h-60 overflow-y-auto gap-2">
                    {(availableSkillsDe || [])
                      .filter((skill) =>
                        skill.name.toLowerCase().includes(skillSearchQueryDe.toLowerCase())
                      )
                      .map((skill) => (
                        <div key={skill.id} className="flex items-center">
                          <CheckBox
                            label={skill.name}
                            name={`skill-de-${skill.id}`}
                            labelClass="text-text-primary text-sm leading-[100%]"
                            value={skill.name}
                            checked={((initialData as any).skillsDe || []).some((s: TSkill) => s.id === skill.id)}
                            withText={true}
                            onChange={() => toggleSkillDe(skill)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col py-2 pr-2 pl-4 w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700 max-md:max-w-full">
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
                  disabled={isSaving}
                  iconLeft={<IconPlus />}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-2 w-full text-sm font-bold leading-none text-button-text-text">
                {initialData.skills?.map((skill) => (
                  <Button
                    key={skill.id}
                    variant="text"
                    text={skill.name}
                    className="p-0"
                    hasIconRight
                    iconRight={<IconClose />}
                    onClick={() => removeSkill(skill.id)}
                    disabled={isSaving}
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
                      disabled={isSaving}
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
                  <div className="space-y-2 max-h-60 overflow-y-auto gap-2">
                    {availableSkills
                      .filter((skill) =>
                        skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
                      )
                      .map((skill) => (
                        <div key={skill.id} className="flex items-center">
                          <CheckBox
                            label={skill.name}
                            name={`skill-${skill.id}`}
                            labelClass="text-text-primary text-sm leading-[100%]"
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
          </>
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
              disabled={isSaveDisabled}
            />
            <Button
              variant="primary"
              size="medium"
              className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
              text={dictionary.components.professionalInfo.buttontext2}
              type="submit"
              disabled={isSaveDisabled}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfessionalInfo;