window.pushActionResult = pushActionResult;
window.getWalletWithAccount = getWalletWithAccount;
var fromDappBrowser = navigator.appName.match(/Android/i);
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
let alertTxt = 'nav: ' + jsonToStr(navigator.appCodeName);
function jsonToStr(obj,circular=false){
	return circular?JSON.stringify(obj, getCircularReplacer):JSON.stringify(obj, null, 4);
}
function pushActionResult(k,v){ alertTxt += '\npar: ' + jsonToStr(v); }
function getWalletWithAccount(detail){ alertTxt += '\ngwa: ' + jsonToStr(detail);  }