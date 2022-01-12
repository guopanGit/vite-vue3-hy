/**
 * 数字前面自动补齐0
 */
export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间格式化函数
 * @date 传入日期对象
 * @dateTime 日期类型(日期/日期+时间)
 */
export default function formatTime(date, dateTime, divide) {
  date = new Date(date)
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  // 分隔符
  if (!divide) {
    divide = '-'
  }

  // 日期 + 时间
  if (dateTime === 5) {
    return [year, month, day].map(formatNumber).join(divide) + ' ' + [hour, minute].map(formatNumber).join(':');
  } else if (dateTime === 4) {
    return [minute, second].map(formatNumber).join(':');
  } else if(dateTime === 3){
    return [month, day].map(formatNumber).join(divide);
  } else {
    return [year, month, day].map(formatNumber).join(divide);
  }
}