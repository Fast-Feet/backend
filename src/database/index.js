import Sequelize from "sequelize";
import mongoose from "mongoose";

import databaseConfig from "../config/database";
import User from "../app/models/User";
import Recipient from "../app/models/Recipient";
import DeliveryMan from "../app/models/DeliveryMan";
import Order from "../app/models/Order";
import File from "../app/models/File";
import Signature from "../app/models/Signature";

const models = [User, Recipient, DeliveryMan, File, Signature, Order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
    this.mongo();
  }

  mongo() {
    const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;
    this.mongoConnection = mongoose
      .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connect to MongoDB server"))
      .catch(err => {
        console.log("Connection error to MongoDB server");
        console.log(err.message);
        console.log(err.reason);
      });
  }
}

export default new Database();
