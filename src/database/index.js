import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = await mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to database");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Xóa cache nếu kết nối thất bại
    throw e; // Ném lỗi để xử lý bên ngoài
  }

  return cached.conn;
}

export default connectToDB;

// const configOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// let isConnected = false;

// async function connectToDB() {
//   if (isConnected) {
//     console.log('Đã connect');
//     return;
//   };

//   try {
//     const connectionUrl = process.env.MONGODB_URI;

//     await mongoose
//       .connect(connectionUrl, configOptions)
//       .then(() => console.log("Database connected successfully!"));

//     isConnected = true;
//   } catch (err) {
//     console.log(`Getting error from DB connection ${err.message}`);
//     throw err;
//   }
// }

// export default connectToDB;
