import User from "../../../models/users";
import { ConflictException } from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";
import RegisterResource from "./resources/registerResource";

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
}

export default authServices;
