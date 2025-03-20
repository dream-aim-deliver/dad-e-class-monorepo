import { auth as authModels, role } from "@maany_shr/e-class-models";
import { NextAuthResult } from "next-auth";
import { AuthGatewayOutputPort } from "../../core/ports/secondary/auth-gateway-output-port";
import { TExtractJWTDTO, TGetRolesDTO, TGetSessionDTO } from "../../core/dto/auth-gateway-dto";
import { extractPlatformSpecificRoles } from "../utils";


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

    async getRoles(): Promise<TGetRolesDTO> {
        const data: role.TRole[] = ["visitor"];
        const sessionDTO = await this.getSession();
        if (!sessionDTO.success) {
            return {
                success: true,
                data: ["visitor"]
            }
        }
        const session = sessionDTO.data
        const user = session.user;
        if (!user) {
            console.error("[NextAuthGateway]: getRoles: User not found in the session")
            return {
                success: true,
                data: ["visitor"]
            }
        }


        const roles = user.roles;
        if(!roles) {
            return {
                success: true,
                data: ["visitor", "student"]
            }
        }
        
        const platformSpecificRoles = extractPlatformSpecificRoles(roles, session.platform);
        if (!platformSpecificRoles) {
            console.error("[NextAuthGateway]: getRoles: Platform specific roles not found")
            return {
                success: true,
                data: ["visitor", "student"]
            }
        }
        if(platformSpecificRoles.length === 0) {
            return {
                success: true,
                data: ["visitor", "student"]
            }
        }


        if (platformSpecificRoles.includes("admin")) {
            return {
                success: true,
                data: ["visitor", "student", "coach", "admin"]
            }
        }

        if(platformSpecificRoles.includes("coach")) {
            return {
                success: true,
                data: ["visitor", "student", "coach"]
            }
        }

        return {
            success: true,
            data: ["visitor", "student"]
        }
    }
}