/**
 * TBra Slide 
 * 
 * 限制：幻灯片必须包括在<ul>中，每张幻灯片是一个<li>。
 * @author xiaoma<xiaoma@taobao.com>
 * 
 */
/* 幻灯片播放 */
(function() {
	var Y = YAHOO.util;
	
	TB.widget.Slide = function(container, config) {
		this.init(container, config);
	}
	/* 默认参数配置 */ 
	TB.widget.Slide.defConfig = {
		slidesClass: 'Slides',			/* 幻灯影片ul的className */
		triggersClass: 'SlideTriggers',		/* 触点的className */
		currentClass: 'Current',			/* 当前触点的className */
		eventType: 'click',					/* 触点接受的事件类型，默认是鼠标点击 */
		autoPlayTimeout: 5,					/* 自动播放时间间隔 */
		disableAutoPlay: false				/* 禁止自动播放 */
	};
	TB.widget.Slide.prototype = {
		/**
		 * 初始化对象属性和行为
		 * @method init 
		 * @param {Object} container 容器对象或ID
		 * @param {Object} config 配置参数
		 */
		init: function(container, config) {
			this.container = $(container);
			this.config = TB.applyIf(config||{}, TB.widget.Slide.defConfig);
			try {
				this.slidesUL = $D.getElementsByClassName(this.config.slidesClass, 'ul', this.container)[0];
				
				if(!this.slidesUL) {
					//取第一个 ul 子节点
					this.slidesUL = $D.getFirstChild(this.container, function(node) {
						return node.tagName.toLowerCase === 'ul';
					});
				}
				
				this.slides = $D.getChildren(this.slidesUL); //只取直接的子<li>元素
				if (this.slides.length == 0) {
					throw new Error();
				}
			} catch (e) {
				throw new Error("can't find slides!");
			}
			this.delayTimeId = null;		/* eventType = 'mouse' 时，延迟的TimeId */
			this.autoPlayTimeId = null;		/* 自动播放TimeId */
			this.curSlide = -1;
			this.sliding = false;
			this.pause = false;
			this.onSlide = new Y.CustomEvent("onSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.onSlide)){
				this.onSlide.subscribe(this.config.onSlide, this, true);
			}
			
			this.beforeSlide = new Y.CustomEvent("beforeSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.beforeSlide)){
				this.beforeSlide.subscribe(this.config.beforeSlide, this, true);
			}			
			
			/* 指定tbra.css中设定的 class */
			$D.addClass(this.container, 'tb-slide');
			$D.addClass(this.slidesUL, 'tb-slide-list');
			$D.setStyle(this.slidesUL, 'height', (this.config.slideHeight || this.container.offsetHeight) + 'px');
			
			this.initSlides(); /* 初始化幻灯片设置 */
			this.initTriggers();
			if (this.slides.length > 0)
				this.play(1);
			if (! this.config.disableAutoPlay){
				this.autoPlay();
			}
			if (YAHOO.lang.isFunction(this.config.onInit)) {
				this.config.onInit.call(this);
			}
		},
		
		/**
		 * 根据幻灯片长度自动生成触点，包含在一个<ul>中，页面中CSS中必须有对应属性设置
		 * @method initTriggers 
		 */
		initTriggers: function() {
			var ul = document.createElement('ul');
			this.container.appendChild(ul);
			for (var i = 0; i < this.slides.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = i+1;
				ul.appendChild(li);
			}
			$D.addClass(ul, this.config.triggersClass);
			this.triggersUL = ul;
			if (this.config.eventType == 'mouse') {
				$E.on(this.triggersUL, 'mouseover', this.mouseHandler, this, true);
				$E.on(this.triggersUL, 'mouseout', function(e){
					clearTimeout(this.delayTimeId);
					this.pause = false;
				}, this, true);
			} else {
				$E.on(this.triggersUL, 'click', this.clickHandler, this, true);
			}
		},
		
		/**
		 * 初始化幻灯片
		 * @method initSlides 
		 */
		initSlides: function() {
			$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
			$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
			$D.setStyle(this.slides, 'display', 'none');
		},
		
		/**
		 * 点击事件处理
		 * @param {Object} e Event对象
		 */
		clickHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(TB.common.stripTags(t.innerHTML));
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					 /* 如果还在滑动中,停止响应 */
					if (!this.sliding){
						this.play(idx, true);
					}
					break;
				} else {
					t = t.parentNode;
				}
			}		
		},
		
		/**
		 * 鼠标事件处理
		 * @param {Object} e Event 对象
		 */
		mouseHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(TB.common.stripTags(t.innerHTML));
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					var self = this;			
					this.delayTimeId = setTimeout(function() {
							self.play(idx, true);
							self.pause = true;
						}, (self.sliding?.5:.1)*1000);
					break;
				} else {
					t = t.parentNode;
				}
			}
		},
		
		/**
		 * 播放指定页的幻灯片
		 * @param {Object} n 页数，也就是触点数字值
		 * @param {Object} flag 如果flag=true，则是用户触发的，反之则为自动播放
		 */
		play: function(n, flag) {
			n = n - 1;
			if (n == this.curSlide) return;
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			if (flag && this.autoPlayTimeId)
				clearInterval(this.autoPlayTimeId);
			var triggersLis = this.triggersUL.getElementsByTagName('li');
			triggersLis[curSlide].className = ''; 
			triggersLis[n].className = this.config.currentClass;
			this.beforeSlide.fire(n);
			this.slide(n);
			this.curSlide = n;
			if (flag && !this.config.disableAutoPlay)
				this.autoPlay();
		},
		
		/**
		 * 切换幻灯片，最简单的切换就是隐藏/显示。
		 * 不同的效果可以覆盖此方法
		 * @see TB.widget.ScrollSlide
		 * @see TB.widget.FadeSlide
		 * @param {Object} n 页数
		 */
		slide: function(n) {
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			this.sliding = true;
			$D.setStyle(this.slides[curSlide], 'display', 'none');
			$D.setStyle(this.slides[n], 'display', 'block');
			this.sliding = false;
			this.onSlide.fire(n);
		},
		
		/**
		 * 设置自动播放
		 * @method autoPlay
		 */
		autoPlay: function() {
			var self = this;
			var callback = function() {
				if ( !self.pause && !self.sliding ) {
					var n = (self.curSlide+1) % self.slides.length + 1;
					self.play(n, false);
				}
			}
			this.autoPlayTimeId = setInterval(callback, this.config.autoPlayTimeout * 1000);
		}
	}
	
	/**
	 * 滚动效果的幻灯片播放器
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.ScrollSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.ScrollSlide, TB.widget.Slide, {
		/**
		 * 覆盖父类的行为，不隐藏幻灯片
		 * CSS中注意设置 slidesUL overflow:hidden，保证只显示一幅幻灯
		 */
		initSlides: function() {
			TB.widget.ScrollSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'display', '');
		},
		/**
		 * 覆盖父类的行为，使用滚动动画
		 * @param {Object} n
		 */
		slide: function(n) {
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			var args = { scroll: {by:[0, this.slidesUL.offsetHeight*(n-curSlide)]} };
			var anim = new Y.Scroll(this.slidesUL, args, .5, Y.Easing.easeOutStrong);
			anim.onComplete.subscribe(function(){
				this.sliding = false;
				this.onSlide.fire(n);
			}, this, true);
			anim.animate();
			this.sliding = true;
		}
	});
	
	/**
	 * 淡入淡出效果的幻灯片播放器
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.FadeSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.FadeSlide, TB.widget.Slide, {
		/**
		 * 覆盖父类的行为，设置幻灯片的position=absolute
		 */
		initSlides: function() {
			TB.widget.FadeSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'position', 'absolute');
			$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
			$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
			$D.setStyle(this.slides, 'z-index', 1);
		},
		
		/**
		 * 覆盖父类的行为，使用淡入淡出动画
		 * @param {Object} n
		 */
		slide: function(n) {
			/* 第一次运行 */
			if (this.curSlide == -1) {
				$D.setStyle(this.slides[n], 'display', 'block');
				this.onSlide.fire(n);
			} else {
				var curSlideLi = this.slides[this.curSlide];
				$D.setStyle(curSlideLi, 'display', 'block');
				$D.setStyle(curSlideLi, 'z-index', 10);
				var fade = new Y.Anim(curSlideLi, { opacity: { to: 0 } }, .5, Y.Easing.easeNone);
				fade.onComplete.subscribe(function(){
					$D.setStyle(curSlideLi, 'z-index', 1);
					$D.setStyle(curSlideLi, 'display', 'none');
					$D.setStyle(curSlideLi, 'opacity', 1);
					this.sliding = false;
					this.onSlide.fire(n);
				}, this, true);
				
				$D.setStyle(this.slides[n], 'display', 'block');
				
				fade.animate();			
				this.sliding = true;
			}
		}
	});	
	
})();

/**
 * Slide 的封装，通过 effect 参数，创建不同的Slide对象
 */
TB.widget.SimpleSlide = new function() {
	
	this.decorate = function(container, config) {
		if (!container) return;
		config = config || {};
		if (config.effect == 'scroll') {
			/** <li>下包含<iframe>时，firefox显示异常 */ 
			if (YAHOO.env.ua.gecko) {
				if (YAHOO.util.Dom.get(container).getElementsByTagName('iframe').length > 0) {
					return new TB.widget.Slide(container, config);
				}
			}
			return new TB.widget.ScrollSlide(container, config);
		}
		else if (config.effect == 'fade') {
			return new TB.widget.FadeSlide(container, config);
		}
		else {
			return new TB.widget.Slide(container, config);
		}
	}	
}