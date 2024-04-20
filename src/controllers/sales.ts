import { Request, Response } from "express";
import catchAsyncErrors from "../libs/catchAsyncErrors";
import validator from "../services/validator";
import salesService from "../services/sale";
import bookService from "../services/book"
import earningService from "../services/earning";

export const createSale = catchAsyncErrors(async(req: Request, res: Response)=>{
    const target = await bookService.getById(req.params.id)
    if(!target)return res.status(404).json({message: "book not found"})
    const validateRes = validator.validateCreateSalePayload(req.body)
    if(validateRes.error)return res.status(400).json({message: validateRes.error.message})
    const sale = await salesService.create({book: target._id.toString(), quantity: req.body.quantity as number})
    await earningService.createEarning(sale.quantity*target.price)
    return res.status(200).json(sale)
})

export const getSales = catchAsyncErrors(async(req: Request, res: Response)=>{
    const sales = await salesService.getSales()
    return res.status(200).json(sales)
})