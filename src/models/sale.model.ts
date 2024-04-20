import mongoose from "mongoose"
import { SaleSchema } from "./types/sale"
import bookModel from "./book.model"

const saleSchema = new mongoose.Schema<SaleSchema>({
    book: {
        type: mongoose.Schema.Types.ObjectId, ref: bookModel
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

export default mongoose.model("sale", saleSchema)