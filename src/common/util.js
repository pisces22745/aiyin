export default {
  kilo: function (num) {
    let [temp, tempStr, strArray, str] = [[], '', num.toString().split('.'), strArray[0]]
    str = str.split('').reverse()
    for (let i = 0; i < str.length; i++) {
      if ((i + 1) % 3 === 0 && i + 1 !== str.length) {
        temp.push(str[i])
        temp.push(',')
      } else {
        temp.push(str[i])
      }
    }
    tempStr = temp.reverse().join('')
    if (strArray.length > 1) {
      tempStr = tempStr + '.' + strArray[1]
    }
    return tempStr
  }
}
