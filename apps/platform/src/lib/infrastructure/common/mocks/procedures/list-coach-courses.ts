import { t } from '../trpc-setup';
import { TListCoachCoursesUseCaseResponse , ListCoachCoursesRequestSchema, TListCoachCoursesSuccessResponse } from "@dream-aim-deliver/e-class-cms-rest";

// Dataset for students (with status)
const studentCoachCourses: TListCoachCoursesSuccessResponse = {
    success: true,
    data: {
        courses:
            [
                {
                    status: {
                        status: "completed" as const,
                        completionDate: "2025-09-01"
                    },
                    title: "Mastering Batting Techniques",
                    currency: "INR",
                    rating: 4.7,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang1",
                            state: "created" as const,
                            createdAt: new Date("2023-01-10"),
                            updatedAt: new Date("2025-01-10")
                        },
                        {
                            name: "Hindi",
                            code: "hi",
                            id: "lang2",
                            state: "created" as const,
                            createdAt: new Date("2023-02-05"),
                            updatedAt: new Date("2025-02-05")
                        }
                    ],
                    id: 101,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Intensive course focused on batting skills for competitive cricket.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 4999,
                    ratingCount: 320,
                    creator: {
                        name: "Suresh",
                        surname: "Kumar",
                        username: "suresh_k",
                        avatarImage: {
                            name: "suresh_avatar.png",
                            id: "img101",
                            size: 1024,
                            category: "image" as const,
                            downloadUrl: "https://example.com/avatars/suresh_avatar.png"
                        }
                    },
                    coachingSessionCount: 25,
                    durationMinutes: 180,
                    salesCount: 1450
                },
                {
                    status: {
                        status: "inProgress" as const,
                        progress: 65
                    },
                    title: "Cricket Fitness and Conditioning",
                    currency: "INR",
                    rating: 4.0,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang4",
                            state: "created" as const,
                            createdAt: new Date("2023-03-01"),
                            updatedAt: new Date("2025-03-01")
                        },
                        {
                            name: "Telugu",
                            code: "te",
                            id: "lang5",
                            state: "created" as const,
                            createdAt: new Date("2023-03-15"),
                            updatedAt: new Date("2025-03-15")
                        }
                    ],
                    id: 103,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Enhance your physical fitness tailored for cricket.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 2999,
                    ratingCount: 150,
                    creator: {
                        name: "Anita",
                        surname: "Rao",
                        username: "anita_rao",
                        avatarImage: {
                            name: "anita_avatar.jpg",
                            id: "img102",
                            size: 1100,
                            category: "image" as const,
                            downloadUrl: "https://example.com/avatars/anita_avatar.jpg"
                        }
                    },
                    coachingSessionCount: 20,
                    durationMinutes: 120,
                    salesCount: 900
                },
                {
                    status: {
                        status: "completed" as const,
                        completionDate: "2025-07-15"
                    },
                    title: "Wicket Keeping Skills",
                    currency: "INR",
                    rating: 4.8,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang7",
                            state: "created" as const,
                            createdAt: new Date("2023-05-20"),
                            updatedAt: new Date("2025-05-20")
                        },
                        {
                            name: "Marathi",
                            code: "mr",
                            id: "lang8",
                            state: "created" as const,
                            createdAt: new Date("2023-06-01"),
                            updatedAt: new Date("2025-06-01")
                        }
                    ],
                    id: 105,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Master the essential wicket keeping techniques and reflexes.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 4500,
                    ratingCount: 260,
                    creator: {
                        name: "Rohit",
                        surname: "Patil",
                        username: "rohit_p",
                        avatarImage: null
                    },
                    coachingSessionCount: 28,
                    durationMinutes: 200,
                    salesCount: 1300
                },
                {
                    status: {
                        status: "inProgress" as const,
                        progress: 40
                    },
                    title: "Fielding and Catching Techniques",
                    currency: "INR",
                    rating: 4.1,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang10",
                            state: "created" as const,
                            createdAt: new Date("2023-08-05"),
                            updatedAt: new Date("2025-08-05")
                        }
                    ],
                    id: 107,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Improve your fielding, catching, and throwing skills.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 3200,
                    ratingCount: 190,
                    creator: {
                        name: "Arjun",
                        surname: "Singh",
                        username: "arjun_s",
                        avatarImage: null
                    },
                    coachingSessionCount: 22,
                    durationMinutes: 160,
                    salesCount: 1005
                }
            ]
    }
};

