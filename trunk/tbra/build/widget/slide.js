/**
 * TBra Slide 
 * 
 * ���ƣ��õ�Ƭ���������<ul>�У�ÿ�Żõ�Ƭ��һ��<li>��
 * @author xiaoma<xiaoma@taobao.com>
 * 
 */
/* �õ�Ƭ���� */
(function() {
	var Y = YAHOO.util;
	
	TB.widget.Slide = function(container, config) {
		this.init(container, config);
	}
	/* Ĭ�ϲ������� */ 
	TB.widget.Slide.defConfig = {
		slidesClass: 'Slides',			/* �õ�ӰƬul��className */
		triggersClass: 'SlideTriggers',		/* �����className */
		currentClass: 'Current',			/* ��ǰ�����className */
		eventType: 'click',					/* ������ܵ��¼����ͣ�Ĭ��������� */
		autoPlayTimeout: 5,					/* �Զ�����ʱ���� */
		disableAutoPlay: false				/* ��ֹ�Զ����� */
	};
	TB.widget.Slide.prototype = {
		/**
		 * ��ʼ���������Ժ���Ϊ
		 * @method init 
		 * @param {Object} container ���������ID
		 * @param {Object} config ���ò���
		 */
		init: function(container, config) {
			this.container = $(container);
			this.config = TB.applyIf(config||{}, TB.widget.Slide.defConfig);
			try {
				this.slidesUL = $D.getElementsByClassName(this.config.slidesClass, 'ul', this.container)[0];
				this.slides = this.slidesUL.getElementsByTagName('li');
			} catch (e) {
				throw new Error("can't find slides!");
			}
			this.delayTimeId = null;		/* eventType = 'mouse' ʱ���ӳٵ�TimeId */
			this.autoPlayTimeId = null;		/* �Զ�����TimeId */
			this.curSlide = -1;
			this.sliding = false;
			this.pause = false;
			this.onSlide = new Y.CustomEvent("onSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.onSlide)){
				this.onSlide.subscribe(this.config.onSlide, this, true);
			}
			
			this.initSlides(); /* ��ʼ���õ�Ƭ���� */
			this.initTriggers();
			if (this.slides.length > 0)
				this.play(1);
			if (! this.config.disableAutoPlay){
				this.autoPlay();
			}
		},
		
		/**
		 * ���ݻõ�Ƭ�����Զ����ɴ��㣬������һ��<ul>�У�ҳ����CSS�б����ж�Ӧ��������
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
			ul.className = this.config.triggersClass;
			this.triggersUL = ul;
			if (this.config.eventType == 'mouse') {
				$E.on(this.triggersUL, 'mouseover', this.mouseHandler, this, true);
				$E.on(this.triggersUL, 'mouseout', function(e){
					clearTimeout(this.delayTimeId);
				}, this, true);
			} else {
				$E.on(this.triggersUL, 'click', this.clickHandler, this, true);
			}		
		},

		/**
		 * ��ʼ���õ�Ƭ
		 * @method initSlides 
		 */
		initSlides: function() {
			$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
			$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
			$D.setStyle(this.slides, 'display', 'none');
		},
		
		/**
		 * ����¼�����
		 * @param {Object} e Event����
		 */
		clickHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(t.innerHTML);
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					 /* ������ڻ�����,ֹͣ��Ӧ */
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
		 * ����¼�����
		 * @param {Object} e Event ����
		 */
		mouseHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(t.innerHTML);
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					var self = this;			
					this.delayTimeId = setTimeout(function() {
							self.play(idx, true);
						}, (self.sliding?.5:.1)*1000);
					break;
				} else {
					t = t.parentNode;
				}
			}
		},
		
		/**
		 * ����ָ��ҳ�Ļõ�Ƭ
		 * @param {Object} n ҳ����Ҳ���Ǵ�������ֵ
		 * @param {Object} flag ���flag=true�������û������ģ���֮��Ϊ�Զ�����
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
			this.slide(n);		
			this.curSlide = n;
			if (flag && !this.config.disableAutoPlay)
				this.autoPlay();
		},
		
		/**
		 * �л��õ�Ƭ����򵥵��л���������/��ʾ��
		 * ��ͬ��Ч�����Ը��Ǵ˷���
		 * @see TB.widget.ScrollSlide
		 * @see TB.widget.FadeSlide
		 * @param {Object} n ҳ��
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
		 * �����Զ�����
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
	 * ����Ч���Ļõ�Ƭ������
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.ScrollSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.ScrollSlide, TB.widget.Slide, {
		/**
		 * ���Ǹ������Ϊ�������ػõ�Ƭ
		 * CSS��ע������ slidesUL overflow:hidden����ֻ֤��ʾһ���õ�
		 */
		initSlides: function() {
			TB.widget.ScrollSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'display', '');
		},
		/**
		 * ���Ǹ������Ϊ��ʹ�ù�������
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
	 * ���뵭��Ч���Ļõ�Ƭ������
	 * @param {Object} container
	 * @param {Object} config
	 */
	TB.widget.FadeSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.FadeSlide, TB.widget.Slide, {
		/**
		 * ���Ǹ������Ϊ�����ûõ�Ƭ��position=absolute
		 */
		initSlides: function() {
			TB.widget.FadeSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'position', 'absolute');
			$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
			$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
			$D.setStyle(this.slides, 'z-index', 1);
		},
		
		/**
		 * ���Ǹ������Ϊ��ʹ�õ��뵭������
		 * @param {Object} n
		 */
		slide: function(n) {
			/* ��һ������ */
			if (this.curSlide == -1) {
				$D.setStyle(this.slides[n], 'display', 'block');
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
 * Slide �ķ�װ��ͨ�� effect ������������ͬ��Slide����
 */
TB.widget.SimpleSlide = new function() {
	
	this.decorate = function(container, config) {
		if (!container) return;
		config = config || {};
		if (config.effect == 'scroll') {
			/** <li>�°���<iframe>ʱ��firefox��ʾ�쳣 */ 
			if (navigator.product && navigator.product == 'Gecko') {
				if (YAHOO.util.Dom.get(container).getElementsByTagName('iframe').length > 0) {
					new TB.widget.Slide(container, config);
					return;
				}
			}
			new TB.widget.ScrollSlide(container, config);
		}
		else if (config.effect == 'fade') {
			new TB.widget.FadeSlide(container, config);
		}
		else {
			new TB.widget.Slide(container, config);
		}
	}	
}