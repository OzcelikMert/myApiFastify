import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class UserEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.USER) {
    this.mainPath = mainPath;
  }

  get GET() {
    return PathUtil.createPath(this.mainPath, '/get');
  }
  get GET_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/get/:_id`);
  }
  get GET_WITH_URL() {
    return PathUtil.createPath(this.mainPath, `/get/url/:url`);
  }
  get ADD() {
    return PathUtil.createPath(this.mainPath, '/add');
  }
  get UPDATE_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/update/:_id`);
  }
  get UPDATE_PROFILE() {
    return PathUtil.createPath(this.mainPath, '/update/profile');
  }
  get UPDATE_PROFILE_IMAGE() {
    return PathUtil.createPath(this.mainPath, '/update/profile/image');
  }
  get UPDATE_PASSWORD() {
    return PathUtil.createPath(this.mainPath, '/update/password');
  }
  get DELETE() {
    return PathUtil.createPath(this.mainPath, '/delete');
  }
  get DELETE_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/delete/:_id`);
  }
}
