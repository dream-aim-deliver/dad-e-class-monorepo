import React, { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabContent } from './tabs/tab';
import { ProfileInfo } from './profile/profile-info';
import { ProfessionalInfo } from './profile/professional-info';
import { profile } from '@maany_shr/e-class-models';
import { TLocale, getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface ProfileTabsProps extends isLocalAware {
  initialProfiles: profile.TProfiles;
  onSave?: (profiles: profile.TProfiles) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  initialProfiles,
  onSave,
  locale,  
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const hasProfessionalProfile = initialProfiles.length > 1;
  const dictionary = getDictionary(locale);
  const personalProfile = initialProfiles[0] as profile.TPersonalProfile;
  const professionalProfile = hasProfessionalProfile
    ? (initialProfiles[1] as profile.TProfessionalProfile)
    : undefined;

  if (!hasProfessionalProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <ProfileInfo
          initialData={personalProfile}
          onSave={(profile) => onSave?.([profile])}
          locale={locale as TLocale}  
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs.Root
        defaultTab="personal"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabList className="grid w-full grid-cols-2 mb-8">
          <TabTrigger value="personal">{dictionary.components.profileTab.personal}</TabTrigger>
          <TabTrigger value="professional">{dictionary.components.profileTab.professional}</TabTrigger>
        </TabList>

        <TabContent value="personal">
          <ProfileInfo
            initialData={personalProfile}
            onSave={(profile) => {
              if (professionalProfile) {
                onSave?.([profile, professionalProfile]);
              } else {
                onSave?.([profile]);
              }
            }}
            locale={locale as TLocale}  
          />
        </TabContent>

        <TabContent value="professional">
          <ProfessionalInfo
            initialData={professionalProfile}
            onSave={(profile) => {
              onSave?.([personalProfile, profile]);
            }}
            locale={locale as TLocale}  
          />
        </TabContent>

      </Tabs.Root>
    </div>
  );
};

export default ProfileTabs;