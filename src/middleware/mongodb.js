import connectToDB from "./database";

export default function mongoMiddleware(handler) {
  return async (req, res) => {
    await connectToDB();
    return handler(req, res);
  };
}
