import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

interface GlobalWithMongo {
  mongo?: {
    conn: typeof mongoose | null;
  };
}

let cached = (global as GlobalWithMongo).mongo;

if (!cached) {
  (global as GlobalWithMongo).mongo = { conn: null };
  cached = (global as GlobalWithMongo).mongo;
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }

  const conn = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  if (cached) {
    cached.conn = conn;
  }
  return conn;
}

export default dbConnect;
