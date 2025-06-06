// export abstract class BaseReactPresenter<TSuccessResponseModel, TProgressResponseModel> {
//     abstract getViewModel(): void;
//     abstract setViewModel(): void;

//     abstract presentSuccess(response: { success: true; data: TSuccessResponse }): void;
//     abstract presentError(response: { success: false; data: TErrorResponse }): void;
//     abstract presentProgress(response: { success: "progress"; data: TProgressResponse }): void;
//     abstract presentPartial(response: { success: "partial"; data: { success: TSuccessResponse[]; error: TErrorResponse[] } }): void;
//     abstract presentPartialProgress(response: { success: "partial-progress"; data: { success: TSuccessResponse[]; error: TErrorResponse[]; progress: TProgressResponse[] } }): void;
// }


// export const useBaseReactPresenter = <
//     TViewModes extends string,
//     TViewModel extends { mode: TViewModes },
//     TErrorTypes extends string | undefined,
//     TProgressSteps extends string | undefined,
//     TResponseModel extends { success: boolean | "partial" | "partial-progress" | "progress", errorType?: TErrorTypes, step?: TProgressSteps },
//     TViewActionConfigMap extends { [key: string]: unknown }
// >(
// ) => {
//     const presenter: BasePresenter<TViewModes, TViewModel, TErrorTypes, TProgressSteps, TResponseModel, TViewActionConfigMap> = useMemo(() => presenter, [presenter]);
// }

// EXAMPLE USAGE OF REACT PRESENTER

// const presenter = useBaseReactPresenter<
//     typeof testModel.shape, 
//     "AuthError" | "UnknownError" | "ValidationError",
//     "checking-status" | "finalizing-payment",
//     TTestUsecaseResponse
// >(
//     {
//         redirect: "/success",
//     }
// );
