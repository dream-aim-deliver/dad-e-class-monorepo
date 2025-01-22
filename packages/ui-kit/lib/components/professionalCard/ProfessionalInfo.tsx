import * as React from 'react';
import { SkillItem } from './SkillItem';
import { FileSelector } from './FileDisplay';
import Input from '../textInput';
import { Button } from '../button';
import { Plus, Trash, X } from 'lucide-react';
import Checkbox from '../checkBox';
import type { TProfessionalProfile } from '../../../../models/src/profile';
import IconButton from '../iconButton';

const PREDEFINED_SKILLS = [
  { name: "Skill 1" },
  { name: "Skill 2" },
  { name: "Skill 3" },
  { name: "Skill 4" },
  { name: "Skill 5" },
  { name: "Skill 6" },
  { name: "Skill 7" },
  { name: "Skill 8" }
];

interface ProfessionalInfoProps {
  initialData?: TProfessionalProfile;
  onSave?: (profile: TProfessionalProfile) => void;
}

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ initialData, onSave }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState<TProfessionalProfile>(() => ({
    bio: initialData?.bio || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    curriculumVitae: initialData?.curriculumVitae || '',
    portfolioWebsite: initialData?.portfolioWebsite || '',
    associatedCompanyName: initialData?.associatedCompanyName || '',
    associatedCompanyRole: initialData?.associatedCompanyRole || '',
    associatedCompanyIndustry: initialData?.associatedCompanyIndustry || '',
    skills: initialData?.skills || [],
    isPrivateProfile: initialData?.isPrivateProfile || false
  }));

  const [skillSearchQuery, setSkillSearchQuery] = React.useState('');

  const handleChange = (field: keyof TProfessionalProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.includes(skillName)
        ? prev.skills.filter(skill => skill !== skillName)
        : [...(prev.skills || []), skillName]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  const handleDiscard = () => {
    setFormData(initialData || {
      bio: '',
      linkedinUrl: '',
      curriculumVitae: '',
      portfolioWebsite: '',
      associatedCompanyName: '',
      associatedCompanyRole: '',
      associatedCompanyIndustry: '',
      skills: [],
      isPrivateProfile: false
    });
  };

  const filteredSkills = PREDEFINED_SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
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

        <div className="flex flex-col mt-4 w-full max-md:max-w-full" data-testid="bio">
          <Input
            label="Bio (280 char max)"
            inputType="textarea"
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="A compelling bio helps you stand out among other coaches. This will be visible to all students."
            maxLength={280}
          />
        </div>

        <div className="mt-4 w-full mb-2" data-testid="linkedin-url">
          <Input
            className="w-full"
            label="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            placeholder="https://www.linkedin.com/company/bewerbeagentur/"
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

        <div className="mt-4 w-full mb-1" data-testid="portfolio-website-url">
          <Input
            className="w-full"
            label="Portfolio website URL"
            value={formData.portfolioWebsite}
            onChange={(e) => handleChange('portfolioWebsite', e.target.value)}
            placeholder="https://wimlanz.ch/"
          />
        </div>

        <div className="mt-4 w-full mb-1" data-testid="company-name">
          <Input
            className="w-full"
            label="Company Name"
            value={formData.associatedCompanyName}
            onChange={(e) => handleChange('associatedCompanyName', e.target.value)}
            placeholder="Bewerbeagentur"
          />
        </div>

        <div className="mt-4 w-full mb-1" data-testid="role">
          <Input
            className="w-full"
            label="Role"
            value={formData.associatedCompanyRole}
            onChange={(e) => handleChange('associatedCompanyRole', e.target.value)}
            placeholder="Senior DevOps Engineer"
          />
        </div>

        <div className="mt-4 w-full mb-1" data-testid="industry">
          <Input
            className="w-full"
            label="Industry"
            value={formData.associatedCompanyIndustry}
            onChange={(e) => handleChange('associatedCompanyIndustry', e.target.value)}
            placeholder="e.g. Information Technology"
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
                  handleChange('skills', formData.skills?.filter(s => s !== skillName));
                }}
              />
            ))}
          </div>
        </div>

        {/* Skills Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-card-fill bg-opacity-50">
            <div className="w-[340px] h-fit bg-card-fill border border-card-stroke rounded-medium p-4 relative">
              <div className='absolute right-0 top-0'>
                <IconButton
                  styles="text"
                  icon={X}
                  size="medium"
                  onClick={() => setShowModal(false)}
                  className='text-button-text-text'
                />
              </div>

              <h3 className="text-lg font-bold text-text-primary mb-2">Select Skills</h3>
              <Input
                inputType="search"
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                placeholder="Search Skills"
              />
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      label={skill.name}
                      name={`skill-${index}`}
                      value={skill.name}
                      checked={formData.skills?.includes(skill.name)}
                      size="small"
                      onChange={() => toggleSkill(skill.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center mt-4 w-full" data-testid="private-profile">
          <Checkbox
            label="Private profile (only registered users can see your name, surname and bio)"
            name="profile-visibility"
            value="private-profile"
            size="small"
            checked={formData.isPrivateProfile}
            onChange={() => handleChange('isPrivateProfile', !formData.isPrivateProfile)}
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