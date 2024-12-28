import User from "../models/users";
import "../src/common/config/dbConnection";

module.exports = {
  async up(db, client) {
    await User.updateMany({}, { $set: { isMigrate: false } });
  },

  async down(db, client) {
    await User.updateMany({}, { $unset: { isMigrate: "" } });
  },
};
