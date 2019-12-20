# DApp Basic (Stylish)
Basic Scatter integrated DApp development using **CSS3, Bootstrap, JQuery**.

1. Include the Core Javascripts
Include them inside the ```head``` tag
```html
<html>
<head>
	...
	<script src="js/vex.min.js" type="text/javascript"></script>
	<script src="js/scatterjs-core.min.js" type="text/javascript"></script>
	<script src="js/scatterjs-plugin-vexjs.min.js" type="text/javascript"></script>
</head>
<body>
	...
</body>
</html>
```  
Next, you're gonna write javascripts inside the ```body``` tag

2. Call the Vexanium Plugin    
```js
ScatterJS.plugins( Vexanium() );
```  

3. Setup the Mainnet  
```js
var network = ScatterJS.Network.fromJson({
	blockchain: bc('vex'),
	chainId:'f9f432b1851b5c179d2091a96f593aaed50ec7466b74f89301f957a83e56ce1f',
	host:'209.97.162.124',
	port:8080,
	protocol:'http'
});
```

3. Connect to Wallet    
```js
ScatterJS.connect('Basic DApp (Simple)',{network}).then(connected => {
	if(!connected) {
		alert('Please Open Your VexWallet');
		return;
	}
});
```  

5. Login and get the Wallet Name    
```js
ScatterJS.login().then(id => {
	if(!id) return;
	usrTxt.innerHTML = id.accounts[0].name;
});
```

6. Connect to Mainnet and get the Wallet Balance    
```js
const vexnet = VexNet(network);
vexnet.getAccount({
	account_name: account
}).then(info => {
	balance = info.core_liquid_balance?info.core_liquid_balance:balance;
});
```

Done. Those are the basic codes, you can check the complete scripts inside [index.html](index.html)
