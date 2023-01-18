// Imports
import { JwtPayload } from "jsonwebtoken";

export interface RequestWithUserRole extends Request
{
    id?: string | JwtPayload | undefined,
    headers: HeaderWithAuthorization
}

interface HeaderWithAuthorization extends Headers
{
    authorization?: JwtPayload
}