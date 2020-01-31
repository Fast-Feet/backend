require("dotenv").config();
const bcrypt = require("bcryptjs");

const { ADMIN_USER_PASSWORD: password, HASH_SALT } = process.env;

module.exports = {
  up: async queryInterface => {
    const date = new Date();
    const password_hash = await bcrypt.hash(password, Number(HASH_SALT));
    return queryInterface.bulkInsert(
      "users",
      [
        {
          name: "FastFeet Distributor",
          email: "admin@fastfeet.com",
          password_hash,
          created_at: date,
          updated_at: date,
        },
      ],
      {}
    );
  },

  down: () => {},
};
