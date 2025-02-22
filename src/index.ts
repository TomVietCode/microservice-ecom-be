import "module-alias/register"

import { config } from "dotenv"
config();
import express, { Request, Response } from "express"
import { setupCategoryHexagon } from "@modules/category"
import { sequelize } from "@share/components/sequelize"
import { setupBrandHexagon } from "@modules/brand"
import { setupProductHexagon } from "./modules/product"
import { setupUserHexagon } from "./modules/user";
import { TokenIntrospectRPCClient } from "./share/repository/verify-token.rpc";
import { setupMiddlewares } from "./share/middlewares";
import { setupCartHexagon } from "./modules/cart";

(async () => {
  await sequelize.authenticate()
  console.log("Connection has been established successfully!")

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())

  app.get("/", (req: Request, res: Response) => {
    console.log("oke")
  })

  const introspector = new TokenIntrospectRPCClient(process.env.VERIFY_TOKEN_URL as string)
  const sctx = { mdlFactory: setupMiddlewares(introspector)}

  app.use("/v1", setupCategoryHexagon(sequelize, sctx))
  app.use("/v1", setupBrandHexagon(sequelize, sctx))
  app.use("/v1", setupProductHexagon(sequelize, sctx))
  app.use("/v1", setupUserHexagon(sequelize, sctx))
  app.use("/v1", setupCartHexagon(sequelize, sctx))
  
  app.listen(port, () => {
    console.log("Server is running on port " + port)
  })
})()
