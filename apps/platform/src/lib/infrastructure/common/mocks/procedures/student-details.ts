import { TGetStudentDetailsSuccessResponse, GetStudentDetailsRequestSchema, TGetStudentDetailsUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { t } from '../trpc-setup';

// Mock data for different students - this will simulate a database lookup by username
const studentsMockData: Record<string, TGetStudentDetailsSuccessResponse['data']> = {
    'alicejohnson': {
        id: 1,
        name: 'Alice',
        surname: 'Johnson',
        email: 'alice.johnson@example.com',
        username: 'alicejohnson',
        languages: [
            { id: 1, name: 'English', code: 'en', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
        ],
        avatarImage: {
            id: 'avatar-1',
            name: 'alice-avatar.jpg',
            size: 1024000,
            category: 'image',
            downloadUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
        }
    },
    'bobsmith': {
        id: 2,
        name: 'Bob',
        surname: 'Smith',
        email: 'bob.smith@example.com',
        username: 'bobsmith',
        languages: [
            { id: 1, name: 'English', code: 'en', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'German', code: 'de', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
        ],
        avatarImage: {
            id: 'avatar-2',
            name: 'bob-avatar.jpg',
            size: 856000,
            category: 'image',
            downloadUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
        }
    },
    'caroldavis': {
        id: 3,
        name: 'Carol',
        surname: 'Davis',
        email: 'carol.davis@example.com',
        username: 'caroldavis',
        languages: [
            { id: 2, name: 'German', code: 'de', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
        ],
        avatarImage: {
            id: 'avatar-3',
            name: 'carol-avatar.jpg',
            size: 1200000,
            category: 'image',
            downloadUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
    },
    'davidwilson': {
        id: 6,
        name: 'David',
        surname: 'Wilson',
        email: 'david.wilson@example.com',
        username: 'davidwilson',
        languages: [],
        avatarImage: null
    },
    'evamartinez': {
        id: 7,
        name: 'Eva',
        surname: 'Martinez',
        email: 'eva.martinez@example.com',
        username: 'evamartinez',
        languages: [
            { id: 1, name: 'English', code: 'en', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, name: 'Spanish', code: 'es', state: 'created' as const, createdAt: new Date(), updatedAt: new Date() },
        ],
        avatarImage: {
            id: 'avatar-5',
            name: 'eva-avatar.jpg',
            size: 945000,
            category: 'image',
            downloadUrl: 'https://randomuser.me/api/portraits/women/5.jpg'
        }
    }
};

export const getStudentDetails = t.procedure
    .input(GetStudentDetailsRequestSchema)
    .query(
        async ({ input }): Promise<TGetStudentDetailsUseCaseResponse> => {
            const { username } = input;

            // Simulate database lookup
            const studentData = studentsMockData[username];

            if (!studentData) {
                // Return not found error
                return {
                    success: false,
                    data: {
                        errorType: 'NotFoundError',
                        message: `Student with username '${username}' not found`,
                        operation: 'getStudentDetails',
                        context: { username }
                    }
                };
            }

            return {
                success: true,
                data: studentData,
            };
        },
    );
