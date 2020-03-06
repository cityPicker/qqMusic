// 得到min和max之间的任意数，包含min和max
function getRandomInt (min, max) {
  return Math.floor(Math.random(0, 1) * (max - min + 1) + 1)
}
export function shuffle (arr) {
  // 拷贝原数组 let _arr = [].concat(arr)
  let _arr = arr.slice(0)
  for (let i = 0; i < _arr.length; i++) {
    const element = _arr[i]
    const j = getRandomInt(0, i)
    _arr[i] = _arr[j]
    _arr[j] = element
  }

  return _arr
}