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
  static async userList(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    const findUsers = await User.find({});

    const meta = {
      total: findUsers.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(findUsers.length / pageLimit),
    };
    return {
      data: findUsers,
      meta: meta,
    };
  }
}

export default userServices;
