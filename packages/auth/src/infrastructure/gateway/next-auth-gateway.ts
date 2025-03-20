import { auth as authModels } from "@maany_shr/e-class-models";
import { NextAuthResult } from "next-auth";
import { AuthGatewayOutputPort } from "../../core/ports/secondary/auth-gateway-output-port";
import { TExtractJWTDTO, TGetSessionDTO } from "../../core/dto/auth-gateway-dto";


export class NextAuthGateway implements AuthGatewayOutputPort {
    constructor(private nextAuth: NextAuthResult) {}

    async extractJWT(): Promise<TExtractJWTDTO> {
        const sessionDTO = await this.getSession();
        if (!sessionDTO.success) {
            console.error("[NextAuthGateway]: extractJWT: Session not found")
            return {
                success: false,
                data: {
                    name: "SessionNotFoundError",
                    code: 404,
                    message: "Session not found",
                    context: sessionDTO.data
                }
            }
        }
        const session = sessionDTO.data
        const idToken = session.user?.idToken;
        const accessToken = session.user?.accessToken;
        if (!idToken || !accessToken) {
            console.error("[NextAuthGateway]: extractJWT: JWT not found in the session")
            return {
                success: false,
                data: {
                    name: "JWTNotFoundError",
                    code: 404,
                    message: "JWT not found in the session",
                    context: {}
                }
            }
        }
        return {
            success: true,
            data: {
                idToken,
                accessToken
            }
        }
    }

    async getSession(): Promise<TGetSessionDTO> {
        const auth = this.nextAuth.auth
        const session = await auth();
        if (session) {
            const isValidSession = authModels.SessionSchema.safeParse(session);
            if (isValidSession.success) {
                return {
                    success: true,
                    data: isValidSession.data
                }
            }
            console.error("[NextAuthGateway]: getSession: Validation Error: ", isValidSession.error.errors)
            return {
                success: false,
                data: {
                    name: "ValidationError",
                    code: 400,
                    message: "Invalid session object",
                    context: isValidSession.error.errors
                }
            }
        }
        return {
            success: false,
            data: {
                name: "SessionNotFoundError",
                code: 404,
                message: "Session not found",
                context: {}
            }
        }
    }
}