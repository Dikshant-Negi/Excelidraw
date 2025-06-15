import jwt from "jsonwebtoken"
import { accessToken } from "@repo/backend-common/config"
export const checkUser = (accesstoken:string) : any =>{
    try {
        const verify = jwt.verify(accesstoken,accessToken as string)
        if(!verify){
            return null
        }
        return verify
    } catch (error) {
        return null
    }
}