import { z } from "zod";
import { LanguageSchema } from "./language";


export const BasePersonalProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().date().optional(),
    profilePicture: z.string().optional(),
    languages: z.array(LanguageSchema).optional(),
    interfaceLanguage: LanguageSchema,
    receiveNewsletter: z.boolean(),
});
export type TBasePersonalProfile = z.infer<typeof BasePersonalProfileSchema>;


export const PersonalProfileNotRepresentingCompanySchema = BasePersonalProfileSchema.extend({
    isRepresentingCompany: z.literal(false),
});
export type TPersonalProfileNotRepresentingCompany = z.infer<typeof PersonalProfileNotRepresentingCompanySchema>;


export const PersonalProfileRepresentingCompanySchema = BasePersonalProfileSchema.extend({
    isRepresentingCompany: z.literal(true),
    representingCompanyName: z.string().min(1, "Company name is required"),
    representedCompanyUID: z.string().optional(),
    representedCompanyAddress: z.string().min(1, "Company address is required"),
});
export type TPersonalProfileRepresentingCompany = z.infer<typeof PersonalProfileRepresentingCompanySchema>;


export const PersonalProfileSchema = z.discriminatedUnion("isRepresentingCompany", [
    PersonalProfileNotRepresentingCompanySchema,
    PersonalProfileRepresentingCompanySchema,
]);

/**
 * Schema for personal profile.
 * 
 * This schema validates the structure of personal profile objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `name`: A string representing the name of the user.
 * - `surname`: A string representing the surname of the user.
 * - `email`: A string representing the email address of the user.
 * - `phoneNumber`: A string representing the phone number of the user.
 * - `dateOfBirth`: A string representing the date of birth of the user.
 * - `profilePicture`: A string representing the URL of the user's profile picture.
 * - `languages`: An array of language objects representing the languages spoken by the user.
 * - `interfaceLanguage`: A language object representing the user's preferred interface language.
 * - `receiveNewsletter`: A boolean indicating whether the user has opted to receive the newsletter.
 * - `isRepresentingCompany`: A boolean indicating whether the user is representing a company.
 * - `representingCompanyName`: A string representing the name of the company being represented by the user.
 * - `representedCompanyUID`: A string representing the unique identifier of the company being represented by the user.
 * - `representedCompanyAddress`: A string representing the address of the company being represented by the user.
 * 
 */
export type TPersonalProfile = z.infer<typeof PersonalProfileSchema>;


const linkedInUrlRegex = /^https:\/\/([a-zA-Z0-9-]+\.)?linkedin\.com\/[a-zA-Z0-9-]+/

export const ProfessionalProfileSchema = z.object({
    bio: z.string().max(280, "Bio must not exceed 280 characters"),
    linkedinUrl: z.string().refine((v) => linkedInUrlRegex.test(v), "Invalid LinkedIn URL").optional(),
    curriculumVitae: z.string().optional(),
    portfolioWebsite: z.string().url("Invalid portfolio URL").optional(),
    associatedCompanyName: z.string().optional(),
    associatedCompanyRole: z.string().optional(),
    associatedCompanyIndustry: z.string().optional(),
    skills: z.array(z.string()).optional(),
    isPrivateProfile: z.boolean(),
});

/**
 * Schema for professional profile.
 * 
 * This schema validates the structure of professional profile objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `bio`: A string representing the user's professional bio.
 * - `linkedinUrl`: A string representing the URL of the user's LinkedIn profile.
 * - `curriculumVitae`: A string representing the URL of the user's CV.
 * - `portfolioWebsite`: A string representing the URL of the user's portfolio website.
 * - `associatedCompanyName`: A string representing the name of the company associated with the user.
 * - `associatedCompanyRole`: A string representing the role of the user within the associated company.
 * - `associatedCompanyIndustry`: A string representing the industry of the associated company.
 * - `skills`: An array of strings representing the user's skills.
 * - `isPrivateProfile`: A boolean indicating whether the user's profile is private.
 * 
 */
export type TProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;


export const ProfilesSchema = z.array(z.union([PersonalProfileSchema, ProfessionalProfileSchema])).refine(
    (profiles) => {
        // The array must either contain:
        // - Exactly one personal profile
        // - Exactly one personal profile and exactly one professional profile
        if (profiles.length === 1) {
            const personalProfileParse = PersonalProfileSchema.safeParse(profiles[0]);
            return personalProfileParse.success;
        } else if (profiles.length === 2) {
            const personalProfileParse = PersonalProfileSchema.safeParse(profiles[0]);
            const professionalProfileParse = ProfessionalProfileSchema.safeParse(profiles[1]);
            return personalProfileParse.success && professionalProfileParse.success;
        }
        return false;
    }
);

/**
 * Schema for profiles.
 * 
 * This schema validates the structure of profiles objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * The profiles array must either contain:
 * - Exactly one personal profile
 * - Exactly one personal profile and exactly one professional profile
 */
export type TProfiles = z.infer<typeof ProfilesSchema>;