/**
 * Countdown Timer
 * @author xiaoma<xiaoma@taobao.com>
 */
TB.util.CountdownTimer = new function() {
	
	var Y = YAHOO.util;
	
	var MINUTE = 60;
	var HOUR = MINUTE * 60;
	var DAY = HOUR*24;	
	
	var defConfig = {
		formatStyle: 'short', /* 'long' ： x天x小时x分x秒  or 'short' ：[x天x小时 | x小时x分 | x分x秒]  or custom */
		formatPattern: '',  /* for formatStyle == custom */
		hideZero: true, /* for formatStyle == 'long' : if day==0 then show x小时x分x秒，etc. */
		timeoutText: 'timeoutText',
		updatable: true
	};
	
	var leadingZero = function(n) {
		return ((n < 10) ? "0" : "") + n;
	}
	
	var genTimeFilter = function(lt) {
		return function(val, key) {
			switch(key) {
				case 'd': 
					return parseInt(lt / DAY);
				case 'dd':
					return leadingZero(parseInt(lt / DAY));
				case 'hh':
					return leadingZero(parseInt(lt % DAY / HOUR));
				case 'h':
					return parseInt(lt % DAY / HOUR);
				case 'mm':
					return leadingZero(parseInt(lt % DAY % HOUR / MINUTE));
				case 'm':
					return parseInt(lt % DAY % HOUR / MINUTE);
				case 'ss':
					return leadingZero(parseInt(lt % DAY % HOUR % MINUTE));
				case 's':
					return parseInt(lt % DAY % HOUR % MINUTE);				
			}
		}
	}
	
	this.attach = function(container, leftTime, config) {
		container = $(container);
		leftTime = parseInt(leftTime);
		config = TB.applyIf(config||{}, defConfig);
		var handle = {};
				
		var onStartEvent = new Y.CustomEvent("onStart", null, false, Y.CustomEvent.FLAT);
		if (config.onStart) {
			onStartEvent.subscribe(config.onStart);
		}
		var onEndEvent = new Y.CustomEvent("onEnd", null, false, Y.CustomEvent.FLAT);
		if (config.onEnd) {
			onEndEvent.subscribe(config.onEnd);
		}
		
		var currTime = parseInt(new Date().getTime()/1000);
		var endTime = currTime + leftTime;

		var updateTimer = function() {
			handle.update();			
		}
				
		handle.update = function() {
			var pattern = config.formatPattern, values = {}, nu = 1;
			if (config.formatStyle == 'long') {
				pattern = '{d}' + $M('day') + '{hh}' + $M('hour') + '{mm}' + $M('minute') + '{ss}' + $M('second');
			}			
			var lt = endTime - parseInt(new Date().getTime()/1000);
			if (lt <= 0) {
				container.innerHTML = $M(config.timeoutText);
				onEndEvent.fire();
				return;				
			}
			else if (lt > DAY) {
				if (config.formatStyle == 'short') {
					pattern = '{d}' + $M('day') + '{hh}' + $M('hour');
					nu = Math.floor(lt % DAY % HOUR) || HOUR;
				}
			}
			else if (lt > HOUR) {
				if (config.formatStyle == 'short') {
					pattern = '{hh}' + $M('hour') + '{mm}' + $M('minute');
					nu = Math.floor(lt % HOUR % MINUTE) || MINUTE;
				} else if (config.formatStyle == 'long' && config.hideZero) {
					pattern = '{hh}' + $M('hour') + '{mm}' + $M('minute') + '{ss}' + $M('second');
				}
			}
			else if (lt > 0) {
				if (config.formatStyle == 'short' || (config.formatStyle == 'long' && config.hideZero)) {
					pattern = '{mm}' + $M('minute') + '{ss}' + $M('second');
				}
			}
			
			container.innerHTML = TB.common.formatMessage(pattern, values, genTimeFilter(lt)); 
			if (config.updatable && nu > 0)
				setTimeout(updateTimer, nu*1000);
		}
		
		handle.init = function() {
			this.update();
			onStartEvent.fire();
		}
				
		handle.init();
		return handle;
	}
}