import * as React from 'react';
import { SkillItem } from './skillItem';
import { FileSelector } from '../fileDisplay';
import { Button } from '../button';
import { Plus, X } from 'lucide-react';
import { CheckBox } from '../checkBox';
import { profile } from '@dad-e-class/models';
import { IconButton } from '../iconButton';
import { TextInput } from '../textInput';
import { InputField } from '../inputField';
import { TextAreaInput } from '../textAreaInput';

const Skills = [
  { name: 'Skill 1' },
  { name: 'Skill 2' },
  { name: 'Skill 3' },
  { name: 'Skill 4' }
];

interface ProfessionalInfoProps {
  initialData?: profile.TProfessionalProfile;
  onSave?: (profile: profile.TProfessionalProfile) => void;
}

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  initialData,
  onSave,
}) => {
  const [showModal, setShowModal] = React.useState(false);
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

  const handleChange = (
    field: keyof profile.TProfessionalProfile,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.includes(skillName)
        ? prev.skills.filter((skill) => skill !== skillName)
        : [...(prev.skills || []), skillName],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
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

  const filteredSkills = Skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()),
  );

  return (
    <form
      className="flex gap-4 items-start p-4 rounded-medium border border-solid bg-card-fill border-card-stroke"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
        <h1 className="text-xl font-bold leading-tight text-text-primary max-md:max-w-full">
          Professional Information
        </h1>

        <div
          className="flex flex-col mt-4 w-full max-md:max-w-full"

        >
          <TextAreaInput
            className="h-[104px]"
            label="Bio (280 char max)"
            value={formData.bio}
            setValue={(value: string) => handleChange('bio', value)}
            placeholder="A compelling bio helps you stand out among other coaches. This will be visible to all students."
          />
        </div>

        <div className="mt-4 w-full mb-2" >
          <TextInput
            label="LinkedIn URL"
            inputField={{
              value: formData.linkedinUrl ? formData.linkedinUrl : '',
              setValue: (value) => handleChange('linkedinUrl', value),
            }}
          />
        </div>

        <FileSelector
          defaultFile={formData.curriculumVitae}
          maxSizeInMB={10}
          acceptedFileTypes={['application/pdf']}
          onUpload={(file) => handleChange('curriculumVitae', file)}
          onDownload={() => console.log('File downloaded')}
          onRemove={() => handleChange('curriculumVitae', '')}
        />

        <div className="mt-4 w-full mb-1" >
          <TextInput
            label="Portfolio website URL"
            inputField={{
              value: formData.portfolioWebsite ? formData.portfolioWebsite : '',
              setValue: (value) => handleChange('portfolioWebsite', value),
              inputText: 'https://wimlanz.ch/',
            }}
          />
        </div>

        <div className="mt-4 w-full mb-1" >
          <TextInput
            label="Company Name"
            inputField={{
              value: formData.associatedCompanyName
                ? formData.associatedCompanyName
                : '',
              setValue: (value) => handleChange('associatedCompanyName', value),
              inputText: 'Bewerbeagentur',
            }}
          />
        </div>

        <div className="mt-4 w-full mb-1" >
          <TextInput
            label="Role"
            inputField={{
              value: formData.associatedCompanyRole
                ? formData.associatedCompanyRole
                : '',
              setValue: (value) => handleChange('associatedCompanyRole', value),
              inputText: 'Senior DevOps Engineer',
            }}
          />
        </div>

        <div className="mt-4 w-full mb-1" >
          <TextInput
            label="Industry"
            inputField={{
              value: formData.associatedCompanyIndustry
                ? formData.associatedCompanyIndustry
                : '',
              setValue: (value) =>
                handleChange('associatedCompanyIndustry', value),
              inputText: 'e.g. Information Technology',
            }}
          />
        </div>

        <div className="flex flex-col py-2 pr-2 pl-4 mt-4 w-full rounded-medium border border-solid bg-base-neutral-800 border-base-neutral-700 max-md:max-w-full">
          <div className="flex flex-wrap items-center justify-between w-full">
            <h2 className="text-lg font-bold text-text-primary">Your skills</h2>
            <Button
              onClick={() => setShowModal(true)}
              className="ml-auto gap-2"
              variant="secondary"
              size="medium"
            >
              <Plus /> Add Skills
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-2 w-full text-sm font-bold leading-none text-button-text-text">
            {formData.skills?.map((skill, index) => (
              <SkillItem
                key={index}
                name={skill}
                onRemove={(skillName) => {
                  handleChange(
                    'skills',
                    formData.skills?.filter((s) => s !== skillName),
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Skills Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[340px] h-fit bg-card-fill border border-card-stroke rounded-medium p-4 relative shadow-lg">
              <div className="absolute right-0 top-0">
                <IconButton
                  data-testid="close-modal-button"
                  styles="text"
                  icon={X}
                  size="medium"
                  onClick={() => setShowModal(false)}
                  className="text-button-text-text"
                />
              </div>

              <h3 className="text-lg font-bold text-text-primary mb-2">
                Select Skills
              </h3>
              <InputField
                value={skillSearchQuery}
                setValue={(value: string) => setSkillSearchQuery(value)}
                hasLeftContent={true}
                inputText="Search Skills"
                leftContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    className="fill-text-primary"
                  >
                    <path d="M10.5 18.002C12.275 18.0016 13.9988 17.4074 15.397 16.314L19.793 20.71L21.207 19.296L16.811 14.9C17.905 13.5016 18.4996 11.7774 18.5 10.002C18.5 5.59095 14.911 2.00195 10.5 2.00195C6.089 2.00195 2.5 5.59095 2.5 10.002C2.5 14.413 6.089 18.002 10.5 18.002ZM10.5 4.00195C13.809 4.00195 16.5 6.69295 16.5 10.002C16.5 13.311 13.809 16.002 10.5 16.002C7.191 16.002 4.5 13.311 4.5 10.002C4.5 6.69295 7.191 4.00195 10.5 4.00195Z" />
                  </svg>
                }
              />
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto gap-2">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center ">
                    <CheckBox
                      label={skill.name}
                      name={`skill-${index}`}
                      value={skill.name}
                      checked={formData.skills?.includes(skill.name)}
                      withText={true}
                      onChange={() => toggleSkill(skill.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          className="flex items-center mt-4 w-full"
        >
          <CheckBox
            label="Private profile (only registered users can see your name, surname and bio)"
            name="profile-visibility"
            value="private-profile"
            withText={true}
            checked={formData.isPrivateProfile}
            onChange={() =>
              handleChange('isPrivateProfile', !formData.isPrivateProfile)
            }
          />
        </div>

        <div className="flex gap-4 mt-4 w-full">
          <Button
            variant="secondary"
            size="medium"
            className="flex-1 min-h-[40px]"
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button
            variant="primary"
            size="medium"
            className="flex-1 min-h-[40px]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfessionalInfo;
