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

	var defConfig = {
		position: 'right',
		autoFit: true,
		eventType: 'mouse',
		delay: 0.1,
		disableClick: true,  /* stopEvent when eventType = mouse */
		width: 200,
		height: 200		
	};
	
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
		clearTimeout(this._popupHideTimeId);
		var self = this;
		this._popupShowTimeId = setTimeout(function(){
			self.show();
		}, this.config.delay * 1000);
		if (this.config.disableClick && !this.trigger.onclick) {
			this.trigger.onclick = function(e) {
				$E.preventDefault($E.getEvent(e));
			};
		}			
	}

	var triggerMouseOutHandler = function(ev) {
		clearTimeout(this._popupShowTimeId);
		if (!$D.isAncestor(this.popup, $E.getRelatedTarget(ev))){
			this.delayHide();
		}
		$E.preventDefault(ev);
	}
	
	var popupMouseOverHandler = function(ev) {
		var handle = this.currentHandle? this.currentHandle : this;
		clearTimeout(handle._popupHideTimeId);
	}

	var popupMouseOutHandler = function(ev) {
		var handle = this.currentHandle? this.currentHandle : this;
		if (!$D.isAncestor(handle.popup, $E.getRelatedTarget(ev))){
			handle.delayHide();
		}
	}
	
	this.decorate = function(trigger, popup, config) {
		if (YAHOO.lang.isArray(trigger) || (YAHOO.lang.isObject(trigger) && trigger.length)) {
			config.shareSinglePopup = true;
			var groupHandle = {};
			groupHandle._handles = [];
			/* batch操作时处于简单考虑，不返回handle object */
			for (var i = 0; i < trigger.length; i++) {
				var h = this.decorate(trigger[i], popup, config);
				h._beforeShow = function(){
					groupHandle.currentHandle = this;
					return true;
				};
				groupHandle._handles[i] = h; 
			}
			if (config.eventType == 'mouse') {
				$E.on(popup, 'mouseover', popupMouseOverHandler, groupHandle, true);
				$E.on(popup, 'mouseout', popupMouseOutHandler, groupHandle, true);
			}			
			return groupHandle;
		}
		
		trigger = $(trigger);
		popup = $(popup);
		if (!trigger || !popup) return;
		config = TB.applyIf(config||{}, defConfig);
		/* 返回给调用者的控制器，只包含对调用者可见的方法/属性 */		
		var handle = {};		

		handle._popupShowTimeId = null;
		handle._popupHideTimeId = null;
		handle._beforeShow = function(){return true};

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
			$E.on(trigger, 'mouseout', triggerMouseOutHandler, handle, true);
			/* batch 操作时，Popup 的鼠标事件只注册一次 */
			if (!config.shareSinglePopup) {
				$E.on(popup, 'mouseover', popupMouseOverHandler, handle, true);
				$E.on(popup, 'mouseout', popupMouseOutHandler, handle, true);
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
				if (!this._beforeShow()) return;
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
						$D.setStyle(this.popup, 'opacity', 0);
						this.popup.style.display = 'block';
						var anim = new Y.Anim(this.popup, { opacity: {to: 1} }, 0.4);
						anim.animate();
					}
				} else {
					this.popup.style.display = 'block';
				}
				onShowEvent.fire();					
			},
			hide: function() {
				$D.setStyle(this.popup, 'display', 'none');
				onHideEvent.fire();
			},
			delayHide: function() {
				var self = this;
		        this._popupHideTimeId = setTimeout(function(){
					self.hide();
				}, this.config.delay*1000);
			}			
		});
		
		$D.setStyle(popup, 'display', 'none');

		return handle;		
	}
}
	
