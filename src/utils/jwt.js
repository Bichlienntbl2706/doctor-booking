import {jwtDecode} from "jwt-decode"

export const decodeToken = (token) =>{
    const data = jwtDecode(token);
    console.log("data jwt: ", data)
    return data;
}