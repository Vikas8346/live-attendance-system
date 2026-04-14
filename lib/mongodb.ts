import mongoose from 'mongoose';

interface GlobalWithMongo {
  mongo?: {
    conn: typeof mongoose | null;
    promise?: Promise<typeof mongoose> | null;
  };
}

let cached = (global as GlobalWithMongo).mongo;

if (!cached) {
  (global as GlobalWithMongo).mongo = { conn: null, promise: null };
  cached = (global as GlobalWithMongo).mongo;
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'live_attendance_system';

  if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      })
      .catch((error) => {
        cached!.promise = null;
        throw new Error(
          `MongoDB connection failed. Check MONGODB_URI credentials/network and db access for "${MONGODB_DB_NAME}". Details: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      });
  }

  const conn = await cached.promise;

  if (cached) {
    cached.conn = conn;
  }
  return conn;
}

export default dbConnect;
