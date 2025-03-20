import { TExtractJWTDTO, TGetSessionDTO, TGetRolesDTO } from "../../dto/auth-gateway-dto";


export interface AuthGatewayOutputPort {
    getSession(): Promise<TGetSessionDTO>;
    getRoles(): Promise<TGetRolesDTO>;
    extractJWT(): Promise<TExtractJWTDTO>;
}
