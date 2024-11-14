import { EndPoints } from '@constants/endPoints/index';
import { PathUtil } from '@utils/path.util';

export class GalleryEndPoint {
  private mainPath: string;

  constructor(mainPath = EndPoints.GALLERY) {
    this.mainPath = mainPath;
  }

  get GET_IMAGE() {
    return PathUtil.createPath(this.mainPath, '/get/image');
  }
  get ADD_IMAGE() {
    return PathUtil.createPath(this.mainPath, '/add/image');
  }
  get DELETE_IMAGE() {
    return PathUtil.createPath(this.mainPath, '/delete/image');
  }
}
