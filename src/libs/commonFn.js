// ajax 原生封装(初级)
export const ajaxFun = (method, url, dosome) => {
  let xmlhttp
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      return dosome(xmlhttp)
    }
  }
  xmlhttp.open(method, url, true)
  xmlhttp.send()
}
