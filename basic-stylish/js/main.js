ScatterJS.plugins( Vexanium() );
const network = ScatterJS.Network.fromJson({
	blockchain: bc('vex'),
	chainId:'f9f432b1851b5c179d2091a96f593aaed50ec7466b74f89301f957a83e56ce1f',
	host:'209.97.162.124',
	port:8080,
	protocol:'http'
});
let gotin = false;
let dots = 0;
$('.eye').text('|');
setTimeout(function(){
	login();
},3000);
$('#login').on('click touch', function(){
	login();
});
function zero() {
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
	$('#intro').text('Welcome');
}
function login() {
	$('.tog').addClass('d-none');
	$('#dots,#login').removeClass('d-none');
	$('#login').prop('disabled', true);
	$('.eye').text('X');
	zero();
	setInterval(loading, 900);
	try{
		ScatterJS.connect('Basic DApp (Stylish)',{network}).then(connected => {
			if(!connected) {
				gotin = false;
				$('.tog').addClass('d-none');
				$('#login,#nopen').removeClass('d-none');
				setTimeout(sleepy, 4500);
				return;
			}
			ScatterJS.login().then(id => {
				if(!id) return;
				gotin = true;
				const account = id.accounts[0].name;
				let balance = '0.0000 VEX';
				$('.tog').addClass('d-none');
				$('#gotin,#logout').removeClass('d-none');
				$('#user').text(account);
				$('#logout').on('click touch', function(){
					logout();
				});
				const vexnet = ScatterJS.eos(network, Eos);
				//console.log(vexnet);
				vexnet.getAccount({
					account_name: account
				}).then(info => {
					//console.log(info);
					balance = info.core_liquid_balance?info.core_liquid_balance:balance;
					setTimeout(function(){
						$('#intro').text(account);
						$('#user').text(balance);
					}, 900);
				});
			});
			if (gotin) {
				$('.tog').addClass('d-none');
				$('#gotin,#logout').removeClass('d-none');
			}
		});
	} catch (e) {
		console.log(e);
	}
}
function logout() {
	try {
		ScatterJS.logout();
		gotin = false;
		sleepy();
	} catch (e) {
		console.log(e);
	}
}