import books from './../mcmasteful-book-list.json';
import { getConnection } from "../db"

export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};


async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {
    const db = await getConnection();
    const collection = db.collection('books');

    const query = filters && filters.length > 0
        ? {
            $or: filters.map(filter => ({
                price: {
                    $gte: filter.from ?? 0,
                    $lte: filter.to ?? Number.MAX_VALUE
                }
            }))
        }
        : {};

    return collection.find(query).toArray() as unknown as Book[];
}


// If you have multiple filters, a book matching any of them is a match.
async function listBooksOld(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
     if (!filters || filters.length === 0) {
         return books; // No filters, return all books
     }
     console.log("running listBooks")
     return books.filter(book =>
         filters.some(filter =>
             (filter.from === undefined || book.price >= filter.from) &&
             (filter.to === undefined || book.price <= filter.to)
         )
     );
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};
