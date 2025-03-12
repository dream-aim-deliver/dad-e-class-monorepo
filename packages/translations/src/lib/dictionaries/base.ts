import { z } from 'zod';

export const DictionarySchema = z.object({
  home: z.object({
    title: z.string(),
    buttonText: z.string(),
    badgeText: z.string(),
  }),
  components: z.object({
    skills: z.object({
      title: z.string(),
    }),
    profileTab: z.object({
      personal: z.string(),
      professional: z.string(),
    }),
    dragDrop: z.object({
      title: z.string(),
      buttontext: z.string(),
      dragtext: z.string(),
      filesize: z.string(),
      uploading: z.string(),
      cancelUpload: z.string(),
    }),
    languageSelector: z.object({
      title: z.string(),
      choosetext: z.string(),
      interface: z.string(),
      chooseLanguage: z.string(),
      chooseColor: z.string(),
      chooseOptions: z.string(),
      english: z.string(),
      german: z.string(),
    }),
    profileInfo: z.object({
      title: z.string(),
      name: z.string(),
      namePlaceholder: z.string(),
      surname: z.string(),
      surnamePlaceholder: z.string(),
      email: z.string(),
      emailPlaceholder: z.string(),
      phoneNumber: z.string(),
      phoneNumberPlaceholder: z.string(),
      password: z.string(),
      changePassword: z.string(),
      date: z.string(),
      checkboxtext1: z.string(),
      companyName: z.string(),
      companyNamePlaceholder: z.string(),
      companyUID: z.string(),
      companyUIDPlaceholder: z.string(),
      address: z.string(),
      addressPlaceholder: z.string(),
      profilePicture: z.string(),
      platformPreferences: z.string(),
      platformPP: z.string(),
      interfaceLang: z.string(),
      checkboxtext2: z.string(),
      buttontext1: z.string(),
      buttontext2: z.string(),
    }),

    professionalInfo: z.object({
      title: z.string(),
      bio: z.string(),
      bioPlaceholder: z.string(),

      linkedinUrl: z.string(),
      linkedinPlaceholder: z.string(),

      curriculumVitae: z.string().optional(),
      portfolioWebsite: z.string(),
      portfolioWebsitePlaceholder: z.string(),
      associatedCompanyName: z.string(),
      associatedCompanyNAMEPlaceholder: z.string(),
      associatedCompanyRole: z.string(),
      associatedCompanyPlaceholder: z.string(),
      associatedCompanyIndustry: z.string(),
      associatedCompanyIndustryPlaceholder: z.string(),
      skills: z.string(),
      addSkills: z.string(),
      privateProfile: z.string(),
      buttontext1: z.string(),
      buttontext2: z.string(),
    }),
    coachCard: z.object({
      coachingSession: z.string(),
      teaches: z.string(),
      viewProfile: z.string(),
      bookSession: z.string(),
    }),
    courseCard: z.object({
      createdBy: z.string(),
      you: z.string(),
      group: z.string(),
      manageButton: z.string(),
      editCourseButton: z.string(),
      beginCourseButton: z.string(),
      resumeCourseButton: z.string(),
      reviewCourseButton: z.string(),
      detailsCourseButton: z.string(),
      buyButton: z.string(),
      fromButton: z.string(),
      publishedBadge: z.string(),
      underReviewBadge: z.string(),
      draftBadge: z.string(),
      completedBadge: z.string(),
      cochingSession: z.string(),
      sales: z.string(),
    }),
  }),
});
export type TDictionary = z.infer<typeof DictionarySchema>;
