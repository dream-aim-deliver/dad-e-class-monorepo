import { TExtractJWTDTO, TGetSessionDTO } from "../../dto/auth-gateway-dto";


export interface AuthGatewayOutputPort {
    getSession(): Promise<TGetSessionDTO>;
    extractJWT(): Promise<TExtractJWTDTO>;
}
