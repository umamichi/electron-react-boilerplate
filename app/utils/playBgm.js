import getAssetsPath from './getAssetsPath';
/**
 * Bgmを再生する
 */
const playBgm = () => {
  const $audio = document.createElement('audio');
  $audio.src = getAssetsPath() + '/sounds/bgm_sound.mp3';
  $audio.autoplay = 1;
  $audio.loop = 1;
  document.getElementById('body').appendChild($audio);
};

export default playBgm;