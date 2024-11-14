import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class LanguageEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.LANGUAGE) {
    this.mainPath = mainPath;
  }

  get GET() {
    return PathUtil.createPath(this.mainPath, '/get');
  }
  get GET_DEFAULT() {
    return PathUtil.createPath(this.mainPath, '/get/default');
  }
  get GET_WITH_ID() {
    return PathUtil.createPath(this.mainPath, `/get/:_id`);
  }
  get GET_FLAGS() {
    return PathUtil.createPath(this.mainPath, '/get/flags');
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
}
