import { z } from "zod";

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
//     TResponseModel,
//     TViewModel
//     >(
//     success: {
//         redirect?: string;
//     }
// ) => {
//     class ReactPresenter<TResponseModel, TViewModel> {
//         constructor(
//             showToas: 
//         )
//         presentSuccess = (response: Extract<TResponseModel, { success: true }>) => {
//             // Implement your logic here
//         }
//     }
//     return ReactPresenter<TResponseModel>;
    
// }
// END : REACT PRESENTER (Infrastructure Layer)

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
