import { connectDB } from "../../config/db.config";
import userModel from "../../models/user.model";
import userService from "../../services/user";

const cleanup = () =>userModel.deleteMany()

beforeAll(async()=>await connectDB())

describe("user service: create", ()=>{
        const username = "tester"
        const password = "testing"
        const exec = async(username="", password="") =>{return await userService.create({ username, password })}
    it("should throw an error if no username or password is provided", async()=>{
        await cleanup()
        expect(()=>exec()).rejects.toThrow()
        expect(()=>exec("tester", )).rejects.toThrow()
        expect(()=>exec("", "tester")).rejects.toThrow()
    })

    it("should return a user is username and password is provided", async()=>{
        await cleanup()
        const user = await exec(username, password)
        expect(user._id).toBeDefined()
        expect(user.username).toMatch(username)
    })
})

describe("user service: find one", ()=>{
        const username = "tester"
        const password = "testing"
    it("should return a user with the correct username", async()=>{
        await cleanup()
        await userService.create({username,password})
        const res = await userService.findOne({username})
        expect(res?.username).toMatch(username)
    })

    it("should return null if username is not found", async()=>{
        await cleanup()
        const res = await userService.findOne({username: "test"})
        expect(res).toBeNull()
    })
})

describe("user service: getById", ()=>{
    it("should return a user with the correct ID", async()=>{
        await cleanup()
        const username = "tester"
        const password = "testing"
        const curr = await userService.create({username, password})
        const target = await userService.getById(curr._id)
        expect(curr._id.toString()).toMatch(target?._id.toString())
    })
})

describe("user service: get all", ()=>{
    it("should return a list of users",async()=>{
        await cleanup()
        const username = "tester"
        const password = "testing"
        await userModel.create({username, password})
        const res = await userService.getAll()
        expect(res.length).toBeDefined()
    })
})
