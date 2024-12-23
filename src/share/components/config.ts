export const config = {
  rpc: {
    productBrand: process.env.BASE_URL || 'http://localhost:3001',
    productCategory: process.env.BASE_URL || 'http://localhost:3001',
  },
  mysql: {
    database: process.env.DB_NAME || "",
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    port: parseInt(process.env.DB_PORT as string),
    dialect: "mysql",
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 60000
    },
    logging: false
  }
}