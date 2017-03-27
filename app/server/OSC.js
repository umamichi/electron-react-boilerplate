import nodeOsc from 'node-osc';
import _ from 'lodash';
import C from '../common/constants';
import moment from 'moment';

const Config = window.config;
const log = window.log;

export default class Osc {
  /**
   * client（送信先）を定義する
   */
  constructor() {
    this.client = [];
    _.forEach(Config.IP_SIGNAGE, (ip) => { // config.jsonで定義されているIPをセット
      this.client.push(new nodeOsc.Client(ip, Config.OSC_PORT_NUM));
    });
  }
  
  /**
   * OSCを送信する
   * _data {object} 送信するデータ
   */
  send(_data) {
    // OSCではstringしか送れないため、stringifyする
    const data = JSON.stringify(_data, this.booleanReplacer);
    
    console.log('osc send ==============> ', data);
    _.forEach(this.client, (client) => {
      client.send(data);
    });

    log.log(`OSC SEND: ${data}`);
  }
  
  /**
   * JSON.stringifyするときにbooleanがstring型にならないようにする
   * key 'string' オブジェクトのキー
   * value 'string' オブジェクトの値
   */
  booleanReplacer(key, value) { 
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }
}