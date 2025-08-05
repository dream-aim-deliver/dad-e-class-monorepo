import { MockRouter } from '../../common/mocks/mock-router';
import { createTRPCReact } from '@trpc/react-query';


// use router from package

import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest'


//export const trpc = createTRPCReact<MockRouter>();
export const trpc = createTRPCReact<TAppRouter>();
