import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class ViewEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.VIEW) {
    this.mainPath = mainPath;
  }

  get GET_NUMBER() {
    return PathUtil.createPath(this.mainPath, '/get/number');
  }
  get GET_STATISTICS() {
    return PathUtil.createPath(this.mainPath, '/get/statistics');
  }
  get WEBSOCKET_VISITOR_COUNT() {
    return PathUtil.createPath(this.mainPath, '/ws/visitor-count');
  }
  get WEBSOCKET_ONLINE_USERS() {
    return PathUtil.createPath(this.mainPath, '/ws/online-users');
  }
}
