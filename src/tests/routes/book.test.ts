import { connectDB } from "../../config/db.config";
import bookModel from "../../models/book.model";
import { TokenSchema } from "../../models/types/token";
import userModel from "../../models/user.model";
import bookService from "../../services/book";
import tokenService from "../../services/token";
import httpserver from "../..";
import {Server} from "http"
import Request from "supertest"

const createTestBook = ()=>bookModel.create({title: "test", yearOfPublish: 2000, author: "tester", price: 1000, quantityInStock: 10, category: "Other"})

beforeAll(async()=>await connectDB())

const cleanup = async()=>{
    await userModel.deleteMany({})
    await bookModel.deleteMany({})
}

describe("create book", ()=>{
    let user;
    let token: string;
    let server: Server

    beforeEach(async()=>{
        await cleanup()
        user = await userModel.create({username: "test", password: "testing"})
        const t = await tokenService.createToken(await user.generateJWT())
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    afterEach(async()=>{
        await cleanup()
        server?.close()
    })

    const exec = async(obj: any={})=>Request(server).post("/api/v1/books").set("authorization", token).send({...obj})

    const required = ["title", "yearOfPublish", "author", "price", "quantityInStock"]
    const obj = {title: "test", yearOfPublish: 2000, author: "tester", price: 1000, quantityInStock: 10, category: "Other"}
        
    for(let r of required){
        it(`should return 400 status if ${r} is not provided`, async()=>{
            await cleanup()
            const res = await exec({...obj, [r]: undefined})
            expect(res.statusCode).toBe(400)
        })
    }

    it("should return 401 status if token header is not provided", async()=>{
        await cleanup()
        token = ""
        const res = await exec({...obj})
        expect(res.statusCode).toBe(401)
    })

    it("should return 201 if valid data is provided", async()=>{
        await cleanup()
        const res = await exec({...obj})
        expect(res.statusCode).toBe(201)
    })


})



describe("get books", ()=>{
    let user;
    let token: string;
    let server: Server

    beforeEach(async()=>{
        await connectDB()
        user = await userModel.create({username: "test", password: "testing"})
        const t = await tokenService.createToken(await user.generateJWT())
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    afterEach(async()=>{
        await cleanup()
        server?.close()
    })

    const exec = async(obj: any={})=>Request(server).get("/api/v1/books").set("authorization", token)

    it("should return an array of books", async()=>{
        await cleanup()
        await createTestBook()
        const res = await exec()
        expect(res.body.length).toBeGreaterThanOrEqual(1)
    })
})

describe("get book", ()=>{

    let user;
    let token: string;
    let server: Server

    beforeEach(async()=>{
        await connectDB()
        await cleanup()
        user = await userModel.create({username: "test", password: "testing"})
        const t = await tokenService.createToken(await user.generateJWT())
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    afterEach(async()=>{
        await cleanup()
        server?.close()
    })

    const exec = async(id: string)=>Request(server).get("/api/v1/books/"+id).set("authorization", token)
    it("should return a book object if valid id is provided", async()=>{
        await cleanup()
        const book = await createTestBook()
        const res = await exec(book._id.toString())
        expect(res.body._id).toBeDefined()
    })

})

describe("update book", ()=>{
    let user;
    let token: string;
    let server: Server

    beforeEach(async()=>{
        await connectDB()
        user = await userModel.create({username: "test", password: "testing"})
        const t = await tokenService.createToken(await user.generateJWT())
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    afterEach(async()=>{
        server?.close()
    })

    const exec = async(id: string, obj: any={})=>Request(server).put("/api/v1/books/"+id).set("authorization", token).send({...obj})

    it("should update book title", async()=>{
        await cleanup()
        const book = await createTestBook()
        const update = {title: "new title"}
        const res = await exec(book._id.toString(), update)
        expect(res.body.title).toMatch(update.title)
    })
})

describe("delete book", ()=>{
    let user;
    let token: string;
    let server: Server

    beforeEach(async()=>{
        await connectDB()
        user = await userModel.create({username: "test", password: "testing"})
        const t = await tokenService.createToken(await user.generateJWT())
        token = `Bearer ${(t as TokenSchema).accessToken}`
        httpserver.then(s=>{
            server = s
        })
    })


    afterEach(async()=>{
        server?.close()
    })

    const exec = async(id: string)=>Request(server).delete("/api/v1/books/"+id).set("authorization", token)
    it("should delete book from database", async()=>{
        await cleanup()
        const book = await createTestBook()
        await exec(book._id.toString())
        const ex = await bookModel.findById(book._id)
        expect(ex).toBeNull()
    })

})