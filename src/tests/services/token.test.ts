import { connectDB } from "../../config/db.config";
import tokenService from "../../services/token";
import tokenModel from "../../models/token.model";
import { TokenSchema } from "../../models/types/token";
import mongoose from "mongoose";
import { createJWT } from "../../utils/jwt";

beforeAll(async()=>{
    await connectDB()
    await cleanup()
})

const cleanup = ()=>tokenModel.deleteMany({})

const createTestToken = ()=>tokenService.createToken((new mongoose.Types.ObjectId).toString())


describe("create token", ()=>{
    beforeEach(async()=>{
        await cleanup()
    })

    afterEach(async()=>{
        await cleanup()
    })

    it("should create access token if jwt is provided", async()=>{
        const id = new mongoose.Types.ObjectId()
        const jwt = await createJWT(id.toString())
        const res = await tokenService.createToken(jwt)
        expect((res as TokenSchema).accessToken).toBeDefined()
        expect((res as TokenSchema).refreshToken).toBeDefined()
    })
})

describe("delete token", ()=>{
    beforeEach(async()=>{
        await cleanup()
    })

    afterEach(async()=>{
        await cleanup()
    })
    it("should delete token", async()=>{
        const token = await createTestToken()
        await tokenService.deleteToken((token as TokenSchema).accessToken)
        const ex = await tokenModel.findOne({accessToken: (token as TokenSchema).accessToken})
        expect(ex).toBeNull()
    })
})

describe("find token", ()=>{
    it("should return a new token doc", async()=>{
    const token = await createTestToken()
    const res = await tokenService.findToken((token as TokenSchema).accessToken)
    expect(res?._id).toBeDefined()

    })
})

describe("find by refresh token", ()=>{
    it("should get token by refresh token", async()=>{
    const token = await createTestToken()
    const res = await tokenService.findByRefreshToken((token as TokenSchema).refreshToken)
    expect(res?.refreshToken).toMatch((token as TokenSchema).refreshToken)

    })
})