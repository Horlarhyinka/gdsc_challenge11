import earningService from "../../services/earning";
import earningModel from "../../models/earning.model";
import { connectDB } from "../../config/db.config";
import userService from "../../services/user";

beforeAll(async()=>await connectDB())

const cleanup = () =>earningModel.deleteMany()

const createTestEarning = ()=>{return earningModel.create({total: 20, outstanding: 10})}

describe("earning service: create", ()=>{
    beforeEach(async()=>{
        await cleanup()
    })
    afterEach(async()=>{
        await cleanup()
    })
        let amount: number
    it("should throw error if amount is not provided.", async()=>{
        expect(async()=>{await earningService.createEarning(amount)}).rejects.toThrow()
    })
    it("should create a new earning if valid amount is passed", async()=>{
        const res = await earningService.createEarning(10)
        expect(res._id).toBeDefined()
    })
})

describe("earning service: get", ()=>{
    it("should return list of earnings.", async()=>{
        await createTestEarning()
        const res = await earningService.getEarnings()
        expect(res.total).toBeDefined()
        expect(res.earnings.length).toBeDefined()
    })
})

