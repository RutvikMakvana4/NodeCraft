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
   *
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async getAllPosts(auth, req, res) {
    // const result = await Post.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "author",
    //     },
    //   },
    //   {
    //     $unwind: "$author",
    //   },
    //   {
    //     $project: {
    //       title: 1,
    //       content: 1,
    //       "author.name": 1,
    //       "author.email": 1,
    //     },
    //   },
    // ]);

    const result = await Post.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPosts: {
            $count: {},
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
    ]);
    console.log(result);
  }
}

export default postServices;
