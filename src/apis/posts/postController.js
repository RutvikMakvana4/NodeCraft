import postServices from "./postServices";

class postControllers {
  /**
   * @description: Create post
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async uploadPost(req, res) {
    const data = await postServices.uploadPost(req.body, req.user, req, res);
    return res.send({ data });
  }

  /**
   * @description: Give comment on post
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async giveCommentOnPost(req, res) {
    const data = await postServices.giveCommentOnPost(
      req.params.id,
      req.body,
      req.user,
      req,
      res
    );
    return res.send({ data });
  }

  /**
   * @description: Give comment on post
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async getAllPosts(req, res) {
    const data = await postServices.getAllPosts(req.user, req, res);
    return res.send({ data });
  }
}

export default postControllers;
