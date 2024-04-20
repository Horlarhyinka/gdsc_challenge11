import { Model } from "mongoose"
import SaleModel from "../models/sale.model"
import { SaleSchema } from "../models/types/sale"


class SaleService{
    constructor(
        private salesModel: Model<SaleSchema>=SaleModel
    ){}
    create(obj: {book: string, quantity: number}){
        return this.salesModel.create({...obj})
    }
    getSales(){
        return this.salesModel.find({})
    }
    getSale(id: string){
        return this.salesModel.findById(id)
    }
}

const salesService = Object.freeze(new SaleService())
export default salesService