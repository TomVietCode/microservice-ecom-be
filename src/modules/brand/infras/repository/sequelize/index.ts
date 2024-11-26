import { Sequelize } from "sequelize";
import { BaseRepositorySequelize } from "../../../../../share/repository/repo-sequelize";
import { Brand } from "../../../model/brand.model";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../../../model/dto.model";
import { modelName } from "./dto";

export class BrandRepository extends BaseRepositorySequelize<Brand, BrandUpdateDTO, BrandCondDTO> {
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName)
  }
}