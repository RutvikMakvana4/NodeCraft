import userServices from "./userServices";

class userControllers {
  /**
   * @description: user profile
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async profileDetails(req, res) {
    const data = await userServices.profileDetails(req.user, req, res);
    return res.send({ data });
  }

  /**
   * @description: user profile
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async userList(req, res) {
    const data = await userServices.userList(req.user, req, res);
    return res.send({ data });
  }
}

export default userControllers;
