import AuthContext from "../../../../lib/infrastructure/server/config/auth/next-auth.config"

const handlers = AuthContext.handlers
export const { GET, POST } = handlers