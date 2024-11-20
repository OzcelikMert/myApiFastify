import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

async function dbConnect() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  mongoose.set('strictQuery', false);
  return mongoose.connect(
    uri,
    {
      noDelay: true,
      autoCreate: true,
      autoIndex: true,
      useNewUrlParser: true, 
      useUnifiedTopology: true
    } as ConnectOptions
  );
}

export default dbConnect;
