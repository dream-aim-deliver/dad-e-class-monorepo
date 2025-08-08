import { TAppRouter } from "@dream-aim-deliver/e-class-cms-rest";
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<TAppRouter>();