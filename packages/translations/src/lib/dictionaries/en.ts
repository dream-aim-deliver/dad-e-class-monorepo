import { TDictionary } from './base';
import { Home_EN } from '../pages/home/home-en';

export const EN: TDictionary = {
  home: Home_EN,
  components: {
    skills: {
      title: 'Skills',
    },
    courseCard: {
      createdBy: 'Created by',
      you: 'You',
      group: 'Group',
      manageButton: 'Manage',
      editCourseButton: 'Edit course',
      beginCourseButton: 'Begin course',
      resumeCourseButton: 'Resume',
      reviewCourseButton: 'Review',
      detailsCourseButton: 'Details',
      publishedBadge: 'Published',
      underReviewBadge: 'Under Review',
      buyButton: 'Buy',
      fromButton: 'from',
      draftBadge: 'Draft',
      completedBadge: 'Course Completed',
      cochingSession: 'Coaching Session',
      sales: 'sales',
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
    courseReview:{
      by:'by'
    }
  },
};
