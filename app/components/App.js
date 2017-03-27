import React, { Component } from 'react';
import { render } from 'react-dom';
import Server from '../server/Server';
import Osc from '../server/OSC';
import OscScene from '../server/OscScene';
import styles from './App.css';
import C from '../common/constants';
import moment from 'moment';
import playBgm from '../utils/playBgm';

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.handleQuit = this.handleQuit.bind(this);
    this.handleSendOSC = this.handleSendOSC.bind(this);
    this.playOsc = this.playOsc.bind(this);
    this.stopOsc = this.stopOsc.bind(this);
    this.setIsPlayState = this.setIsPlayState.bind(this);
    this.updateLogBox = this.updateLogBox.bind(this);
    this.calcCountdown = this.calcCountdown.bind(this);
    this.stopFirstWaitTimer = this.stopFirstWaitTimer.bind(this);
    
    this.state = {
      log: {
        text: `初回起動時${window.config.OSC_FIRST_WAIT_SECOND}秒待機中`,
        restSecond: window.config.OSC_FIRST_WAIT_SECOND
      },
      isFirstWaiting: true, // 初回待機中かどうか
      isPlay: false // シーン切り替えタイムラインが再生中かどうか
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    window.log.log('---- electron boot ----');
    
    playBgm(); // BGM 再生
    
    this.server = new Server();
    this.server.start();
    
    this.osc = new Osc(); // osc
    this.oscScene = new OscScene(this.osc, this.updateLogBox); // oscで送るシーン
    
    // タイムライン開始
    this.playOsc(true);
  }

  /**
   * アプリ終了
   */
  handleQuit() {
    window.ipcRenderer.send('app-quit');
  }
  /**
   * リロード
   */
  reload() {
    location.reload();
  }

  /**
   * シーンを切り替える
   */
  playOsc(isFirstTime) {
    // Electron起動後、サイネージ側がデータをロードするのを十分に待ってからシーン切り替え開始
    if (isFirstTime) {
      this.calcCountdown(); // カウントダウン秒数を更新
      console.log(`${window.config.OSC_FIRST_WAIT_SECOND}秒待機開始 --- `);
      this.firstWaitTimer = setTimeout(() => {
        console.log('------ シーン切り替え開始 ------');
        this.oscScene.play();
        this.setIsPlayState();
        this.setState({ isFirstWaiting: false });
      }, window.config.OSC_FIRST_WAIT_SECOND * 1000);
      return;
    }
    
    // 一度停止したのち、再びplayボタンを押した時
    this.oscScene.play();
    this.setIsPlayState();
    this.calcCountdown(); // カウントダウン秒数を更新
  }
  /**
   * OSCを停止する
   */
  stopOsc() {
    this.oscScene.stop();
    this.setIsPlayState();
    clearInterval(this.countdownTimer);
  }
  /**
   * ボタンを押下時、OSC送信
   */
  handleSendOSC(e) {
    let isNight = e.currentTarget.getAttribute('data-is-night');
    let sceneName = e.currentTarget.getAttribute('data-type');
    // send osc
    this.osc.send(this.oscScene.createData(sceneName, true, isNight));
  }
  
  /**
   * OSCが再生状態かどうか
   */
  setIsPlayState() {
    this.setState({
      isPlay: this.oscScene.timeout !== null // Play中かどうか
    });
  }
  /**
   * 現在の状態を更新する
   */
  updateLogBox(text, restSecond) {
    this.setState({
      log: {
        text,
        restSecond
      }
    });
  }
  /**
   * 残り秒数をカウントダウンする
   */
  calcCountdown() {
    this.countdownTimer = setInterval(() => {
      // 残り秒数 0未満にならないようにする
      const restSecond = (this.state.log.restSecond - 1) < 0 ? 0 : this.state.log.restSecond - 1;
      this.setState({
        log: {
          text: this.state.log.text,
          restSecond
        }
      });
    }, 1000);
  }
  
  /**
   * 初回待機を解除する
   */
  stopFirstWaitTimer() {
    clearTimeout(this.firstWaitTimer);
    clearInterval(this.countdownTimer);
    this.setState({
      isFirstWaiting: false
    });
  }
  
  render() {
    return (
      <div className="page">
        <button className={styles.quitButton} onClick={this.handleQuit}>サーバーアプリ終了</button>
        <button className={styles.quitButton} onClick={this.reload}>リロード🔃</button>
        <br />
        
        <h1>タイムライン</h1>
        <div className={styles.logDiv}>
          {this.state.log.text}
          <div className={styles.restSecond}>残り{this.state.log.restSecond}秒</div>
        </div>
        
        {(() => {
          if (this.state.isFirstWaiting) {
            return (
              <div>
                <button className={styles.oscButton} onClick={this.stopFirstWaitTimer}>初回待機 STOP■</button>
              </div>
            );
          }
          if (this.state.isPlay) {
            return (
              <div>
                <button className={styles.oscButton} style={{ 'opacity': 0.5 }}>PLAY▶</button>
                <button className={styles.oscButton} onClick={this.stopOsc}>STOP■</button> 
              </div>
            );
          }
          return (
            <div>
              <button className={styles.oscButton} onClick={this.playOsc.bind(this, false)}>PLAY▶</button>
              <button className={styles.oscButton} style={{ 'opacity': 0.5 }}>STOP■</button> 
            </div>
          );
        })()}
        
        <br /><br />
        
        <h1>シーン切り替え（OSC）モック <br /> PORT: {window.config.OSC_PORT_NUM} </h1>
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.GUIDANCE.NAME} data-is-night="false">
          1. {C.GUIDANCE.J_NAME} {window.config.SCENE_SECOND.GUIDANCE}秒</button>
        <br />
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.INTERACTIVE.NAME} data-is-night="false">
          2. {C.INTERACTIVE.J_NAME}(昼) {window.config.SCENE_SECOND.INTERACTIVE}秒</button>
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.INTERACTIVE.NAME} data-is-night="true">
          2. {C.INTERACTIVE.J_NAME}(夜) {window.config.SCENE_SECOND.INTERACTIVE}秒</button>
        <br />
        <button className={styles.oscButton} style={{ marginLeft: 20, width: '280px' }} onClick={this.handleSendOSC} data-type={C.INTERACTIVE_PLACE.NAME} data-is-night="false">
          2-1. {C.INTERACTIVE_PLACE.J_NAME} {window.config.SCENE_SECOND.INTERACTIVE_PLACE}秒</button>
        <br />
        <button className={styles.oscButton} style={{ marginLeft: 20, width: '280px' }} onClick={this.handleSendOSC} data-type={C.INTERACTIVE_TRAFFIC.NAME} data-is-night="false">
          2-2. {C.INTERACTIVE_TRAFFIC.J_NAME} {window.config.SCENE_SECOND.INTERACTIVE_TRAFFIC}秒</button>
        <br />
        <button className={styles.oscButton} style={{ marginLeft: 20, width: '280px' }} onClick={this.handleSendOSC} data-type={C.INTERACTIVE_NATURE.NAME} data-is-night="false">
          2-3. {C.INTERACTIVE_NATURE.J_NAME} {window.config.SCENE_SECOND.INTERACTIVE_NATURE}秒</button>
        <br />
        <button className={styles.oscButton} style={{ marginLeft: 20, width: '280px' }} onClick={this.handleSendOSC} data-type={C.INTERACTIVE_COUNTDOWN.NAME} data-is-night="false">
          2-4. {C.INTERACTIVE_COUNTDOWN.J_NAME} {window.config.SCENE_SECOND.INTERACTIVE_COUNTDOWN}秒</button>
        <br />
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.UNIVERSAL_INTRODUCTION.NAME} data-is-night="false">
          3. {C.UNIVERSAL_INTRODUCTION.J_NAME} {window.config.SCENE_SECOND.UNIVERSAL_INTRODUCTION}秒</button>
        <br />
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.UNIVERSAL_PANORAMA.NAME} data-is-night="false">
          4-1. {C.UNIVERSAL_PANORAMA.J_NAME} {window.config.SCENE_SECOND.UNIVERSAL_PANORAMA}秒</button>
        <br />
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.UNIVERSAL_24HR.NAME} data-is-night="false">
          4-2. {C.UNIVERSAL_24HR.J_NAME} {window.config.SCENE_SECOND.UNIVERSAL_24HR}秒</button>
        <br />
        <button className={styles.oscButton} onClick={this.handleSendOSC} data-type={C.UNIVERSAL_FW.NAME} data-is-night="false">
          4-3. {C.UNIVERSAL_FW.J_NAME} {window.config.SCENE_SECOND.UNIVERSAL_FW}秒</button>
      </div>
    );
  }
}