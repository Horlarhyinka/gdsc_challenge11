import { connectDB } from "../../config/db.config";
import bookModel from "../../models/book.model";
import { BookSchema } from "../../models/types/book";
import bookService from "../../services/book";


const createTestBook = ()=>bookModel.create({title: "test", yearOfPublish: 2000, author: "tester", price: 1000, quantityInStock: 10, category: "Other"})

const cleanup = ()=>bookModel.deleteMany()

beforeAll(async()=>await connectDB())

describe("book service: create", ()=>{
        const exec = async(obj: any={})=>bookService.createBook(obj)
        const required = ["title", "yearOfPublish", "author", "price"]
        const obj = {title: "test", yearOfPublish: 2000, author: "tester", price: 1000, quantityInStock: 10, category: "Other"}
        for(let r of required){
            it(`should throw if ${r} is missing`, async()=>{
                await cleanup()
                expect(()=>exec({...obj, [r]: undefined})).rejects.toThrow()
            })
        }

    it("should create book if valid data is provided", async()=>{
        await cleanup()
        const res = await exec({...obj})
        expect(res._id).toBeDefined()
    })
})

describe("book service: get", ()=>{
        it("should return book if valid book ID is provided", async()=>{
            await cleanup()
            const book = await createTestBook()
            const res = await bookService.getById(book._id.toString())
            expect(res?._id.toString()).toMatch(book._id.toString())
        })
})

describe("book service: delete", ()=>{

        const exec = async(id: string)=>bookService.deleteBook(id)

        it("should remove book from database if id is correct", async()=>{
            await cleanup()
                const book = await createTestBook()
                await exec(book._id.toString())
                const ex = await bookModel.findById(book._id.toString())
                expect(ex).toBeNull()
        })
})

describe("book service: update", ()=>{
        const exec = async(id: string,obj: any={})=>bookService.updateBook(id, obj)
        it("should update book price", async()=>{
            await cleanup()
            const newT = "another title"
            const book = await createTestBook()
            const updated = await exec(book._id.toString(), {title: newT})
            expect((updated as BookSchema).title).toMatch(newT)
        })

})