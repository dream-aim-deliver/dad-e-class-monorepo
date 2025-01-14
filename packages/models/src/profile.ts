import { z } from "zod";

export const BaseStudentProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.number().optional(),  // Unix timestamp
    isCompany: z.boolean(), // TODO: is this a good name?
    representingCompanyName: z.string().optional(),
    representedCompanyUID: z.string().optional(),
    representedCompanyAddress: z.string().optional(),
    profilePicture: z.string().optional(),
    languages: z.array(z.string()).optional(),
    interfaceLanguage: z.string(),
    receiveNewsletter: z.boolean(),
});

export const StudentProfileSchema = BaseStudentProfileSchema.extend({
    type: z.enum(["student"]),
});
export type TStudentProfile = z.infer<typeof StudentProfileSchema>;


export const BaseCoachProfileSchema = BaseStudentProfileSchema.extend({
    bio: z.string().max(280, "Bio must not exceed 280 characters"),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),  // TODO: validate LinkedIn URL properly
    curriculumVitae: z.string().optional(),
    portfolioWebsite: z.string().url("Invalid portfolio URL").optional(),
    associatedCompanyName: z.string().optional(),
    associatedCompanyRole: z.string().optional(),
    associatedCompanyIndustry: z.string().optional(),
    skills: z.array(z.string()).optional(),
    isPrivateProfile: z.boolean(),
});

export const CoachProfileSchema = BaseCoachProfileSchema.extend({
    type: z.enum(["coach"]),
});
export type TCoachProfile = z.infer<typeof CoachProfileSchema>;


export const BaseCourseCreatorProfileSchema = BaseCoachProfileSchema.extend({});

export const CourseCreatorProfileSchema = BaseCourseCreatorProfileSchema.extend({
    type: z.enum(["course-creator"]),
});

export type TCourseCreatorProfile = z.infer<typeof CourseCreatorProfileSchema>;


export const BaseAdminProfileSchema = BaseCourseCreatorProfileSchema.extend({});

export const AdminProfileSchema = BaseAdminProfileSchema.extend({
    type: z.enum(["admin"]),
});
export type TAdminProfile = z.infer<typeof AdminProfileSchema>;


export const ProfileSchema = z.discriminatedUnion("type", [
    StudentProfileSchema,
    CoachProfileSchema,
    CourseCreatorProfileSchema,
    AdminProfileSchema,
]);
export type TProfile = z.infer<typeof ProfileSchema>;