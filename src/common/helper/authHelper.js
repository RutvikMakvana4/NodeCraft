import { JWT, PASSWORD } from "../constants/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "../../../models/refreshToken";

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

  /**
   * @description: Compare function
   * @param {*} plainPassword
   * @param {*} hashedPassword
   * @returns
   */
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error("Failed to compare passwords");
    }
  }

  /**
   * @description: Generate Access Token
   * @param {*} payload
   */
  static async generateAccessToken(payload) {
    return jwt.sign(payload, JWT.ACCESS_TOKEN_SECRET, {
      expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * @description: Generate Refresh Token
   * @param {*} payload
   */
  static async generateRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, JWT.REFRESH_TOKEN_SECRET, {
      expiresIn: JWT.REFRESH_TOKEN_EXPIRES_IN,
    });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: payload.userId,
      token: refreshToken,
      expiresAt,
    });
    return refreshToken;
  }

  /**
   * @description: Verify Access Token
   * @param {*} token
   */
  static async verifyAccessToken(token) {
    return jwt.verify(token, JWT.ACCESS_TOKEN_SECRET);
  }

  /**
   * @description: Verify Refresh Token
   * @param {*} token
   */
  static async verifyRefreshToken(token) {
    return jwt.verify(token, JWT.REFRESH_TOKEN_SECRET);
  }
}

export default authHelper;
