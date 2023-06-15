import { TOKEN_TIME, TOKEN_TIME_VALUE } from './constant'

// 登录时设置时间
export const setTokenTime = () => {
  localStorage.setItem(TOKEN_TIME, Date.now())
}

// 获取
export const getTokenTime = () => {
  return localStorage.getItem(TOKEN_TIME)
}

// 是否已经过期
export const diffTokenTime = () => {
  const currentTime = Date.now()
  const tokenTime = getTokenTime()
  return currentTime - tokenTime > TOKEN_TIME_VALUE
}
export const getymd = (dateStr) => {
  let d = new Date(dateStr),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

 return [year, month, day].join('-');
}
export const getymdhms = (dateStr)=>{
  let d = new Date(dateStr),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear(),
  hour = ''+d.getHours(),
  minute = '' + d.getMinutes(),
  second = ''+d.getSeconds()
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hour.length < 2) hour = '0' + hour;
  if (minute.length < 2) minute = '0' + minute;
  if (second.length < 2) second = '0' + second;
  return [year, month, day].join('-') + ' '+[hour,minute,second].join(':');
}

export const dispatchEventStorage = () => {
  const signSetItem = localStorage.setItem
  localStorage.setItem = function(key, val) {
      let setEvent = new Event('setItemEvent')
      setEvent.key = key
      setEvent.newValue = val
      window.dispatchEvent(setEvent)
      signSetItem.apply(this, arguments)
  }
}
export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file.raw);
    reader.onload = (ev) => {
      resolve(ev.target.result)
    }
  })
}