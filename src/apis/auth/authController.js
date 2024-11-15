import authServices from "./authServices";

class authControllers {
  /**
   * @description: Register
   * @param {*} req
   * @param {*} res
   */
  static async register(req, res) {
    const data = await authServices.register(req, res, req.body);
    return res.send({ message: "User registered successfully", data });
  }
}

export default authControllers;
