import { MongoClient, Db } from 'mongodb';

const uri = "mongodb://mongo:27017";
const client = new MongoClient(uri);

let cachedDb: Db | null = null;

export async function connect(): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        cachedDb = client.db('bookstore');
        return cachedDb;
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
        throw new Error("Failed to connect to MongoDB");
    }
}

export async function getConnection(): Promise<Db> {
    return connect();
}

// Optional: Add a function to close the connection when needed
export async function closeConnection(): Promise<void> {
    if (cachedDb) {
        await client.close();
        cachedDb = null;
        console.log("Disconnected from MongoDB");
    }
}