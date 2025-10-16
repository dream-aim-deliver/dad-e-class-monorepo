import { t } from '../trpc-setup';
import { TGetCoachIntroductionSuccessResponse , GetCoachIntroductionRequestSchema, TGetCoachIntroductionResponse } from "@dream-aim-deliver/e-class-cms-rest";

const coachIntroductionMock: TGetCoachIntroductionSuccessResponse = {
    success: true,
    data: {
        coach: {
            name: "Samuel",
            surname: "Richardson",
            bio: "Professional cricket coach with extensive experience in training players at all levels. Known for his focus on technique, fitness, and mental toughness.",
            avatarImage: {
                name: "samuel_avatar.jpg",
                id: "img_001",
                size: 512,
                category: "image",
                downloadUrl: "https://example.com/avatars/samuel_avatar.jpg",
            },
            rating: 4.7,
            ratingCount: 128,
            isCourseCreator: true,
            skills: [
                {
                    name: "Batting Techniques",
                    id: "skill_001",
                    state: "created",
                    createdAt: new Date("2023-01-01"),
                    updatedAt: new Date("2025-01-01"),
                    slug: "batting-techniques",
                },
                {
                    name: "Bowling Mastery",
                    id: "skill_002",
                    state: "created",
                    createdAt: new Date("2023-02-10"),
                    updatedAt: new Date("2025-02-10"),
                    slug: "bowling-mastery",
                },
                {
                    name: "Fielding Drills",
                    id: "skill_003",
                    state: "created",
                    createdAt: new Date("2023-03-05"),
                    updatedAt: new Date("2025-03-05"),
                    slug: "fielding-drills",
                },
            ],
        },
    },
};

export const getCoachIntroduction = t.procedure
    .input(GetCoachIntroductionRequestSchema)
    .query(async (opts): Promise<TGetCoachIntroductionResponse> => {
        const { coachUsername } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // In a real implementation, fetch coach data by username
        // For now, return mock data regardless of username
        return coachIntroductionMock;
    });
