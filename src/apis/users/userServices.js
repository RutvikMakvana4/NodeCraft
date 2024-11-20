import RegisterResource from "../auth/resources/registerResource";
import User from "./../../../models/users";

class userServices {
  /**
   * @description : User profile
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async profileDetails(auth, req, res) {
    const findUser = await User.findOne({ _id: auth });
    return { ...new RegisterResource(findUser) };
  }

  /**
   * @description : User listing
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async userList(auth, req, res) {
    const findUsers = await User.find({ _id: auth });
    return findUsers;
  }
}

export default userServices;
