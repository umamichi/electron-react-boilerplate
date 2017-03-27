import moment from 'moment';

const personalPath = process.env.NODE_ENV === 'development' ? '../../assets/config/json/Personal.json' : '../../../../../../skytree-assets/config/json/Personal.json'; 
const Personal = require('../../assets/config/json/Personal.json');

const sunsetTimes = Personal.data.sunsets.sunset;

/**
 * 今日の日没時間を取得する
 */
const getSunsetTime = () => {
  let todaySunsetTime; // 今日の日没時刻
  
  // 今日の月と日を取得
  const today = {
    month: moment().month(),
    date: moment().date()
  };
  
  // 日没時刻一覧から今日の日没時刻を調べる
  _.forEach(sunsetTimes, (month) => {
    if (parseInt(month.month, 10) === today.month) { // 月を探す
      _.forEach(month.date, (date) => {
        if (parseInt(date.date, 10) === today.date) { // 日を探す
          todaySunsetTime = date.time;
        }
      });
    }
  });
  
  return todaySunsetTime;
};

/**
 * 日没時刻を経過したかどうか調べる
 */
export default () => {
  const nowTime = moment().format('HHmm');

  const todaySunsetTime = getSunsetTime();
  
  return todaySunsetTime <= nowTime;
};

