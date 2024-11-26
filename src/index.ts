import express, { Request, Response } from "express"
import { config } from "dotenv"
import { setupCategoryHexagon } from "./modules/category"
import { sequelize } from "./share/components/sequelize"
import { setupBrandHexagon } from "./modules/brand";

config();

(async () => {
  await sequelize.authenticate()
  console.log("Connection has been established successfully!")

  const app = express()
  const port = process.env.PORT || 3000
  
  app.use(express.json())
  
  app.get("/", (req: Request, res: Response) => {
    console.log("oke")
  })
  
  app.use("/v1", setupCategoryHexagon(sequelize))
  app.use("/v1", setupBrandHexagon(sequelize))
  
  app.listen(port, () => {
    console.log("Server is running on port " + port)
  })
})()





