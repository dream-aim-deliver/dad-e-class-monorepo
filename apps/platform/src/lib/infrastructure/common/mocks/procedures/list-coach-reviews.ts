import { t } from '../trpc-setup';
import { TListCoachReviewsSuccessResponse , TListCoachReviewsResponse, ListCoachReviewsRequestSchema } from "@dream-aim-deliver/e-class-cms-rest";

const coachReviewsMock: TListCoachReviewsSuccessResponse['data'] = {
    reviews: [
        {
            rating: 4.8,
            neededMoreTime: false,
            student: {
                name: "Rahul",
                surname: "Sharma",
                avatarImage: {
                    name: "rahul_avatar.png",
                    id: "a12b34",
                    size: 1024,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/rahul_avatar.png"
                }
            },
            id: "r101",
            state: "created",
            createdAt: new Date("2025-08-10T10:30:00Z"),
            updatedAt: new Date("2025-08-15T12:00:00Z"),
            coachingSession: {
                status: "completed",
                startTime: "2025-08-10T14:00:00Z",
                endTime: "2025-08-10T15:00:00Z",
                id: "cs101",
                state: "created",
                createdAt: new Date("2025-08-01T09:00:00Z"),
                updatedAt: new Date("2025-08-05T10:00:00Z"),
                publicationDate: "2025-07-31",
                coachingOfferingTitle: "Advanced Cricket Techniques",
                coachingOfferingDuration: 60,
                meetingUrl: "https://meet.example.com/session/cs101"
            },
            course: {
                title: "Cricket Fundamentals",
                image: {
                    name: "cricket_course.png",
                    id: "c101",
                    size: 2048,
                    category: "image",
                    downloadUrl: "https://example.com/images/cricket_course.png"
                },
                id: 501
            },
            notes: "Rahul has shown remarkable improvement in his batting technique over the last few sessions. His focus and determination are commendable. The coach's tailored training plan really helped him work on his foot placement and shot selection. Rahul is steadily gaining confidence and has started implementing the strategies during matches, which has reflected positively in his recent performances."
        },
        {
            rating: 4.2,
            neededMoreTime: true,
            student: {
                name: "Sneha",
                surname: "Reddy",
                avatarImage: null
            },
            id: 102,
            state: "created",
            createdAt: new Date("2025-09-05T11:15:00Z"),
            updatedAt: new Date("2025-09-06T10:45:00Z"),
            coachingSession: {
                status: "scheduled",
                startTime: "2025-09-10T09:00:00Z",
                endTime: "2025-09-10T10:30:00Z",
                id: 502,
                state: "created",
                createdAt: new Date("2025-09-01T08:00:00Z"),
                updatedAt: new Date("2025-09-03T07:55:00Z"),
                publicationDate: "2025-08-28",
                coachingOfferingTitle: "Batting Improvement",
                coachingOfferingDuration: 90,
                meetingUrl: null
            },
            course: {
                title: "Batting Masterclass",
                image: null,
                id: 502
            },
            notes: "Sneha has great potential but needs more time to refine her techniques, especially under pressure. During the sessions, she shows enthusiasm and is quick to learn when given clear and structured feedback. Focusing on her backlift and balance will be crucial in the upcoming weeks to help her convert practice into match-winning performances."
        },
        {
            rating: 4.9,
            neededMoreTime: false,
            student: {
                name: "Amit",
                surname: "Kumar",
                avatarImage: {
                    name: "amit_avatar.jpg",
                    id: "a5678",
                    size: 1500,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/amit_avatar.jpg"
                }
            },
            id: "r103",
            state: "created",
            createdAt: new Date("2025-07-21T09:00:00Z"),
            updatedAt: new Date("2025-07-25T14:30:00Z"),
            coachingSession: {
                status: "completed",
                startTime: "2025-07-22T16:00:00Z",
                endTime: "2025-07-22T17:30:00Z",
                id: "cs103",
                state: "created",
                createdAt: new Date("2025-07-10T10:00:00Z"),
                updatedAt: new Date("2025-07-15T15:00:00Z"),
                publicationDate: "2025-07-18",
                coachingOfferingTitle: "Bowling Accuracy and Pace",
                coachingOfferingDuration: 90,
                meetingUrl: "https://meet.example.com/session/cs103"
            },
            course: {
                title: "Fast Bowling Techniques",
                image: {
                    name: "fast_bowling.png",
                    id: "c103",
                    size: 1800,
                    category: "image",
                    downloadUrl: "https://example.com/images/fast_bowling.png"
                },
                id: 503
            },
            notes: "Amit's commitment to improving his bowling has been outstanding. He has significantly improved his line and length, which has started to trouble batsmen in local matches. The drills focusing on his run-up and release point have paid off. His mental focus during sessions is excellent, and he continues to work hard on fitness and technique."
        },
        {
            rating: 3.7,
            neededMoreTime: true,
            student: {
                name: "Nisha",
                surname: "Patel",
                avatarImage: {
                    name: "nisha_avatar.png",
                    id: "a91011",
                    size: 1100,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/nisha_avatar.png"
                }
            },
            id: "r104",
            state: "created",
            createdAt: new Date("2025-06-15T08:30:00Z"),
            updatedAt: new Date("2025-06-18T09:45:00Z"),
            coachingSession: {
                status: "requested",
                startTime: "2025-06-20T10:00:00Z",
                endTime: "2025-06-20T11:30:00Z",
                id: "cs104",
                state: "created",
                createdAt: new Date("2025-06-01T07:00:00Z"),
                updatedAt: new Date("2025-06-10T08:00:00Z"),
                publicationDate: "2025-05-30",
                coachingOfferingTitle: "Fielding and Agility",
                coachingOfferingDuration: 90,
                meetingUrl: null
            },
            course: {
                title: "Fielding Excellence",
                image: null,
                id: 504
            },
            notes: "Nisha is progressing but needs more focused attention on footwork and reaction times. Energy levels in afternoon sessions are sometimes low, indicating a need for better conditioning. The coach suggests more stamina building and agility drills. With perseverance, she can become a key fielder in the team."
        },
        {
            rating: 5.0,
            neededMoreTime: false,
            student: {
                name: "Vikram",
                surname: "Singh",
                avatarImage: {
                    name: "vikram_avatar.jpg",
                    id: "a121314",
                    size: 1300,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/vikram_avatar.jpg"
                }
            },
            id: "r105",
            state: "created",
            createdAt: new Date("2025-10-01T10:00:00Z"),
            updatedAt: new Date("2025-10-05T11:30:00Z"),
            coachingSession: {
                status: "completed",
                startTime: "2025-10-03T15:00:00Z",
                endTime: "2025-10-03T16:30:00Z",
                id: "cs105",
                state: "created",
                createdAt: new Date("2025-09-25T11:00:00Z"),
                updatedAt: new Date("2025-09-29T12:00:00Z"),
                publicationDate: "2025-09-20",
                coachingOfferingTitle: "Mental Toughness Training",
                coachingOfferingDuration: 90,
                meetingUrl: "https://meet.example.com/session/cs105"
            },
            course: {
                title: "Mindset for Winning",
                image: {
                    name: "mental_training.png",
                    id: "c105",
                    size: 1700,
                    category: "image",
                    downloadUrl: "https://example.com/images/mental_training.png"
                },
                id: 505
            },
            notes: "Vikram has exhibited a tremendous mental shift during these sessions. His ability to remain calm under pressure has improved drastically. The coach's focus on visualization and routine-building has been instrumental. This mental toughness is already helping Vikram perform better in tight match situations."
        },
        {
            rating: 3.9,
            neededMoreTime: true,
            student: {
                name: "Anjali",
                surname: "Desai",
                avatarImage: null
            },
            id: "r106",
            state: "created",
            createdAt: new Date("2025-05-12T09:30:00Z"),
            updatedAt: new Date("2025-05-15T10:30:00Z"),
            coachingSession: {
                status: "canceled",
                startTime: "2025-05-20T14:00:00Z",
                endTime: "2025-05-20T15:30:00Z",
                id: "cs106",
                state: "created",
                createdAt: new Date("2025-05-10T08:00:00Z"),
                updatedAt: new Date("2025-05-15T10:00:00Z"),
                publicationDate: "2025-05-05",
                coachingOfferingTitle: "Spin Bowling Basics",
                coachingOfferingDuration: 90,
                meetingUrl: null
            },
            course: {
                title: "Spin Bowling Techniques",
                image: null,
                id: 506
            },
            notes: "Anjali has shown interest in spin bowling but has struggled with consistency. Sessions were unfortunately canceled due to scheduling conflicts, but she remains committed to learning. The coach recommends focusing on grip and release mechanics once sessions resume to develop better control."
        },
        {
            rating: 4.5,
            neededMoreTime: false,
            student: {
                name: "Rohit",
                surname: "Gupta",
                avatarImage: {
                    name: "rohit_avatar.png",
                    id: "a151617",
                    size: 1250,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/rohit_avatar.png"
                }
            },
            id: "r107",
            state: "created",
            createdAt: new Date("2025-07-30T11:00:00Z"),
            updatedAt: new Date("2025-08-02T12:15:00Z"),
            coachingSession: {
                status: "completed",
                startTime: "2025-07-31T13:00:00Z",
                endTime: "2025-07-31T14:30:00Z",
                id: "cs107",
                state: "created",
                createdAt: new Date("2025-07-20T09:30:00Z"),
                updatedAt: new Date("2025-07-25T10:30:00Z"),
                publicationDate: "2025-07-18",
                coachingOfferingTitle: "Power Hitting Workshop",
                coachingOfferingDuration: 90,
                meetingUrl: "https://meet.example.com/session/cs107"
            },
            course: {
                title: "Power Hitting Techniques",
                image: {
                    name: "power_hitting.png",
                    id: "c107",
                    size: 1900,
                    category: "image",
                    downloadUrl: "https://example.com/images/power_hitting.png"
                },
                id: 507
            },
            notes: "Rohit's power hitting has improved dramatically. His timing and shot selection during sessions have been outstanding. The coach praises his quick adaptation to technique adjustments and his enthusiasm in practice matches has increased accordingly."
        },
        {
            rating: 4.1,
            neededMoreTime: false,
            student: {
                name: "Kavya",
                surname: "Iyer",
                avatarImage: {
                    name: "kavya_avatar.png",
                    id: "a181920",
                    size: 1175,
                    category: "image",
                    downloadUrl: "https://example.com/avatars/kavya_avatar.png"
                }
            },
            id: "r108",
            state: "created",
            createdAt: new Date("2025-08-18T10:45:00Z"),
            updatedAt: new Date("2025-08-22T11:55:00Z"),
            coachingSession: {
                status: "completed",
                startTime: "2025-08-20T15:00:00Z",
                endTime: "2025-08-20T16:00:00Z",
                id: "cs108",
                state: "created",
                createdAt: new Date("2025-08-10T09:00:00Z"),
                updatedAt: new Date("2025-08-15T10:00:00Z"),
                publicationDate: "2025-08-05",
                coachingOfferingTitle: "Fielding Drills and Strategy",
                coachingOfferingDuration: 60,
                meetingUrl: "https://meet.example.com/session/cs108"
            },
            course: {
                title: "Advanced Fielding",
                image: {
                    name: "advanced_fielding.png",
                    id: "c108",
                    size: 1650,
                    category: "image",
                    downloadUrl: "https://example.com/images/advanced_fielding.png"
                },
                id: 508
            },
            notes: "Kavya's agility and quick reflexes stand out during fielding sessions. She has responded well to coaching on positioning and anticipation. There is noticeable improvement in her throwing accuracy, and her energy on the field is commendable."
        }
    ]
};

export const listCoachReviews = t.procedure
    .input(ListCoachReviewsRequestSchema)
    .query(async (opts): Promise<TListCoachReviewsResponse> => {
        const { coachUsername } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // In a real implementation, filter reviews by coach username
        // For now, return all mock reviews
        return {
            success: true,
            data: coachReviewsMock,
        };
    });
