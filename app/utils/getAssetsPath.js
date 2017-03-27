/**
 * 素材ファイルのパスを返す
 */
const getAssetsPath = () => {
  if (process.env.NODE_ENV === 'development') {
    return '../assets';
  }
  return '../../../../../skytree-assets';
};

module.exports = getAssetsPath;