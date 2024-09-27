import assignment1 from "./assignment-1";
import { getConnection } from "../db"
import { ObjectId } from "mongodb";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    const db = await getConnection();
    const collection = db.collection<Book>('books');
    if (book.id) {
        const existingBook = await collection.findOne({ id: book.id });
        if (existingBook) {
            await collection.updateOne({ id: book.id }, { $set: book });
        } else {
            throw new Error("Book not found");
        }
        return book.id;
    } else {
        const result = await collection.insertOne(book);
        return result.insertedId.toString()
    }
}

async function removeBook(bookId: BookID): Promise<void> {
    const db = await getConnection();
    const collection = db.collection('books');
    const result = await collection.deleteOne({ _id: new ObjectId(bookId) });
    if (result.deletedCount === 0) {
        throw new Error("Book not found");
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};