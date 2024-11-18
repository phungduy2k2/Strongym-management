import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let isConnected = false;

async function connectToDB() {
  if (isConnected) {
    console.log('Đã connect');
    return;
  };

  try {
    const connectionUrl = process.env.MONGODB_URI;

    await mongoose
      .connect(connectionUrl, configOptions)
      .then(() => console.log("Database connected successfully!"));

    isConnected = true;
  } catch (err) {
    console.log(`Getting error from DB connection ${err.message}`);
    throw err;
  }
}

export default connectToDB;
