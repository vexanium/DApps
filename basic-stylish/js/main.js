ScatterJS.plugins( Vexanium() );
const appname = document.title;
const network = ScatterJS.Network.fromJson({
	blockchain: bc('vex'),
	chainId:'f9f432b1851b5c179d2091a96f593aaed50ec7466b74f89301f957a83e56ce1f',
	host:'209.97.162.124',
	port:8080,
	protocol:'http'
});
let account;
let balance = '0.0000 VEX';
let dots = 0;
$('.eye').text('|');
setTimeout(function(){	
	connect();
},3000);
$('#ufo').on('click touch', function(){
	$(this).toggleClass('flying');
	$(this).toggleClass('caught');
});
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
		ScatterJS.connect(appname,{network}).then(connected => {
			if(!connected) {
				$('.tog').addClass('d-none');
				$('#login,#nopen').removeClass('d-none');
				setTimeout(sleepy, 4500);
				return;
			}
			login();
		});
	} catch (e) {
		console.log(e);
	}
}
function login() {
	try{
		ScatterJS.login().then(id => {
			if(!id) return;
			account = id.accounts[0].name;
			$('.tog').addClass('d-none');
			$('#gotin,#logout').removeClass('d-none');
			$('#user').text(account);
			$('#logout').on('click touch', function(){
				logout();
			});
			getinfo(account);
		});
	} catch (e) {
		console.log(e);
	}
}
function getinfo(acc) {
	try {
		const vexnet = VexNet(network);
		vexnet.getAccount({
			account_name: acc
		}).then(info => {
			balance = info.core_liquid_balance?info.core_liquid_balance:balance;
			setTimeout(function(){
				$('#intro').text(acc);
				$('#user').text(balance);
			}, 900);
		});	
	} catch (e) {
		console.log(e);
	}
}
function logout() {
	try {
		ScatterJS.logout();
		sleepy();
	} catch (e) {
		console.log(e);
	}
}