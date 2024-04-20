import { connectDB } from "../../config/db.config";
import userModel from "../../models/user.model";
import httpserver from "../..";
import {Server} from "http"
import Request from "supertest"

const cleanup = () =>userModel.deleteMany()

beforeAll(async()=>await connectDB())

describe("register", ()=>{

    let server: Server

    beforeEach(async()=>{
        httpserver.then(s=>{
            server = s
        })
    })

    afterEach(async()=>{
        server?.close()
    })


const username = "tester"
const password = "testing"

const exec = (data={}) =>Request(server).post("/api/v1/auth/register").send(data)

it("should return 400 status if no/invalid data is provided", async()=>{
    await cleanup()
    const res1 = await exec({username: "", password: ""})
    const res2 = await exec({username, password: ""})
    const res3 = await exec({username: "", password})
    expect(res1.statusCode).toBe(400)
    expect(res2.statusCode).toBe(400)
    expect(res3.statusCode).toBe(400)

})

it("should return 201 status if user is successfully registered", async()=>{
    await cleanup()
    const res = await exec({username, password})
    expect(res.statusCode).toBe(201)
})

it("should return 400 if username is taken", async()=>{
    await cleanup()
    await exec({username, password})
    const res = await exec({username, password})
    expect(res.statusCode).toBe(400)
})
})

describe("login", ()=>{

    let server: Server

    beforeEach(async()=>{
        httpserver.then(s=>{
            server = s
        })
    })

    afterEach(async()=>{
        await cleanup()
        server?.close()
    })

const username = "tester"
const password = "testing"

const exec = (data={}) =>Request(server).post("/api/v1/auth/login").send(data)

    it("should return 400 status code if password is not provided", async()=>{
        await cleanup()
        await userModel.create({username, password})
        const res2 = await exec({username, password: ""})
        expect(res2.statusCode).toBe(400)
    })

    it("should return 400 status code if password is not correct", async()=>{
        await cleanup()
        await userModel.create({username, password})
        const res2 = await exec({username, password: "wrongp"})
        expect(res2.statusCode).toBe(400)
    })


    it("should return 404 status code if username is not found", async()=>{
        await cleanup()
        await userModel.create({username, password})
        const res2 = await exec({username: "wrong", password})
        expect(res2.statusCode).toBe(404)
    })

    it("should return 200 status code if username and password is correct", async()=>{
        await cleanup()
        await userModel.create({username, password})
        const res = await exec({username, password})
        expect(res.statusCode).toBe(200)
    })
})