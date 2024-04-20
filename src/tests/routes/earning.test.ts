import { connectDB } from "../../config/db.config";
import userModel from "../../models/user.model";
import httpserver from "../..";
import {Server} from "http"
import Request from "supertest"
import earningModel from "../../models/earning.model";
import tokenService from "../../services/token";
import { TokenSchema } from "../../models/types/token";


beforeAll(async()=>await connectDB())

const cleanup = () =>earningModel.deleteMany()

const createTestEarning = ()=>{return earningModel.create({total: 20, outstanding: 10})}
const createTestUser =(isAdmin: boolean=false)=>userModel.create({username: "test", password: "testing", isAdmin})

describe("create earning",()=>{
    let user;
    let token: string;
    let server: Server
    let isAdmin: boolean

    beforeEach(async()=>{
        await userModel.deleteMany({})
        await cleanup()
        isAdmin = true
        user = await createTestUser(isAdmin)
        const t = await tokenService.createToken(await user.generateJWT(), isAdmin)
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    const exec = async(obj: any={})=>Request(server).post("/api/v1/earnings").set("authorization", token).send({...obj})

    it("should return 401 response if token is not provided", async()=>{
        token = ""
        const res = await exec()
        expect(res.statusCode).toBe(401)
    })

    it("should return 403 status code if user token is not admin", async()=>{
        await userModel.deleteMany({})
        const user = await createTestUser(false)
        const t = await tokenService.createToken(await user.generateJWT(), false)
        token = `Bearer ${(t as TokenSchema).accessToken}`
        const res = await exec()
        expect(res.statusCode).toBe(403)
    })

    it("should return 400 if amount is not provided", async()=>{
        const res = await exec()
        expect(res.statusCode).toBe(400)
    })

    it("should return 201 status code if valid amount is provided", async()=>{
        const res =await exec({amount: 200})
        expect(res.statusCode).toBe(201)
    })


})