import { cache } from 'react';
import { NextAuthGateway } from '@maany_shr/e-class-auth';
import { auth } from '@maany_shr/e-class-models';
import nextAuth from '../../config/auth/next-auth.config';

const getSession = cache(async (): Promise<auth.TSession | null> => {
    const authGateway = new NextAuthGateway(nextAuth);
    const sessionDTO = await authGateway.getSession();
    let session: auth.TSession | null = null;
    if (sessionDTO.success) {
        session = sessionDTO.data;
    }
    return session;
});
export default getSession;
