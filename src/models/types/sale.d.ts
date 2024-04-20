import { ObjectId } from "mongoose";
import book from "../../services/book";
import { BookSchema } from "./book";

export interface SaleSchema{
    book: string | ObjectId | BookSchema
    quantity: number
}