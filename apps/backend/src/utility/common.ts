import jwt from "jsonwebtoken"
import {accessToken} from "@repo/backend-common/config"

export const generateAccessToken = (email: string, name: string) => {
    return jwt.sign({ email, name }, accessToken as string,{expiresIn : "1h"});
}

export const generateRefreshToken = (id:string) => {
    return jwt.sign({id}, accessToken as string,{expiresIn : "30d"});
}