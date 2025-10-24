import { viewModels } from '@maany_shr/e-class-models';
import {
    ListCourseGroupsUseCaseResponseSchema,
    TListCourseGroupsUseCaseResponse,
    TListCourseGroupsErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import {
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TListCourseGroupsPresenterUtilities = {};

export const ListCourseGroupsResponseMiddleware =
    {} satisfies TBaseResponseResponseMiddleware<
        TListCourseGroupsUseCaseResponse,
        viewModels.TListCourseGroupsViewModel,
        TListCourseGroupsPresenterUtilities
    >;

type TListCourseGroupsResponseMiddleware = typeof ListCourseGroupsResponseMiddleware;

export default class ListCourseGroupsPresenter extends BasePresenter<
    TListCourseGroupsUseCaseResponse,
    viewModels.TListCourseGroupsViewModel,
    TListCourseGroupsPresenterUtilities,
    TListCourseGroupsResponseMiddleware
> {
    constructor(
        setViewModel: (viewModel: viewModels.TListCourseGroupsViewModel) => void,
        viewUtilities: TListCourseGroupsPresenterUtilities,
    ) {
        super({
            schemas: {
                responseModel: ListCourseGroupsUseCaseResponseSchema,
                viewModel: viewModels.ListCourseGroupsViewModelSchema
            },
            middleware: ListCourseGroupsResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        });
    }

    presentSuccess(
        response: Extract<
            TListCourseGroupsUseCaseResponse,
            { success: true }
        >,
    ): viewModels.TListCourseGroupsViewModel {
        // Transform backend response to view model structure
        const transformedGroups = response.data.groups.map(group => ({
            groupId: group.id.toString(),
            groupName: group.name,
            currentStudents: group.actualStudentCount,
            totalStudents: group.maxStudentCount,
            course: {
                image: group.course.imageUrl || '',
                title: group.course.title,
                slug: group.course.slug,
            },
            coach: group.coaches.length > 0 ? {
                name: `${group.coaches[0].name} ${group.coaches[0].surname}`,
                isCurrentUser: group.coaches[0].isCurrentUser,
            } : undefined,
            creator: group.coaches.length > 0 ? {
                name: `${group.coaches[0].name} ${group.coaches[0].surname}`,
                image: group.coaches[0].avatarUrl || '',
            } : undefined,
        }));

        return {
            mode: 'default',
            data: {
                groups: transformedGroups
            }
        };
    }

    presentError(
        response: UnhandledErrorResponse<
            TListCourseGroupsErrorResponse,
            TListCourseGroupsResponseMiddleware
        >,
    ): viewModels.TListCourseGroupsViewModel {
        if (response.data.errorType === 'NotFoundError') {
            return {
                mode: 'not-found',
                data: {
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }
            };
        }
        return {
            mode: 'kaboom',
            data: {
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context
            }
        };
    }
}
