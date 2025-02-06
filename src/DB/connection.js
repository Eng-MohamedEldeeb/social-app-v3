import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("DB Connected Successfully!"))
    .catch((error) => console.error("DB Connection Failure!", error));
};
