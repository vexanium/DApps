var fromDappBrowser = navigator.userAgent=='VexWalletAndroid';
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
let alertTxt = 'nav: ' + jsonToStr(navigator.userAgent);
function jsonToStr(obj,circular=false){
	return circular?JSON.stringify(obj, getCircularReplacer):JSON.stringify(obj, null, 3);
}