import "server-only"
import mongoose, { type ConnectOptions } from "mongoose"

const mongodbUri = process.env.MONGODB_URI

if (!mongodbUri) {
  throw new Error("Missing MONGODB_URI environment variable.")
}

const MONGODB_URI: string = mongodbUri

type MongooseConnection = typeof mongoose

interface MongooseCache {
  conn: MongooseConnection | null
  promise: Promise<MongooseConnection> | null
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached = globalWithMongoose.mongooseCache ?? { conn: null, promise: null }
globalWithMongoose.mongooseCache = cached

const connectionOptions: ConnectOptions = {
  bufferCommands: false,
}

export async function connectToDatabase(): Promise<MongooseConnection> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
        .connect(MONGODB_URI, connectionOptions)
        .then((mongooseInstance) => mongooseInstance)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectToDatabase