// ==UserScript==
// @name          CookieClicker Target Countdown
// @version       1.0.2
// @namespace     http://www.clarkrasmussen.com/
// @description   Enter a target amount of banked cookies and see the amount of time it will take to reach that amount at your current CPS
// @include       http://orteil.dashnet.org/cookieclicker/*
//
// ==/UserScript==

const VERSION = "1.0.2";

window.addEventListener('load', function() {
	exec(function () {
		// write out our elements
		var output_div = document.createElement('div');
		output_div.setAttribute('id', 'cookieclicker_countdown_container');
		output_div.setAttribute('style', 'position: fixed; right: 30px; bottom: 20px; margin: 0; padding: 7px 15px; border: 1px solid #999; background-color: #ccc; color: #000;');

		var countdown_target_label = document.createElement('label');
		countdown_target_label.setAttribute('style', 'display: block; padding-bottom: .25em; font-size: 80%; font-weight: bold;');
		countdown_target_label.setAttribute('for', 'countdown_target_input');
		countdown_target_label.innerHTML = 'Target Cookie Value:';

		var countdown_target_input = document.createElement('input');
		countdown_target_input.setAttribute('style', 'display: block; font-size: 90%;');
		countdown_target_input.setAttribute('id', 'countdown_target_input');
		countdown_target_input.setAttribute('value', '0');

		var output_content = document.createElement('p');
		output_content.setAttribute('style', 'padding-top: .5em; text-align: center;');
		output_content.innerHTML = '00:00';

		output_div.appendChild(countdown_target_label);
		output_div.appendChild(countdown_target_input);
		output_div.appendChild(output_content);
		document.body.appendChild(output_div);

		// do the check every second
		setInterval(function () {
			countdown_check();
		}, 1000);

		function calculate_countdown (countdown_target) {
			var cookies = Game.cookies;
			var cookiesps = Game.cookiesPs;
			var seconds = 0;
			var time = '';

			if (countdown_target > cookies) {
				if (cookiesps > 0) seconds = Math.round((countdown_target - cookies) / cookiesps);

				var days = Math.floor(seconds / 86400);
				var hours = Math.floor((seconds % 86400) / 3600);
				var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
				seconds = ((seconds % 86400) % 3600) % 60;

				time = format_time(days, hours, minutes, seconds);
			} else {
				time = '00:00';
			}

			return time;
		}

		function countdown_check () {
			var countdown_target = parseInt(document.getElementById('countdown_target_input').value);

			if (countdown_target > 0) {
				var time = calculate_countdown(countdown_target);
				output_content.innerHTML = time;
			}
		}

		function format_time (days, hours, minutes, seconds) {
			var time = '';

      			if (days > 0) {
      				time = days + ':';

      				if (hours > 0) {
      					time += zero_pad(hours, 2);
      				} else {
      				 	time += '00';
      				}

      				time += ':';
      			} else if (hours > 0) {
      				time += hours + ':';
      			}

      			return (time + zero_pad(minutes, 2) + ':' + zero_pad(seconds, 2));
		}

		function zero_pad (num, length) {
			var s = num + '';
			while (s.length < length) s = '0' + s;
			return s;
		}

	});
});

function exec (fn) {
	var script = document.createElement('script');
	script.setAttribute('type', 'application/javascript');
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	document.body.removeChild(script);
}