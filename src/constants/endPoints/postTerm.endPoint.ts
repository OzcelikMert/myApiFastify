import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class PostTermEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.POST_TERM) {
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
  get UPDATE_RANK_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/update/rank/:_id`);
  }
  get UPDATE_VIEW_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/update/view/:_id`);
  }
  get UPDATE_STATUS() {
    return PathUtil.createPath(this.mainPath, '/update/status');
  }
  get DELETE() {
    return PathUtil.createPath(this.mainPath, '/delete');
  }
}
