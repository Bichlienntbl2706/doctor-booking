import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
// import { Favourites } from "@prisma/client";
import { FavouritesService } from "../favourites/favourites.service";
import { IFavourites } from "../../../models/Favourites.model";

const addFavourite = catchAsync(async (req: Request, res: Response) => {
    const result = await FavouritesService.createFavourite(req.user, req.body);
    sendResponse<IFavourites>(res, {
        statusCode: 200,
        message: 'Successfully Add Favourite !!',
        success: true,
        data: result
    })
})

const removeFavourite = catchAsync(async (req: Request, res: Response) => {
    const result = await FavouritesService.removeFavourite(req.user, req.body);
    sendResponse<IFavourites>(res, {
        statusCode: 200,
        message: 'Successfully Removed Favourite !!',
        success: true,
        data: result,
    })
})

const getPatientFavourites = catchAsync(async (req: Request, res: Response) => {
    const result = await FavouritesService.getPatientFavourites(req.user);
    console.log("req user: ", req.user)
    sendResponse<IFavourites[]>(res, {
        statusCode: 200,
        message: 'Successfully Retrieve Favourites !!',
        success: true,
        data: result,
    })
})

export const FavouriteController = {
    addFavourite,
    removeFavourite,
    getPatientFavourites
}