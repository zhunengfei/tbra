/**
 * @author zexin.zhaozx
 */
TB.widget.Accordion = new function() {
	
	var Y = YAHOO.util;
	
	var defConfig = {
		toggleClass: 'tb-accordion-toggle',
		contentClass: 'tb-accordion-content',
		toggleActiveClass: 'tb-accordion-toggle-active',
		eventType: 'click',		/* click or mouse 点击触发or鼠标移动触发 */
		delay: 0.2,  			/* available when eventType=mouse */
		animate: true,			/* 是否动画显示 */
		duration: 0.5,     		/* 动画耗时 */
		direction: 'vertical',	/* 'horizontal(h)' or 'vertical(v)'. defaults to vertical. */
		fixedHeight: false,		/* 是否显示固定高度 */
		fixedWidth: false,		/* 是否显示固定宽度 */
		autoActivateFirst: true
	}
	
	var classMatcher = function(node) {
		return $D.hasClass()
	}
	
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config || {}, defConfig);
		var toggles = $D.getChildrenBy(container, function(node){
			return $D.hasClass(node, config.toggleClass);
		});
		var contentPanels = $D.getChildrenBy(container, function(node) {
			return $D.hasClass(node, config.contentClass);	
		});
		var isHorizontal = (config.direction.toLowerCase() == 'horizontal') || (config.direction.toLowerCase() == 'h');
		
		var handle = {};
		var onActivateEvent = new Y.CustomEvent("activate", handle, false, Y.CustomEvent.FLAT);
		
		handle.currentIndex = -1;
		handle.toggles = toggles;
		handle.deactivate = function(idx) {
			if (this.currentIndex < 0) return;
			$D.removeClass(toggles[idx], config.toggleActiveClass);
			if (config.animate) {
				var collapseAttrs = isHorizontal ? {width:{to:0}} : {height:{to:0}};
				var collapseAnim = new Y.Anim(contentPanels[idx], collapseAttrs, config.duration/2, Y.Easing.easeNone);
				collapseAnim.animate();				
			} else {
				contentPanels[idx].style[isHorizontal ? 'width' : 'height'] = '0';
			}
		}
		handle.activate = function(idx) {
			if (idx == this.currentIndex) {
				return;
			}			
			this.deactivate(this.currentIndex);
			$D.addClass(toggles[idx], config.toggleActiveClass);
			var gw = config.fixedWidth||contentPanels[idx].scrollWidth, gh = config.fixedHeight||contentPanels[idx].scrollHeight;
			if (config.animate) {			
				//expand activated content				
				var expandAttrs = null;
				if (isHorizontal) {
					expandAttrs = {width:{from:0, to:gw}};
				} else {
					expandAttrs = {height:{from:0, to:gh}};
				}
				var expandAnim = new Y.Anim(contentPanels[idx], expandAttrs, config.duration, Y.Easing.easeOut);
				expandAnim.onComplete.subscribe(function(){
					onActivateEvent.fire(idx);
				});
				expandAnim.animate();			
			} else {
				if (isHorizontal) {
					contentPanels[idx].style.width = gw+'px' || 'auto';
				} else {
					contentPanels[idx].style.height = gh+'px' || 'auto';
				}				
				onActivateEvent.fire(idx);
			}
			
			this.currentIndex = idx;
		}
		
		if (isHorizontal) {
			$D.setStyle(contentPanels, 'width', '0');
		} else {
			$D.setStyle(contentPanels, 'height', '0');
		}
		
		if (config.onActivate) {
			onActivateEvent.subscribe(config.onActivate);
		}
		
		var delayTimeId = null;
		toggles.forEach(function(t, i){
			if (config.eventType=='mouse') {
				$E.on(t, 'mouseover', function(ev, params) {
					delayTimeId = setTimeout(function(){
						params[0].activate(params[1]);
					}, config.delay*1000);
				}, [handle, i]);
				$E.on(t, 'mouseout', function(){
					clearTimeout(delayTimeId);
				});
			} else {
				$E.on(t, 'click', function(ev, params){
					params[0].activate(params[1]);
				}, [handle, i]);
			}
		})
		
		if (config.autoActivateFirst)
			handle.activate(0);
		
		return handle;
	}	
}