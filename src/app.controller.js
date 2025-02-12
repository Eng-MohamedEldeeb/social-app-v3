import path from "node:path";
import { dbConnection } from "./DB/connection.js";
import authRouter from "./Modules/auth/auth.controller.js";
import userRouter from "./Modules/user/user.controller.js";
import postRouter from "./Modules/post/post.controller.js";
import groupRouter from "./Modules/group/group.controller.js";
import { globalErrorHandler } from "./Utils/Errors/globalErrorHandler.js";
import { unknownUrlHandler } from "./Utils/Errors/unknownUrlHandler.js";

export const bootstrap = async (app, express) => {
  // DB Connection
  dbConnection();

  // Parsing Static Files
  app.use("/uploads", express.static(path.resolve("./src/uploads/test")));

  // Parsing Req Body
  app.use(express.json());

  // Routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);

  // Group Router:
  app.use("/groups", groupRouter);

  // Unknown Url
  app.all("*", unknownUrlHandler);

  // Global Error Handler
  app.use(globalErrorHandler);
};
