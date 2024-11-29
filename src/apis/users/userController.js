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
    const { data, meta } = await userServices.userList(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data, meta: meta });
  }
}

export default userControllers;
