import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/apiError";
import { JwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth = (...rules: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        // console.log("Received token:", token); // Log token here
        if (!token) {
            throw new ApiError(404, "Token is not Found !!")
        }
        let verifiedUser;
        try {
            verifiedUser = await JwtHelper.verifyToken(token, config.jwt.secret as Secret);
        } catch (error) {
            throw new ApiError(403, "User is not Found !!")
        }
        req.user = verifiedUser;

        if (rules.length && !rules.includes(verifiedUser.role)) {
            throw new ApiError(403, "You are not Authorised !!")
        }
        next();
    } catch (error) {
        next(error)
    }
}


// import { NextFunction, Request, Response } from "express";
// import ApiError from "../../errors/apiError";
// import { JwtHelper } from "../../helpers/jwtHelper";
// import config from "../../config";
// import { Secret } from "jsonwebtoken";

// export const auth = (...roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authorizationHeader = req.headers.authorization;

//         if (!authorizationHeader) {
//             throw new ApiError(404, "Token is not Found !!");
//         }

//         // Extract token from the "Bearer " prefix
//         const token = authorizationHeader.split(' ')[1];
// console.log(token);
//         if (!token) {
//             throw new ApiError(404, "Token is not Found !!");
//         }

//         let verifiedUser;
//         try {
//             verifiedUser = await JwtHelper.verifyToken(token, config.jwt.secret as Secret);
//         } catch (error) {
//             throw new ApiError(403, "User is not Found !!");
//         }

//         req.user = verifiedUser;

//         if (roles.length && !roles.includes(verifiedUser.role)) {
//             throw new ApiError(403, "You are not Authorized !!");
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// }
