/**
 * need tbra.js
 */

TB.widget.UglyTab4Table = new function() {
	var Y = YAHOO.util;
	var handle = {};
	var defConfig = {
		tabClass : 'utt',
		panelClass : 'utp',
		onRestore: function(){},
		onSelect: function(){}
	};
	this.init = function(config) {
		config = TB.applyIf(config || {}, defConfig);
		var tabs = Y.Dom.getElementsByClassName(config.tabClass, 'td', config.container);
		var panels = Y.Dom.getElementsByClassName(config.panelClass, 'table', config.container);
		panels.forEach(function(o, i) {
			o.style.display = 'none';
		});
		var switchTab = function(tab, idx) {
			tabs.forEach(function(o, i) {
				Y.Dom.get(o.getAttribute('rel')).style.display = 'none';
				config.onRestore.apply(null, [o, i]);
			});
			Y.Dom.get(tab.getAttribute('rel')).style.display = '';
			config.onSelect.apply(null, [tab, idx]);
		}

		for (var i = 0; i < tabs.length; i++) {
			Y.Event.on(tabs[i], 'click', function(ev, args) {
				switchTab(args[0], args[1]);											
			},[tabs[i],i]);
		}
		switchTab(tabs[0], 0);
	}
}

