module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn("deliverymen", "avatar_id");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("deliverymen", "avatar_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
