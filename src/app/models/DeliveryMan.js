import Sequelize, { Model } from "sequelize";

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      { sequelize, tableName: "deliverymen" }
    );
    console.log("Connect to deliverymen table");
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
  }
}

export default DeliveryMan;
