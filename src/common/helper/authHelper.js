import { PASSWORD } from "../constants/constants";
import bcrypt from "bcrypt";

class authHelper {
  /**
   * @description: Hash password
   * @param {*} password
   * @returns
   */
  static async hashPassword(password) {
    try {
      const saltRounds = PASSWORD.SALT;

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Failed to hash password");
    }
  }
}

export default authHelper;
