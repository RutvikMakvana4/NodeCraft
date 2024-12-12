import { baseUrl } from "../../../common/constants/configConstants";
import moment from "moment";

export default class UserListResource {
  constructor(data) {
    return data.map((data) => ({
      _id: data._id,
      name: data.name,
      email: data.email,
      profilePicture:
        data.profilePicture != null ? baseUrl(data.profilePicture) : null,
      joinedAt: moment(data.joinedAt).unix(),
    }));
  }
}
