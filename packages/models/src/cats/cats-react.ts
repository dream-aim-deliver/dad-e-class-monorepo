import { z } from "zod";
import { UsecaseResponseModelSchemaFactory } from "./cats-core";

export const useBaseReactPresenter = <
    TSuccessModel extends z.ZodRawShape,
    TErrorTypes extends string,
    TProgressSteps extends string,
    TResponseModel extends z.infer<ReturnType<typeof UsecaseResponseModelSchemaFactory<TSuccessModel, TErrorTypes, TProgressSteps>>>,
    >(
    success: {
        redirect?: string;
    }
) => {
    const toast = useToast()
    class ReactPresenter<TResponseModel extends z.infer<ReturnType<typeof UsecaseResponseModelSchemaFactory<TSuccessModel, TErrorTypes, TProgressSteps>>>> {
        constructor(
            showToas: 
        )
        presentSuccess = (response: Extract<TResponseModel, { success: true }>) => {
            // Implement your logic here
        }
    }
    return ReactPresenter<TResponseModel>;
    
}
// END : REACT PRESENTER (Infrastructure Layer)

// EXAMPLE USAGE OF REACT PRESENTER

const presenter = useBaseReactPresenter<
    typeof testModel.shape, 
    "AuthError" | "UnknownError" | "ValidationError",
    "checking-status" | "finalizing-payment",
    TTestUsecaseResponse
>(
    {
        redirect: "/success",
    }
);
