import * as path from 'path';

const getRootPath = () => {
  return path.resolve('./', 'src');
};

const getUploadPaths = () => {
  const uploadsPath = path.resolve(getRootPath(), 'uploads');
  return {
    get Images() {
      return path.resolve(uploadsPath, 'images');
    },
    get Flags() {
      return path.resolve(uploadsPath, 'flags');
    },
    get Video() {
      return path.resolve(uploadsPath, 'video');
    },
    get Static() {
      return path.resolve(uploadsPath, 'static');
    },
  };
};

const createPath = (...paths: (number | string | undefined)[]) => {
  let returnPath = '';
  for (let path of paths) {
    if (path) {
      if (typeof path === 'string' && path.length > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }

      returnPath += `/${path.toString()}`;
    }
  }
  return returnPath;
};

export const PathUtil = {
  createPath: createPath,
  getRootPath,
  getUploadPaths
};
