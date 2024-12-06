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

  /**
   * @description: Register with image
   * @param {*} req
   * @param {*} res
   */
  static async registerWithImage(req, res) {
    const data = await authServices.registerWithImage(
      req.body,
      req.file,
      req,
      res
    );
    return res.send({ message: "User registered successfully", data });
  }

  /**
   * @description: Login
   * @param {*} req
   * @param {*} res
   */
  static async login(req, res) {
    const data = await authServices.login(req.body, req, res);
    return res.send({ message: "User Login successfully", data });
  }

  /**
   * @description: Refresh token
   * @param {*} req
   * @param {*} res
   */
  static async refreshToken(req, res) {
    const data = await authServices.refreshToken(req.body, req, res);
    return res.send({ data });
  }

  /**
   * @description: Logout
   * @param {*} req
   * @param {*} res
   */
  static async logout(req, res) {
    await authServices.logout(req.body, req, res);
    return res.send({ message: "Logged out successfully" });
  }
}

export default authControllers;
