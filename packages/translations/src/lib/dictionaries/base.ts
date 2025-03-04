import { z } from 'zod';

export const DictionarySchema = z.object({
    home: z.object({
        title: z.string(),
        buttonText: z.string(),
    }),
    components: z.object({
        skills: z.object({
            title: z.string(),
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
            buyCourseButton: z.string(),
            publishedBadge: z.string(),
            underReviewBadge: z.string(),
            draftBadge: z.string(),
            completedBadge: z.string(),
            cochingSession: z.string(),
            sales: z.string(),
        })
    }),
});
export type TDictionary = z.infer<typeof DictionarySchema>;