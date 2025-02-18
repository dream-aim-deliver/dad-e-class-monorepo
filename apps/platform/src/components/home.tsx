'use client';
import { Button, DummySkills, Badge, ProfileTabs } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import { useTranslations } from 'next-intl';
import {
  isLocalAware,
  TLocale,
} from '@maany_shr/e-class-translations';
import ProfessionalInfo from 'packages/ui-kit/lib/components/profile/professional-info';
import { ProfileInfo } from 'packages/ui-kit/lib/components/profile/profile-info';
import { profile } from '@maany_shr/e-class-models';


export type HomeProps = isLocalAware;
// Mock Personal Profile Data
const mockPersonalProfile: profile.TPersonalProfile = {
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1990-01-01",
  profilePicture: "https://example.com/profile.jpg",
  languages: [{ code: "ENG", name: "English" }, { code: "DEU", name: "German" }],
  interfaceLanguage: { code: "ENG", name: "English" },
  receiveNewsletter: true,
  isRepresentingCompany: false,
};

// Mock Professional Profile Data
const mockProfessionalProfile: profile.TProfessionalProfile = {
  bio: "Experienced software engineer with a passion for building scalable applications.",
  linkedinUrl: "https://www.linkedin.com/in/johndoe",
  curriculumVitae: "https://example.com/cv.pdf",
  portfolioWebsite: "https://johndoe.dev",
  associatedCompanyName: "Tech Corp",
  associatedCompanyRole: "Senior Software Engineer",
  associatedCompanyIndustry: "Technology",
  skills: ["React", "Node.js", "TypeScript", "AWS"],
  isPrivateProfile: false,
};

// Combine both profiles into a single array
const mockProfiles: profile.TProfiles = [mockPersonalProfile, mockProfessionalProfile];

export default function Home(props: HomeProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('home');
  return (
    <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{t('title')}</p>
      <Button
        text={t('buttonText')}
        variant="primary"
        size="medium"
        onClick={() => {
          console.log('Clicked: ' + theme);
          setTheme(theme === 'just-do-add' ? 'Job-rand-me' : 'Bewerbeagentur');
        }}
      />
      <DummySkills
        locale={props.locale as TLocale} 
        skills={['React', 'TypeScript', 'TailwindCSS']}
      />
      
    </div>
  );
}
