import * as React from 'react';
import { Button } from '../button';
import { profile } from '@maany_shr/e-class-models';
import { IconButton } from '../icon-button';
import { TextInput } from '../text-input';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { CheckBox } from '../checkbox';
import { UploadedFile } from '../drag&drop/uploaded-file';
import { IconPlus } from '../icons/icon-plus';
import { IconClose } from '../icons/icon-close';
import { IconSearch } from '../icons/icon-search';
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations"

interface ProfessionalInfoProps extends isLocalAware{
  initialData?: profile.TProfessionalProfile;
  onSave?: (profile: profile.TProfessionalProfile) => void;
}

type fileProps = {
  isUploading: boolean;
  file: File;
}[];

/**
 * A form component for managing professional information.
 *
 * @param initialData Optional initial data to pre-fill the form fields. Schema:
 *  - `bio`: A string (max 280 characters).
 *  - `linkedinUrl`: Optional LinkedIn URL (validated).
 *  - `curriculumVitae`: Optional string for uploaded CV file.
 *  - `portfolioWebsite`: Optional valid URL for portfolio.
 *  - `associatedCompanyName`, `associatedCompanyRole`, `associatedCompanyIndustry`: Optional strings for company details.
 *  - `skills`: Optional array of skill strings.
 *  - `isPrivateProfile`: Boolean for profile visibility.
 *
 * @param onSave Callback triggered on form submission with updated data.
 */

/**
 * State Management:
 * - Initializes state with default values or provided `initialData`.
 * - Updates individual fields via `handleChange`.
 * - Resets form to initial state with `handleDiscard`.
 */

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ initialData, onSave,locale }) => {
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
  const [files, setFiles] = React.useState<fileProps>([]);
  const [allSkills, setAllSkills] = React.useState<string[]>(() => formData.skills ?? []);

// const [allSkills, setAllSkills] = React.useState<string[]>([]);

// React.useEffect(() => {
//   setAllSkills(formData.skills ?? []);
// }, [formData.skills]);

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
	      : [...prevSkills, skillName]
	  );
	};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };
  const handleUploadedFiles = (uploadedFiles: File[]) => {
    console.log("Files uploaded:", uploadedFiles);
    const filesWithStatus = uploadedFiles.map((file: any) => ({
      file,
      isUploading: true,
    }));

    setFiles((prevFiles: any) => [...prevFiles, ...filesWithStatus]);


    setTimeout(() => {
      setFiles((prevFiles: any[]) =>
        prevFiles.map((f) =>
          filesWithStatus.some((newFile: { file: any; }) => newFile.file === f.file)
            ? { ...f, isUploading: false }
            : f
        )
      );
    }, 2000);
  };
  const handleDelete = (index: number) => {
    setFiles((prevFiles: any[]) => prevFiles.filter((f, i) => i !== index));
  }

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
      className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 gap-4 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
        <h1 className="text-xl font-bold leading-tight flex items-start text-text-primary max-md:max-w-full">
          {dictionary.components.professionalInfo.title}
        </h1>

        <div
          className="flex flex-col  w-full max-md:max-w-full"
        >
          <TextAreaInput
            className="h-[104px]"
            label={dictionary.components.professionalInfo.bio}
            value={formData.bio}
            setValue={(value: string) => handleChange('bio', value)}
            placeholder={dictionary.components.professionalInfo.bioPlaceholder}
          />
        </div>

        <div className="w-full" >
          <TextInput
            label={dictionary.components.professionalInfo.linkedinUrl}
            inputField={{
              value: formData.linkedinUrl ? formData.linkedinUrl : '',
              setValue: (value) => handleChange('linkedinUrl', value),
              inputText: dictionary.components.professionalInfo.linkedinPlaceholder
            }}
            
          />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-text-secondary flex items-start'> {dictionary.components.professionalInfo.curriculumVitae}</p>
          <UploadedFile text={dictionary.components.dragDrop} files={files} className="w-full" onUpload={handleUploadedFiles} handleDelete={handleDelete} />
        </div>


        <div className=" w-full " >
          <TextInput
            label={dictionary.components.professionalInfo.portfolioWebsite}
            inputField={{
              value: formData.portfolioWebsite ? formData.portfolioWebsite : '',
              setValue: (value) => handleChange('portfolioWebsite', value),
              inputText: dictionary.components.professionalInfo.portfolioWebsitePlaceholder,
            }}
          />
        </div>

        <div className=" w-full " >
          <TextInput
            label={dictionary.components.professionalInfo.associatedCompanyName}
            inputField={{
              value: formData.associatedCompanyName
                ? formData.associatedCompanyName
                : '',
              setValue: (value) => handleChange('associatedCompanyName', value),
              inputText: dictionary.components.professionalInfo.associatedCompanyPlaceholder,
            }}
          />
        </div>

        <div className=" w-full " >
          <TextInput
            label={dictionary.components.professionalInfo.associatedCompanyRole}
            inputField={{
              value: formData.associatedCompanyRole
                ? formData.associatedCompanyRole
                : '',
              setValue: (value) => handleChange('associatedCompanyRole', value),
              inputText:dictionary.components.professionalInfo.associatedCompanyIndustryPlaceholder,
            }}
          />
        </div>

        <div className=" w-full " >
          <TextInput
            label={dictionary.components.professionalInfo.associatedCompanyIndustry}
            inputField={{
              value: formData.associatedCompanyIndustry
                ? formData.associatedCompanyIndustry
                : '',
              setValue: (value) =>
                handleChange('associatedCompanyIndustry', value),
              inputText: dictionary.components.professionalInfo.associatedCompanyPlaceholder,
            }}
          />
        </div>

        <div className="flex flex-col py-2 pr-2 pl-4  w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700 max-md:max-w-full">
          <div className="flex flex-wrap items-center justify-between w-full">
            <h2 className="text-lg font-bold text-text-primary">{dictionary.components.professionalInfo.skills}</h2>
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
              <Button variant='text' text={skill}
                hasIconRight
                iconRight={<IconClose />}
                onClick={() => setAllSkills((prevSkills) => prevSkills.filter((s) => s !== skill))}
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
                      labelClass='text-text-primary text-sm  leading-[100%]'
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

        <div
          className="flex items-start  w-full"
        >
          <CheckBox
            label={dictionary.components.professionalInfo.privateProfile}
            labelClass='text-text-primary text-sm flex items-start  leading-[100%]' 
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
