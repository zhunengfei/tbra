/* 简单Tab切换 */
TB.widget.SimpleTab = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		eventType: 'click',
		currentClass: 'Current',  /* li 当前选中状态时的className */
		tabClass: '',  /* 作为 tab 的element的 className */
		autoSwitchToFirst: true,  /* 是否默认选中第一个tab */
		stopEvent: true,  /* 停止事件传播 */
		delay: 0.2  /* available when eventType=mouse */
	};
	var getImmediateDescendants = function(p) {
		var ret = [];
		if (!p) return ret;
		for (var i = 0, c = p.childNodes; i < c.length; i++) {
			if (c[i].nodeType == 1)
				ret[ret.length] = c[i];
		}
		return ret;	
	};
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */		
		var handle = {};
	
		var tabPanels = getImmediateDescendants(container);
		var tab = tabPanels.shift(0);
		var tabTriggerBoxs  = tab.getElementsByTagName('li');
		var tabTriggers, delayTimeId;
		if (config.tabClass) {
			tabTriggers = $D.getElementsByClassName(config.tabClass, '*', container);
		} else {
			tabTriggers = TB.common.toArray(tab.getElementsByTagName('a')); /* 默认取tab下的<a> */
		}
		var onSwitchEvent = new Y.CustomEvent("onSwitch", null, false, Y.CustomEvent.FLAT);
		if (config.onSwitch) {
			onSwitchEvent.subscribe(config.onSwitch);
		}

		var focusHandler = function(ev) {
			if (delayTimeId)
				cacelHandler();
			var idx = tabTriggers.indexOf(this);
			handle.switchTab(idx);
			onSwitchEvent.fire(idx);
			if (config.stopEvent) {
				try {
					$E.stopEvent(ev);
				}catch (e) {
					/* ignore */
				}
			}
			return !config.stopEvent;
		}
		var delayHandler = function(ev) {
			var target = this;
			delayTimeId = setTimeout(function(){
				focusHandler.call(target, ev);
			}, config.delay*1000);
			if (config.stopEvent)
				$E.stopEvent(ev);
			return !config.stopEvent;
		}
		var cacelHandler = function() {
			clearTimeout(delayTimeId);
		}		
		for (var i = 0; i < tabTriggers.length; i++) {
			$E.on(tabTriggers[i], 'focus', focusHandler);
			if (config.eventType == 'mouse') {
				$E.on(tabTriggers[i], 'mouseover', config.delay?delayHandler:focusHandler);
				$E.on(tabTriggers[i], 'mouseout', cacelHandler);
			} 
			else {
				$E.on(tabTriggers[i], 'click', focusHandler);
			}
		}

		/* 定义公开的方法 */
		TB.apply(handle, {
			switchTab: function(idx) {
				$D.setStyle(tabPanels, 'display', 'none');
				$D.removeClass(tabTriggerBoxs, config.currentClass);
				$D.addClass(tabTriggerBoxs[idx], config.currentClass);
				$D.setStyle(tabPanels[idx], 'display', 'block');
			},
			subscribeOnSwitch: function(func) {
				onSwitchEvent.subscribe(func);
			}
		});
		handle.onSwitch = handle.subscribeOnSwitch;
		
		/*初始化操作*/
		$D.setStyle(tabPanels, 'display', 'none');
		if (config.autoSwitchToFirst)
			handle.switchTab(0);
		
		/* 返回操作对象 */
		return handle;
	}
};