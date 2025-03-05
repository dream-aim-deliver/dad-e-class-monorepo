import { TDictionary } from './base';
import { Home_EN } from '../pages/home/home-en';

export const EN: TDictionary = {
  home: Home_EN,
  components: {
    coachBanner: {
      title: 'Share Your Skills and Earn',
      subtitle: 'Start Coaching Now',
      description: 'Are you passionate about sharing your expertise and helping others advance their careers while earning income? Join our community of coaches and make a real impact—whether you want to create your own course or offer one-on-one coaching, you have the freedom to choose how you contribute and grow. Take the leap and turn your skills into a rewarding opportunity today!',
      buttontext: 'Become a Coach',
    },
    skills: {
      title: 'Skills',
    },
    dragDrop: {
      title: ' Drop the files here...',
      buttontext: 'Click to upload',
      dragtext: 'or drop & drag file',
      filesize: 'Max file size',
      uploading: 'uploading..',
      cancelUpload: 'Cancel upload',
    },
    languageSelector: {
      title: 'Languages spoken fluently (C1 and above)',
      choosetext: '',
      interface: 'Interface language',
      chooseLanguage: 'Choose language',
      chooseColor: 'Choose color',
      chooseOptions: 'Choose options',
      english: 'English',
      german: 'German',
    },
    profileTab: {
      personal: 'Personal',
      professional: 'Professional',
    },
    profileInfo: {
      title: 'E-class Platform',
      name: 'Name',
      namePlaceholder: 'John',
      surname: 'Surname',
      surnamePlaceholder: 'Doe',
      email: 'Email',
      emailPlaceholder: 'johndoe@gmail.com',
      phoneNumber: 'Phone Number',
      phoneNumberPlaceholder: '+44 1234567890',
      password: 'Password',
      changePassword: 'Change Password',
      date: 'Date',
      checkboxtext1: 'I’m acting on behalf of a company',
      companyName: 'Company Name',
      companyNamePlaceholder: 'e.g. Acme',
      companyUID: 'Company UID (VAT) (optional)',
      companyUIDPlaceholder: 'e.g. CHE123456789',
      address: 'Address',
      addressPlaceholder: 'Hermetschloostrasse 70, 8048 Zürich',
      profilePicture: 'Profile Picture',
      platformPreferences: 'Platform Preference',
      platformPP: 'Languages spoken fluently (C1 and above)',
      interfaceLang: 'Interface Language',
      checkboxtext2: 'Receive Newsletter',
      buttontext1: 'Discard',
      buttontext2: 'Save changes',
    },
    professionalInfo: {
      title: 'Professional Information',
      bio: 'Bio (280 char max)',
      bioPlaceholder:
        'A compelling bio helps you stand out among other coaches. This will be visible to all students. ',

      linkedinUrl: 'LinkedIn URL',
      linkedinPlaceholder: 'https://www.linkedin.com/company/bewerbeagentur/',

      curriculumVitae: 'Curriculum Vitae (CV)',
      portfolioWebsite: 'Portfolio website URL (optional)',
      portfolioWebsitePlaceholder: 'https://wimlanz.ch/',

      associatedCompanyName: 'Company Name (optional)',
      associatedCompanyNAMEPlaceholder: 'Bewerbeagentur',
      associatedCompanyRole: 'Role (optional)',
      associatedCompanyPlaceholder: 'Senior DevOps Engineer',
      associatedCompanyIndustry: 'Industry (optional)',
      associatedCompanyIndustryPlaceholder: 'e.g. Information Technology',

      skills: 'Your skills',
      addSkills: 'Add skills',
      privateProfile:
        'Private profile (only registered users can see your name, surname and bio)',
      buttontext1: 'Discard',
      buttontext2: 'Save changes',
    },
    courseCard: {
      courseEmptyState: {
        message: "You haven't purchased any course yet",
        buttonText: 'Browse courses',
      },
    },
  },
};
