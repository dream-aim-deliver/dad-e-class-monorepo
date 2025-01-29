import { PersonalProfileNotRepresentingCompanySchema, PersonalProfileRepresentingCompanySchema, ProfessionalProfileSchema, ProfilesSchema, TPersonalProfileNotRepresentingCompany } from '../src/profile';
import { describe, it, expect } from 'vitest';

describe('profile', () => {

    it('should validate a personal profile', () => {
        const validProfile: TPersonalProfileNotRepresentingCompany = {
            name: 'John',
            surname: 'Doe',
            email: 'test@abc.ch',
            phoneNumber: '123456789',
            dateOfBirth: '1990-01-01',
            profilePicture: 'https://example.com/profile.jpg',
            languages: [{ name: 'English', code: 'ENG' }],
            interfaceLanguage: { name: 'English', code: 'ENG' },
            receiveNewsletter: true,
            isRepresentingCompany: false,
        };
        expect(PersonalProfileNotRepresentingCompanySchema.safeParse(validProfile).success).toBe(true);
    });

    it('should validate a valid PersonalProfileRepresentingCompany', () => {
        const validProfile = {
            name: 'Jane',
            surname: 'Doe',
            email: 'jane.doe@company.com',
            phoneNumber: '987654321',
            dateOfBirth: '1985-05-15',
            profilePicture: 'https://example.com/jane_profile.jpg',
            languages: [{ name: 'German', code: 'DEU' }],
            interfaceLanguage: { name: 'German', code: 'DEU' },
            receiveNewsletter: false,
            isRepresentingCompany: true,
            representingCompanyName: 'TechCorp',
            representedCompanyUID: '12345',
            representedCompanyAddress: '123 Tech Road, City, Country',
        };
        expect(PersonalProfileRepresentingCompanySchema.safeParse(validProfile).success).toBe(true);
    });

    it('should validate a valid ProfessionalProfile', () => {
        const validProfile = {
            bio: 'Experienced software engineer with a passion for building scalable applications.',
            linkedinUrl: 'https://linkedin.com/in/johndoe',
            curriculumVitae: 'https://example.com/johndoe_cv.pdf',
            portfolioWebsite: 'https://johndoe.dev',
            associatedCompanyName: 'TechCorp',
            associatedCompanyRole: 'Software Engineer',
            associatedCompanyIndustry: 'Software',
            skills: ['Marketing', 'Video Editing'],
            isPrivateProfile: false,
        };
        expect(ProfessionalProfileSchema.safeParse(validProfile).success).toBe(true);
    });

    it('should invalidate a PersonalProfile due to invalid language', () => {
        const invalidProfile = {
            name: 'John',
            surname: 'Doe',
            email: 'test@abc.ch',
            phoneNumber: '123456789',
            dateOfBirth: '1990-01-01',
            profilePicture: 'https://example.com/profile.jpg',
            languages: [{ name: 'Nonsense', code: 'ABC123' }],
            interfaceLanguage: { name: 'English', code: 'ENG' },
            receiveNewsletter: true,
            isRepresentingCompany: false,
        };
        // Expect the profile to be invalid
        expect(PersonalProfileNotRepresentingCompanySchema.safeParse(invalidProfile).success).toBe(false);
    });

    it('should invalidate an incorrect LinkedIn URL in ProfessionalProfile', () => {
        const invalidProfile = {
            bio: 'Experienced software engineer.',
            linkedinUrl: 'https://somethingelse.com/johndoe',
            curriculumVitae: 'https://example.com/johndoe_cv.pdf',
            portfolioWebsite: 'https://johndoe.dev',
            associatedCompanyName: 'TechCorp',
            associatedCompanyRole: 'Software Engineer',
            associatedCompanyIndustry: 'Software',
            skills: ['Marketing', 'Video Editing'],
            isPrivateProfile: false,
        };
        expect(ProfessionalProfileSchema.safeParse(invalidProfile).success).toBe(false);
    });

    it('should validate Profiles with one PersonalProfile', () => {
        const validProfiles = [
            {
                name: 'John',
                surname: 'Doe',
                email: 'test@abc.ch',
                phoneNumber: '123456789',
                dateOfBirth: '1990-01-01',
                profilePicture: 'https://example.com/profile.jpg',
                languages: [{ name: 'English', code: 'ENG' }],
                interfaceLanguage: { name: 'English', code: 'ENG' },
                receiveNewsletter: true,
                isRepresentingCompany: false,
            },
        ];
        expect(ProfilesSchema.safeParse(validProfiles).success).toBe(true);
    });

    it('should validate Profiles with one PersonalProfile and one ProfessionalProfile', () => {
        const validProfiles = [
            {
                name: 'John',
                surname: 'Doe',
                email: 'test@abc.ch',
                phoneNumber: '123456789',
                dateOfBirth: '1990-01-01',
                profilePicture: 'https://example.com/profile.jpg',
                languages: [{ name: 'English', code: 'ENG' }],
                interfaceLanguage: { name: 'English', code: 'ENG' },
                receiveNewsletter: true,
                isRepresentingCompany: false,
            },
            {
                bio: 'Experienced software engineer.',
                linkedinUrl: 'https://linkedin.com/in/johndoe',
                curriculumVitae: 'https://example.com/johndoe_cv.pdf',
                portfolioWebsite: 'https://johndoe.dev',
                associatedCompanyName: 'TechCorp',
                associatedCompanyRole: 'Software Engineer',
                associatedCompanyIndustry: 'Software',
                skills: ['Marketing', 'Video Editing'],
                isPrivateProfile: false,
            },
        ];
        expect(ProfilesSchema.safeParse(validProfiles).success).toBe(true);
    });

    it('should invalidate Profiles with two PersonalProfiles', () => {
        const invalidProfiles = [
            {
                name: 'John',
                surname: 'Doe',
                email: 'test@abc.ch',
                phoneNumber: '123456789',
                dateOfBirth: '1990-01-01',
                profilePicture: 'https://example.com/profile.jpg',
                languages: [{ name: 'English', code: 'ENG' }],
                interfaceLanguage: { name: 'English', code: 'ENG' },
                receiveNewsletter: true,
                isRepresentingCompany: false,
            },
            {
                name: 'Jane',
                surname: 'Doe',
                email: 'jane.doe@company.com',
                phoneNumber: '987654321',
                dateOfBirth: '1985-05-15',
                profilePicture: 'https://example.com/jane_profile.jpg',
                languages: [{ name: 'German', code: 'DEU' }],
                interfaceLanguage: { name: 'German', code: 'DEU' },
                receiveNewsletter: false,
                isRepresentingCompany: false,
            },
        ];
        expect(ProfilesSchema.safeParse(invalidProfiles).success).toBe(false);
    });


});
