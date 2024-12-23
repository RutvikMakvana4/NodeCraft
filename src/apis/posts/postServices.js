import RegisterResource from "../auth/resources/registerResource";
import User from "./../../../models/users";
import Post from "../../../models/posts";
import Comment from "../../../models/comments";

class postServices {
  /**
   * @description : Create post
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async uploadPost(data, auth, req, res) {
    return await Post.create({
      userId: auth,
      ...data,
    });
  }

  /**
   * @description : Give comment on post
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async giveCommentOnPost(id, data, auth, req, res) {
    return await Comment.create({
      postId: id,
      userId: auth,
      ...data,
    });
  }

  /**
   * @description : Fetch Posts with User Details
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getAllPosts(auth, req, res) {
    const result = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $group: {
          _id: "$userData._id",
          name: { $first: "$userData.name" },
          email: { $first: "$userData.email" },
          postCount: { $sum: 1 },
        },
      },
      {
        $sort: { postCount: -1 },
      },
    ]);

    console.log(result);
  }
}

export default postServices;
