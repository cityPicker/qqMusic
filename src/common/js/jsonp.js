import originJsonp from 'jsonp'

// 将请求改写成Promise
export default function jsonp (url, data, option) {
  return new Promise((resolve, reject) => {
    url += (url.indexOf('?') < 0 ? '?' : '') + param(data)

    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 方法：拼接url
export function param (data) {
  let url = ''

  for (const key in data) {
    // if (data.hasOwnProperty(key)) {
    //   const value = data[key]
    //   url += '&' + key + '=' + encodeURIComponent(value)
    // }
    let value = key !== 'undefined' ? data[key] : ''
    url += '&' + key + '=' + encodeURIComponent(value)
  }

  return url ? url.substring(1) : ''
}