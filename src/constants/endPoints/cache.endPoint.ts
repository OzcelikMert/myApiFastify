import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class CacheEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.CACHE) {
    this.mainPath = mainPath;
  }

  get DELETE_ALL() {
    return PathUtil.createPath(this.mainPath, '/delete/all');
  }
}
