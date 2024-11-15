import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  console.log(process.env.MONGODB_URI);

  const connectionUrl = process.env.MONGODB_URI;

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Database connected successfully!"))
    .catch((err) =>
      console.log(`Getting error from DB connection ${err.message}`)
    );
};

export default connectToDB;
