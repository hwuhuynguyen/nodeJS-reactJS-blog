const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Khởi tạo một instance của Sequelize với thông tin kết nối
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql", 
  }
);

module.exports = sequelize;
