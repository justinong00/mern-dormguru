import mongoose from 'mongoose';

async function dbConfig() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('MongoDB Connection Successful');
  } catch (err) {
    console.log('MongoDB Connection Failed', err);
  }
}

export default dbConfig;
