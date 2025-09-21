import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
  
  // TODO: add mock data
  const getAssignmentMock: useCaseModels.TGetAssignmentSuccessResponse['data'] =
      {};
  
  export const getAssignment = t.procedure
      .input(useCaseModels.GetAssignmentRequestSchema)
      .query(
          async (): Promise<useCaseModels.TGetAssignmentUseCaseResponse> => {
              return {
                  success: true,
                  data: getAssignmentMock,
              };
          },
      );
  