// Dataset for visitors (with description, without status)
const visitorCoachCourses: TListCoachCoursesSuccessResponse = {
    success: true,
    data: {
        courses:
            [
                {
                    description: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Learn the art of fast bowling focusing on pace, line, and length.',
                                },
                            ],
                        },
                    ]),
                    title: "Fast Bowling Basics",
                    currency: "USD",
                    rating: 4.5,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang3",
                            state: "created" as const,
                            createdAt: new Date("2022-08-15"),
                            updatedAt: new Date("2025-08-15")
                        }
                    ],
                    id: 102,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Bowling course designed for beginner to intermediate levels.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 350,
                    ratingCount: 210,
                    creator: {
                        name: "John",
                        surname: "Doe",
                        username: "john_d",
                        avatarImage: null
                    },
                    coachingSessionCount: 30,
                    durationMinutes: 150,
                    salesCount: 1200
                },
                {
                    description: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Course on the fundamentals of spin bowling including grips and deliveries.',
                                },
                            ],
                        },
                    ]),
                    title: "Spin Bowling Fundamentals",
                    currency: "USD",
                    rating: 3.9,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang6",
                            state: "created" as const,
                            createdAt: new Date("2023-04-10"),
                            updatedAt: new Date("2025-04-10")
                        }
                    ],
                    id: 104,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Build strong spin bowling skills through practical drills.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 400,
                    ratingCount: 180,
                    creator: {
                        name: "Michael",
                        surname: "Smith",
                        username: "michael_s",
                        avatarImage: {
                            name: "michael_avatar.png",
                            id: "img103",
                            size: 1300,
                            category: "image" as const,
                            downloadUrl: "https://example.com/avatars/michael_avatar.png"
                        }
                    },
                    coachingSessionCount: 15,
                    durationMinutes: 140,
                    salesCount: 850
                },
                {
                    description: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Mental preparation and focus training for competitive cricket players.',
                                },
                            ],
                        },
                    ]),
                    title: "Mental Toughness Training",
                    currency: "USD",
                    rating: 4.6,
                    languages: [
                        {
                            name: "English",
                            code: "en",
                            id: "lang9",
                            state: "created" as const,
                            createdAt: new Date("2023-07-10"),
                            updatedAt: new Date("2025-07-10")
                        }
                    ],
                    id: 106,
                    briefDescription: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Develop your mental game to perform under pressure.',
                                },
                            ],
                        },
                    ]),
                    basePrice: 380,
                    ratingCount: 220,
                    creator: {
                        name: "Sophia",
                        surname: "Turner",
                        username: "sophia_t",
                        avatarImage: {
                            name: "sophia_avatar.jpg",
                            id: "img104",
                            size: 1200,
                            category: "image" as const,
                            downloadUrl: "https://example.com/avatars/sophia_avatar.jpg"
                        }
                    },
                    coachingSessionCount: 18,
                    durationMinutes: 100,
                    salesCount: 1100
                }
            ]
    }
};

export const listCoachCourses = t.procedure
    .input(ListCoachCoursesRequestSchema)
    .query(async (opts): Promise<TListCoachCoursesUseCaseResponse> => {
        const { forStudent } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // Return appropriate dataset based on user type
        let courses;
        
        if (forStudent) {
            // For students, return courses with status information
            courses = studentCoachCourses;
        } else {
            // For visitors, return courses with description (without status)
            courses = visitorCoachCourses;
        }

        return courses;
    });
