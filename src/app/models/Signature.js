import Sequelize, { Model } from "sequelize";

class Signature extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      { sequelize }
    );
    console.log("Connected to signatures table");
    return this;
  }
}

export default Signature;
