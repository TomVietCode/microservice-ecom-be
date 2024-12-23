import { ProductCondDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/model";
import { BaseRepositorySequelize } from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

export class MySQLProductRepository extends BaseRepositorySequelize<Product, ProductUpdateDTO, ProductCondDTO> {
  constructor(
    readonly sequelize: Sequelize, 
    readonly modelName: string
  ) {
    super(sequelize, modelName);
  }
}