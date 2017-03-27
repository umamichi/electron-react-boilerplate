import C from '../common/constants';
import getIsNight from './getIsNight';
import moment from 'moment';

const Config = window.config;

export default class OscScene {
  constructor(osc, updateLogBox) {
    this.osc = osc;
    this.updateLogBox = updateLogBox;
    this.timeout = null;
  }
  
  /**
   * シーン切り替え開始
   */
  play() {
    // ガイダンス
    const guidance = new Promise((resolve, reject) => {
      this.osc.send(this.createData(C.GUIDANCE.NAME));
      this.timeout = setTimeout(() => {
        resolve();
      }, Config.SCENE_SECOND.GUIDANCE * 1000);
      // }, 1000);
    });
    
    // インタラクティブモード開始
    const interactive = new Promise((resolve, reject) => {
      guidance.then(() => {
        this.osc.send(this.createData(C.INTERACTIVE.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.INTERACTIVE * 1000);
        // }, 1000);
      });
    });
    // インタラクティブモード（地名）
    const interactivePlace = new Promise((resolve, reject) => {
      interactive.then(() => {
        this.osc.send(this.createData(C.INTERACTIVE_PLACE.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.INTERACTIVE_PLACE * 1000);
        // }, 1000);
      });
    });
    // インタラクティブモード（交通網）
    const interactiveTraffic = new Promise((resolve, reject) => {
      interactivePlace.then(() => {
        this.osc.send(this.createData(C.INTERACTIVE_TRAFFIC.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.INTERACTIVE_TRAFFIC * 1000);
        // }, 1000);
      });
    });
    // インタラクティブモード（自然）
    const interactiveNature = new Promise((resolve, reject) => {
      interactiveTraffic.then(() => {
        this.osc.send(this.createData(C.INTERACTIVE_NATURE.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.INTERACTIVE_NATURE * 1000);
        // }, 1000);
      });
    });
    // インタラクティブモードのカウントダウン
    const interactiveCountdown = new Promise((resolve, reject) => {
      interactiveNature.then(() => {
        this.osc.send(this.createData(C.INTERACTIVE_COUNTDOWN.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.INTERACTIVE_COUNTDOWN * 1000);
        // }, 1000);
      });
    });

    // ユニバーサルモードの動画紹介
    const universalIntroduction = new Promise((resolve, reject) => {
      interactiveCountdown.then(() => {
        this.osc.send(this.createData(C.UNIVERSAL_INTRODUCTION.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.UNIVERSAL_INTRODUCTION * 1000);
        // }, 1000);
      });
    });
    // ユニバーサルモード（360度パノラマ）
    const universalPanorama = new Promise((resolve, reject) => {
      universalIntroduction.then(() => {
        this.osc.send(this.createData(C.UNIVERSAL_PANORAMA.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.UNIVERSAL_PANORAMA * 1000);
        // }, 1000);
      });
    });
    // ユニバーサルモード（24時間）
    const universal24hr = new Promise((resolve, reject) => {
      universalPanorama.then(() => {
        this.osc.send(this.createData(C.UNIVERSAL_24HR.NAME));
        this.timeout = setTimeout(() => {
          resolve();
        }, Config.SCENE_SECOND.UNIVERSAL_24HR * 1000);
        // }, 1000);
      });
    });
    // ユニバーサルモード（隅田川花火）
    const universalFw = new Promise((resolve, reject) => {
      universal24hr.then(() => {
        this.osc.send(this.createData(C.UNIVERSAL_FW.NAME));
        this.timeout = setTimeout(() => {
          this.play();
          resolve();
        }, Config.SCENE_SECOND.UNIVERSAL_FW * 1000);
        // }, 1000);
      });
    });
  }
  
  /**
   * OSC送信を停止
   */
  stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
  
  /**
   * OSCのデータ生成
   */
  createData(sceneName, isManual, _isNight) {
    const timeStamp = moment().format('x'); // UNIX Time Stamp(ms)
    
    if (!isManual) { // タイムラインに沿ってOSC送信する場合のみ、画面上のlogを更新する
      this.updateLogBox(C[sceneName].J_NAME, Config.SCENE_SECOND[sceneName]);
    }
    
    // インタラクティブモードはisNightを含む
    if (sceneName === C.INTERACTIVE.NAME) {
      // ボタンを押して送信する場合はisNightを任意の値にできる
      const isNight = isManual ? _isNight : getIsNight();
      return {
        eventName: 'CHANGE_SCENE',
        timeStamp,
        data: {
          sceneName, 
          isNight
        }
      };
    } else if (sceneName === C.INTERACTIVE_COUNTDOWN.NAME) {
      // カウントダウンのとき、秒数を送る
      return {
        eventName: 'CHANGE_SCENE',
        timeStamp,
        data: {
          sceneName, 
          second: window.config.SCENE_SECOND.INTERACTIVE_COUNTDOWN,
          pwSecond: window.config.PW_COUNTDOWN
        }
      };
    }
    return {
      eventName: 'CHANGE_SCENE',
      timeStamp,
      data: {
        sceneName
      }
    };  
  }
}