/**
 * @author xiaoma<xiaoma@taobao.com>
 */

/**
	config 属性说明

	position: {String} [left|right|top|bottom]
	autoFit: {Boolean} 是否自适应窗口
	width: {Number} popup width 
	height: {Number} popup height
	offset: {Array} offset
	eventType: {String} [mouse|click] 鼠标移动触发还是点击触发
	disableClick: {Boolean}
	delay: {Number} 鼠标移动触发时间延迟
	onShow: {function} 显示回调函数
	onHide: {Function} 隐藏回调函数
 */
	
TB.widget.SimplePopup = new function() {
	var Y = YAHOO.util;
	var popupShowTimeId, popupHideTimeId;

	var defConfig = {
		position: 'right',
		autoFit: true,
		eventType: 'mouse',
		delay: 0.2,
		disableClick: true,  /* stopEvent when eventType = mouse */
		width: 200,
		height: 200		
	};
	
	/** 判断p是否包含c **/
	var checkContains = function(p, c) {
		if (p.contains && c!=null)
			return p.contains(c);
		else {
			while (c) {
				if (c == p) return true;
				c = c.parentNode;
			}
			return false;
		}
	}
	
	/**
	 * 事件处理器
	 * scope is handle
	 * @param {Object} ev
	 */	
	var triggerClickHandler = function(ev) {
		var target = $E.getTarget(ev);
		if (triggerClickHandler._target == target) {
			this.popup.style.display == 'block'? this.hide() : this.show();
		} else {
			this.show();
		}
		$E.preventDefault(ev);
		triggerClickHandler._target = target;
	}
	var triggerMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		var self = this;
		popupShowTimeId = setTimeout(function(){
			self.show();
		}, this.config.delay * 1000);
		if (this.config.disableClick && !this.trigger.onclick) {
			this.trigger.onclick = function(e) {
				$E.preventDefault($E.getEvent(e));
			};
		}			
	}
	
	var popupMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		$E.preventDefault(ev);		
	}

	var mouseOutHandler = function(ev) {
		clearTimeout(popupShowTimeId);
		$E.preventDefault(ev);
		if (!checkContains(this.popup, $E.getRelatedTarget(ev))){
			this.delayHide();
		}
	}
	
	this.decorate = function(trigger, popup, config) {
		if (YAHOO.lang.isArray(trigger) || (YAHOO.lang.isObject(trigger) && trigger.length)) {
			/* batch操作时处于简单考虑，不返回handle object */
			for (var i = 0; i < trigger.length; i++) {
				this.decorate(trigger[i], popup, config);
			}
			return;
		}
		
		trigger = $(trigger);
		popup = $(popup);
		if (!trigger || !popup) return;
		config = TB.applyIf(config||{}, defConfig);
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */		
		var handle = {};		

		var onShowEvent = new Y.CustomEvent("onShow", handle, false, Y.CustomEvent.FLAT);
		if (config.onShow) {
			onShowEvent.subscribe(config.onShow);	
		}
		var onHideEvent = new Y.CustomEvent("onHide", handle, false, Y.CustomEvent.FLAT);
		if (config.onHide) {
			onHideEvent.subscribe(config.onHide);	
		}			

		if (config.eventType == 'mouse') {
			$E.on(trigger, 'mouseover', triggerMouseOverHandler, handle, true);
			$E.on(trigger, 'mouseout', mouseOutHandler, handle, true);
			/* batch 操作时，Popup 的鼠标事件只注册一次 */
			if (!$E.getListeners(popup, 'mouseover')) {
				$E.on(popup, 'mouseover', popupMouseOverHandler);
			}
			if (!$E.getListeners(popup, 'mouseout')) {
				$E.on(popup, 'mouseout', mouseOutHandler, handle, true);
			}		
		}
		else if (config.eventType == 'click') {
			$E.on(trigger, 'click', triggerClickHandler, handle, true);
		}

		TB.apply(handle, {
			popup: popup,
			trigger: trigger,
			config: config,
			show: function() {
				this.hide();
				var pos = $D.getXY(this.trigger);
				if (YAHOO.lang.isArray(this.config.offset)) {
					pos[0] += parseInt(this.config.offset[0]);
					pos[1] += parseInt(this.config.offset[1]);
				}
				var tw = this.trigger.offsetWidth, th = this.trigger.offsetHeight;
				var pw = config.width, ph = config.height;
				var dw = $D.getViewportWidth(), dh = $D.getViewportHeight();
                var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
				var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				
				var l = pos[0], t = pos[1];
				if (config.position == 'left') {
					l = pos[0]-pw;
				}
				else if (config.position == 'right') {
					l = pos[0]+tw;
				} else if (config.position == 'bottom') {
					t = t+th;
				} else if (config.position == 'top') {
					t = t-ph;
					if (t < 0) t = 0;
				}
				
				if(this.config.autoFit) {
					if (t-st+ph > dh) {
						t = dh-ph+st-2; /* 2px 偏差 */
						if (t < 0) {
							t = 0;
						}
					}
				}
					
				this.popup.style.position = 'absolute';
				this.popup.style.top = t + 'px';
				this.popup.style.left = l + 'px';
				if (this.config.effect) {
					if (this.config.effect == 'fade') {
						this.popup.style.display = 'block';
						$D.setStyle(this.popup, 'opacity', 0);
						var anim = new Y.Anim(this.popup, { opacity: {to: 1} }, 0.4);
						anim.animate();
					}
				} else {
					this.popup.style.display = 'block';
				}
				onShowEvent.fire();					
			},
			hide: function() {
				this.popup.style.display = 'none';
				onHideEvent.fire();
			},
			delayHide: function() {
				var self = this;
		        popupHideTimeId = setTimeout(function(){
					self.hide();
				}, this.config.delay*1000);
			}			
		});
		
		$D.setStyle(popup, 'display', 'none');

		return handle;		
	}
}
	
