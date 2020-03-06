export function addClass (el, className) {
  if (hasClass(el, className)) {
    return false
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  // 用正则校验是否含有某个classname
  let reg = new RegExp('(^|\\s)' + className + '(//s|$)')
  return reg.test(el.className)
}

// 设置/获取data-name的值
export function getData (el, name, val) {
  let prefix = 'data-'
  prefix = prefix + name

  if (val) {
    return el.setAttribute(prefix, val)
  }
  return el.getAttribute(prefix)
}

// 设置css3前缀
let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    o: 'oTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()
export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }

  // console.log(elementStyle)
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}