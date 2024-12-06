import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class RegisterResource {
  constructor(data) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.profilePicture =
      data.profilePicture !== null ? baseUrl(data.profilePicture) : null;
    this.joinedAt = moment(data.joinedAt).unix();
  }
}
