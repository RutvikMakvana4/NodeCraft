import User from "../../../models/users";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";
import RegisterResource from "./resources/registerResource";
import RefreshToken from "./../../../models/refreshToken";
import { JWT } from "../../common/constants/constants";

class authServices {
  /**
   * @description: Register
   * @param {*} req
   * @param {*} res
   */
  static async register(req, res, data) {
    let { name, email, password } = data;

    email = email.toLowerCase();

    const alreadyEmail = await User.findOne({ email });

    if (alreadyEmail) {
      throw new ConflictException(
        "This email id is already in use | please try different Email Id"
      );
    }

    const hashedPassword = await authHelper.hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      joinedAt: new Date(),
    });

    return { ...new RegisterResource(newUser) };
  }

  /**
   * @description: Register with image
   * @param {*} req
   * @param {*} res
   */
  static async registerWithImage(data, file, req, res) {
    let { name, email, password } = data;
    email = email.toLowerCase();
    const alreadyEmail = await User.findOne({ email });
    if (alreadyEmail) {
      throw new ConflictException(
        "This email id is already in use | please try different Email Id"
      );
    }
    const hashedPassword = await authHelper.hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture: file ? `users/profilePicture/${file.filename}` : null,
      joinedAt: new Date(),
    });
    return { ...new RegisterResource(newUser) };
  }

  /**
   * @description: Login
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async login(data, req, res) {
    const { email, password } = data;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      throw new BadRequestException("Account does not exist.");
    }

    const isPasswordValid = await authHelper.comparePassword(
      password,
      userExist.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password");
    }

    const accessToken = await authHelper.generateAccessToken({
      userId: userExist._id,
    });

    const refreshToken = await authHelper.generateRefreshToken({
      userId: userExist._id,
    });

    return { accessToken, refreshToken };
  }

  /**
   * @description: Refresh token
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async refreshToken(data, req, res) {
    const { refreshToken } = data;

    const payload = await authHelper.verifyRefreshToken(refreshToken);

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.isRevoked) {
      throw new ForbiddenException("Refresh token is invalid or revoked");
    }

    const newAccessToken = await authHelper.generateAccessToken(payload.userId);

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * @description: logout
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async logout(data, req, res) {
    const { refreshToken } = data;

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      throw new NotFoundException("Token not found");
    }

    storedToken.isRevoked = true;
    await storedToken.save();
    return;
  }
}

export default authServices;
