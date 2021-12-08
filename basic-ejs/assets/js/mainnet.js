

ScatterJS.plugins( Vexanium() );

let details = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(details);
let fromDappBrowser ='';

if (isMobileDevice) {
	console.log("Mobile Device");
	  fromDappBrowser = navigator.userAgent=='VexWalletAndroid (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012)';
} else {
	console.log(" Desktop");
	  fromDappBrowser = navigator.userAgent=='VexWalletAndroid';
}

const appname = document.title;
const network = ScatterJS.Network.fromJson({
	blockchain: bc('vex'),
	chainId:'f9f432b1851b5c179d2091a96f593aaed50ec7466b74f89301f957a83e56ce1f',
	host:'explorer.vexanium.com',
	port:6960,
	protocol:'https',
});
let account;
let max_supply = '0.0000';
let symbol;
let balance = '0.0000 VEX';
let used_cpu = '0'
let available_cpu = '0'
let max_cpu = '0'
let used_net = '0'
let available_net = '0'
let max_net = '0'
let ram_quota = '0'
let ram_usage = '0'
setTimeout(function(){	
	connect();
},3000);
$('#login').on('click touch', function(){
	connect();
});
function zero() {
	balance = '0.0000 VEX';
	$('#dots').text('.');
	dots = 0;
}
function loading() {
	if(dots < 6) {
		$('#dots').append('.');
		dots++;
	}
}
function sleepy() {
	$('.tog').addClass('d-none');
	$('#login,#eyes').removeClass('d-none');
	$('#login').prop('disabled', false);
	$('.eye').text('X');
	$('#intro').text('Welcome');
}
function connect() {
	$('.tog').addClass('d-none');
	$('#dots,#login').removeClass('d-none');
	$('#login').prop('disabled', true);
	zero();
	setInterval(loading, 900);
	try{
		if(!fromDappBrowser){
			alert("start login !!!")
			ScatterJS.connect(appname,{network}).then(connected => {
				if(!connected) {
					notConnected();
					return;
				}
				login();
			});
		} else {
			pe.getWalletWithAccount().then((res)=>{
				if(!res) {
					notConnected();
					return;
				}
				account = res.data.account;
				onConnected();
			});	
		}
	} catch (e) {
		console.log(e);
	}
}
function notConnected(){
	$('.tog').addClass('d-none');
	$('#login,#nopen').removeClass('d-none');
	setTimeout(sleepy, 4500);
}
function onConnected(){
    alert("welcome"+" "+account)
	$('.tog').addClass('d-none');
	$('#gotin,#logout').removeClass('d-none');
	$('#user').text(account);
	$('#logout').on('click touch', function(){
		logout();
	});
	getinfo(account);
}
function login() {
	try{
		ScatterJS.login().then(id => {
			if(!id) return;
			account = id.accounts[0].name;
			onConnected();
		});
	} catch (e) {
		console.log(e);
	}
}
function getinfo() {
	try {
		const vexnet = VexNet(network);
		vexnet.getAccount(account).then(info => {
			net = info.self_delegated_bandwidth.net_weight?info.self_delegated_bandwidth.net_weight:net;
			used_cpu = info.cpu_limit.used;
			available_cpu = info.cpu_limit.available;
			max_cpu = info.cpu_limit.max;
			used_net = info.net_limit.used;
			available_net = info.net_limit.available;
			max_net = info.net_limit.max;
			ram_quota = info.ram_quota;
			ram_usage = info.ram_usage;
			balance = info.core_liquid_balance?info.core_liquid_balance:balance;
			setTimeout(function(){
				$('#intro').text(account);
				$('#user').text(balance);
				$('#ucpu').text(used_cpu);
				$('#avcpu').text(available_cpu);
				$('#maxcpu').text(max_cpu);
				$('#usednet').text(used_net);
				$('#avnet').text(available_net);
				$('#maxnet').text(max_net);
				$('#ramquota').text(ram_quota);
				$('#ramusage').text(ram_usage);
			}, 900);
		});	
	} catch (e) {
		console.log(e);
	}
}
function logout() {
	try {
		if(!fromDappBrowser) ScatterJS.logout();
		sleepy();
	} catch (e) {
		console.log(e);
	}
}
