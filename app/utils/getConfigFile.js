/**
 * config.jsonのファイルを返す
 */
const getConfigFile = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('../config.json');
  }
  return require('../../../../../config.json');
};

module.exports = getConfigFile;