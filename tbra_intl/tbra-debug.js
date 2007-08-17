/*
 * TBra
 * 
 * Taobao JavaScript Framework base on YUI
 * T-Bra or TB-ra whatever you like name it...
 * 
 */

// Mozilla 1.8 has support for indexOf, lastIndexOf, forEach, filter, map, some, every
// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (obj, fromIndex) {
		if (fromIndex == null) {
			fromIndex = 0;
		} else if (fromIndex < 0) {
			fromIndex = Math.max(0, this.length + fromIndex);
		}
		for (var i = fromIndex; i < this.length; i++) {
			if (this[i] === obj)
				return i;
		}
		return -1;
	};
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (obj, fromIndex) {
		if (fromIndex == null) {
			fromIndex = this.length - 1;
		} else if (fromIndex < 0) {
			fromIndex = Math.max(0, this.length + fromIndex);
		}
		for (var i = fromIndex; i >= 0; i--) {
			if (this[i] === obj)
				return i;
		}
		return -1;
	};
}


// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (f, obj) {
		var l = this.length;	// must be fixed during loop... see docs
		for (var i = 0; i < l; i++) {
			f.call(obj, this[i], i, this);
		}
	};
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
if (!Array.prototype.filter) {
	Array.prototype.filter = function (f, obj) {
		var l = this.length;	// must be fixed during loop... see docs
		var res = [];
		for (var i = 0; i < l; i++) {
			if (f.call(obj, this[i], i, this)) {
				res.push(this[i]);
			}
		}
		return res;
	};
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
if (!Array.prototype.map) {
	Array.prototype.map = function (f, obj) {
		var l = this.length;	// must be fixed during loop... see docs
		var res = [];
		for (var i = 0; i < l; i++) {
			res.push(f.call(obj, this[i], i, this));
		}
		return res;
	};
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:some
if (!Array.prototype.some) {
	Array.prototype.some = function (f, obj) {
		var l = this.length;	// must be fixed during loop... see docs
		for (var i = 0; i < l; i++) {
			if (f.call(obj, this[i], i, this)) {
				return true;
			}
		}
		return false;
	};
}

// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
if (!Array.prototype.every) {
	Array.prototype.every = function (f, obj) {
		var l = this.length;	// must be fixed during loop... see docs
		for (var i = 0; i < l; i++) {
			if (!f.call(obj, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
}

Array.prototype.contains = function (obj) {
	return this.indexOf(obj) != -1;
};

Array.prototype.copy = function (obj) {
	return this.concat();
};

Array.prototype.insertAt = function (obj, i) {
	this.splice(i, 0, obj);
};

Array.prototype.insertBefore = function (obj, obj2) {
	var i = this.indexOf(obj2);
	if (i == -1)
		this.push(obj);
	else
		this.splice(i, 0, obj);
};

Array.prototype.removeAt = function (i) {
	this.splice(i, 1);
};

Array.prototype.remove = function (obj) {
	var i = this.indexOf(obj);
	if (i != -1)
		this.splice(i, 1);
};



if (!String.prototype.toQueryParams) {
	String.prototype.toQueryParams = function() {
		var hash = {};
		var params = this.trim().split('&');
		for (var j = 0; j < params.length; j++) {
			var pair = params[j].split('=');
			var name = decodeURIComponent(pair[0]);
			var value = pair[1]?decodeURIComponent(pair[1]) : undefined;

			if (hash[name] !== undefined) {
				if (hash[name].constructor != Array)
					hash[name] = [hash[name]];
				if (value) 
					hash[name].push(value);
			} else {
				hash[name] = value;
			}
		}
		return hash;					
	}
}

if (!String.prototype.trim) {
	String.prototype.trim = function(){ 
	    var re = /^\s+|\s+$/g;
	    return function(){ return this.replace(re, ""); };
	}();
}

$D = YAHOO.util.Dom;$E = YAHOO.util.Event;$ = $D.get;TB = {};TB.namespace = function() {    var a=arguments, o=null, i, j, d;    for (i=0; i<a.length; i=i+1) {        d=a[i].split(".");        o=TB;        for (j=(d[0] == "TB") ? 1 : 0; j<d.length; j=j+1) {            o[d[j]]=o[d[j]] || {};            o=o[d[j]];        }    }    return o;};TB.namespace('env');TB.env = {	hostname: 'taobao.com',	scriptName: 'tbra-debug.js',	debug: true,	lang: (navigator.userLanguage?navigator.userLanguage.toLowerCase():navigator.language.toLowerCase())};TB.namespace('locale');TB.locale = {	Messages: {},	getMessage: function(key) {		return TB.locale.Messages[key] || key;	},	setMessage: function(key, value) {		TB.locale.Messages[key] = value;	}	}$M = TB.locale.getMessage;TB.trace = function(msg) {	if (!TB.env.debug) return;	if (window.console) {		window.console.debug(msg);	} else {		alert(msg);	}}TB.init = function() {	this.namespace('widget', 'dom', 'bom', 'util', 'form', 'anim');	var scripts = document.getElementsByTagName("script");	var idx, urlPrefix;	for (var i = 0; i < scripts.length; i++) {		if ((idx = scripts[i].src.indexOf(TB.env.scriptName)) > 0) {			urlPrefix = scripts[i].src.substring(0, idx);			var matchs = scripts[i].src.match(/\?(.*)$/);			if (matchs) {				var params = matchs[1].toQueryParams();				for (n in params) {					if (n=='t') n = 'timestamp';					TB.env[n] = params[n];				}							}		}	}	document.write( '<script type="text/javascript" src="' + urlPrefix + 'locale/' + TB.env.lang.toLowerCase() + '.js"><\/script>' );	document.write('<link type="text/css" rel="stylesheet" href="' + urlPrefix + 'assets/tbra.css" />');	}TB.init();

TB.common = {
	
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,''); 
	},

	
	escapeHTML: function(str) {
		var div = document.createElement('div');
		var text = document.createTextNode(str);
		div.appendChild(text);
		return div.innerHTML;
	},

	
	unescapeHTML: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	},
	
	
	stripTags: function(str) {
    	return str.replace(/<\/?[^>]+>/gi, '');
  	},

	
	toArray : function(list, start) {
		var array = [];
		for (var i = start || 0; i < list.length; i++) {
			array[array.length] = list[i];
		}
		return array;
	},

		
	applyIf: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config) {
				if (!YAHOO.lang.hasOwnProperty(obj, p))
            		obj[p] = config[p];
			}
    	}
    	return obj;
	},

			
	apply: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config)
				obj[p] = config[p];
		}
		return obj;
	},
	
	_messagePattern: /\{([\w-]+)?\}/g,
	
	
	formatMessage: function(msg, values, filter) {
		return msg.replace(this._messagePattern, function(match, key) {
			return filter?filter(values[key], key):values[key];
		});					
	}
	
};

TB.applyIf = TB.common.applyIf;
TB.apply = TB.common.apply;


(function() {
	var ua = navigator.userAgent.toLowerCase();
	var _isOpera = ua.indexOf('opera') != -1,
		_isSafari = ua.indexOf('safari') != -1,
		_isGecko = !_isOpera && !_isSafari && ua.indexOf('gecko') > -1,
		_isIE = !_isOpera && ua.indexOf('msie') != -1, 
		_isIE6 = !_isOpera && ua.indexOf('msie 6') != -1;
		
	TB.bom = {
		isOpera: _isOpera,
		isSafari: _isSafari,
		isGecko: _isGecko,
		isIE: _isIE,
		isIE6: _isIE6,
			
			
		getCookie: function(name) {
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]) : '';
		},
	
	    	
		setCookie: function(name, value, expire, domain, path) {
			value = escape(value);
			value += (domain) ? '; domain=' + domain : '';
			value += (path) ? "; path=" + path : '';
			if (expire){
				var date = new Date();
				date.setTime(date.getTime() + (expire * 86400000));
				value += "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + value;
		},
	
		
		removeCookie: function(name) {
			setCookie(name, '', -1);
		},
	
		
		pickDocumentDomain: function() {
			var da = location.hostname.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		}
	}
})();

TB.dom = {
	
	
	insertAfter: function(node, refNode) {
		var node = $(node), refNode = $(refNode);
		if (refNode.nextSibling) {
			return refNode.parentNode.insertBefore(node, refNode.nextSibling);
		} else {
			return refNode.parentNode.appendChild(node);
		}
	},
	
	
	getAncestorByTagName: function(el, tag) {
		el = $(el);		
		tag = tag.toUpperCase();
		while(el.parentNode) {
			if (el.tagName.toUpperCase() == tag) return el;
			if (el.tagName.toUpperCase() == "BODY") return null;
			el = el.parentNode;
		}
		return null;		
	},
	
	
	getAncestorByClassName: function(el, cls) {
		el = $(el);
		while(el.parentNode) {
			if ($D.hasClass(el, cls)) return el;
			if (el.tagName.toUpperCase == "BODY") return null;
			el = el.parentNode;
		}
		return null;
	}, 
	
		
	getNextSibling: function(el) {
		var sibling = $(el).nextSibling;	
		while (sibling.nodeType != 1) {
			sibling = sibling.nextSibling;
		}
		return sibling;
	},
	
	
	getPreviousSibling: function(el) {
		var sibling = $(el).previousSibling;	
		while (sibling.nodeType != 1) {
			sibling = sibling.previousSibling;
		}
		return sibling;		
	},
	
	
	getFieldLabelHtml: function(el, parent) {
		var labels = (parent || el.parentNode).getElementsByTagName('label');
		for (var i = 0; i < labels.length; i++) {
			var forAttr = labels[i].htmlFor || labels[i].getAttribute('for')
			if (forAttr == input.id)
				return labels[i].innerHTML;
		} 		
	},
	
	
	getIframeDocument: function(el) {
		var iframe = $(el);
		return iframe.contentWindow? iframe.contentWindow.document : iframe.contentDocument;
	},

	
	setFormAction: function(form, url) {
		form = $('form');
	    var actionInput = form.elements['action'];
	    var postSet;
	    if (actionInput) {
	        var ai = form.removeChild(actionInput);
	        postSet = function() {
	            form.appendChild(ai);
			}
	    }
	    form.action = url;
	    if (postSet)
	        postSet();
	    return true;
	}	
	
}

TB.widget.SimpleTab = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		eventType: 'click',
		currentClass: 'Current',  
		tabClass: '',  
		autoSwitchToFirst: true,  
		stopEvent: true,  
		delay: 0.2  
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
				
		var handle = {};
	
		var tabPanels = getImmediateDescendants(container);
		var tab = tabPanels.shift(0);
		var tabTriggerBoxs  = tab.getElementsByTagName('li');
		var tabTriggers, delayTimeId;
		if (config.tabClass) {
			tabTriggers = $D.getElementsByClassName(config.tabClass, '*', container);
		} else {
			tabTriggers = TB.common.toArray(tab.getElementsByTagName('a')); 
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
		
		
		$D.setStyle(tabPanels, 'display', 'none');
		if (config.autoSwitchToFirst)
			handle.switchTab(0);
		
		
		return handle;
	}
};


(function() {
	var Y = YAHOO.util;
	
	TB.widget.Slide = function(container, config) {
		this.init(container, config);
	}
	 
	TB.widget.Slide.defConfig = {
		slidesClass: 'Slides',			
		triggersClass: 'SlideTriggers',		
		currentClass: 'Current',			
		eventType: 'click',					
		autoPlayTimeout: 5,					
		disableAutoPlay: false				
	};
	TB.widget.Slide.prototype = {
		
		init: function(container, config) {
			this.container = $(container);
			this.config = TB.applyIf(config||{}, TB.widget.Slide.defConfig);
			try {
				this.slidesUL = $D.getElementsByClassName(this.config.slidesClass, 'ul', this.container)[0];
				this.slides = this.slidesUL.getElementsByTagName('li');
			} catch (e) {
				throw new Error("can't find slides!");
			}
			this.delayTimeId = null;		
			this.autoPlayTimeId = null;		
			this.curSlide = -1;
			this.sliding = false;
			this.pause = false;
			this.onSlide = new Y.CustomEvent("onSlide", this, false, Y.CustomEvent.FLAT);
			if (YAHOO.lang.isFunction(this.config.onSlide)){
				this.onSlide.subscribe(this.config.onSlide, this, true);
			}
			
			this.initSlides(); 
			this.initTriggers();
			if (this.slides.length > 0)
				this.play(1);
			if (! this.config.disableAutoPlay){
				this.autoPlay();
			}
		},
		
		
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

		
		initSlides: function() {
			$E.on(this.slides, 'mouseover', function(){this.pause = true;}, this, true);
			$E.on(this.slides, 'mouseout', function(){this.pause = false;}, this, true);
			$D.setStyle(this.slides, 'display', 'none');
		},
		
		
		clickHandler: function(e) {
			var t = $E.getTarget(e);
			var idx = parseInt(t.innerHTML);
			while(t != this.container) {
				if(t.nodeName.toUpperCase() == "LI") {
					 
					if (!this.sliding){
						this.play(idx, true);
					}
					break;
				} else {
					t = t.parentNode;
				}
			}		
		},
		
		
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
		
		
		slide: function(n) {
			var curSlide = this.curSlide >= 0 ? this.curSlide : 0;
			this.sliding = true;
			$D.setStyle(this.slides[curSlide], 'display', 'none');
			$D.setStyle(this.slides[n], 'display', 'block');
			this.sliding = false;
			this.onSlide.fire(n);
		},
		
		
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
	
	
	TB.widget.ScrollSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.ScrollSlide, TB.widget.Slide, {
		
		initSlides: function() {
			TB.widget.ScrollSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'display', '');
		},
		
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
	
	
	TB.widget.FadeSlide = function(container, config){
		this.init(container, config);
	}
	YAHOO.extend(TB.widget.FadeSlide, TB.widget.Slide, {
		
		initSlides: function() {
			TB.widget.FadeSlide.superclass.initSlides.call(this);
			$D.setStyle(this.slides, 'position', 'absolute');
			$D.setStyle(this.slides, 'top', this.config.slideOffsetY||0);
			$D.setStyle(this.slides, 'left', this.config.slideOffsetX||0);
			$D.setStyle(this.slides, 'z-index', 1);
		},
		
		
		slide: function(n) {
			
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


TB.widget.SimpleSlide = new function() {
	
	this.decorate = function(container, config) {
		if (!container) return;
		config = config || {};
		if (config.effect == 'scroll') {
			 
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


TB.widget.SimpleScroll = new function() {
	
	var Y = YAHOO.util;	
 	var defConfig = {
		delay: 2,
		speed: 20,
		startDelay: 2,
		scrollItemCount: 1  		
	}
	
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
			
		var handle = {};
		
		var scrollTimeId = null, pause = false;
		var onScrollEvent = new Y.CustomEvent("onScroll", handle, false, Y.CustomEvent.FLAT);
		if (config.onScroll) {
			onScrollEvent.subscribe(config.onScroll);
		} else {
			onScrollEvent.subscribe(function() {
				for (var i = 0; i < config.scrollItemCount; i++) {
					container.appendChild(container.getElementsByTagName('li')[0]);
				}
			});
		}
		
		var scroll = function() {
			if (pause) return;
			container.scrollTop += 2;
			var lh = config.lineHeight || container.getElementsByTagName('li')[0].offsetHeight;
			if (container.scrollTop % lh <= 1) {
				clearInterval(scrollTimeId);
				onScrollEvent.fire();
				container.scrollTop = 0;					
				setTimeout(start, config.delay*1000);
			}			
		}
		
		var start = function() {
			var lh = config.lineHeight || container.getElementsByTagName('li')[0].offsetHeight;
			if (container.scrollHeight - container.offsetHeight >= lh)
				scrollTimeId=setInterval(scroll, config.speed);
		}

		$E.on(container, 'mouseover', function(){pause=true;});
		$E.on(container, 'mouseout', function(){pause=false;});
		setTimeout(start, config.startDelay*1000);

		TB.apply(handle, {
			subscribeOnScroll: function(func, override) {
				if (override === true && onScrollEvent.subscribers.length > 0)
					onScrollEvent.unsubscribeAll();
				onScrollEvent.subscribe(func);
			}
		});
		handle.onScroll = handle.subscribeOnScroll;
		return handle;
	}
};



	
TB.widget.SimplePopup = new function() {
	var Y = YAHOO.util;
	var popupShowTimeId, popupHideTimeId;

	var defConfig = {
		position: 'right',
		autoFit: true,
		eventType: 'mouse',
		delay: .2,
		width: 200,
		height: 200		
	};
	
	
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
	
		
	var triggerClickHandler = function(ev) {
		var target = $E.getTarget(ev);
		if (triggerClickHandler._target == target) {
			this.popup.style.display == 'block'? this.hide() : this.show();
		} else {
			this.show();
		}
		$E.stopEvent(ev);
		triggerClickHandler._target = target;
	}
	var triggerMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		var self = this;
		popupShowTimeId = setTimeout(function(){
			self.show();	
		}, this.config.delay * 1000);	
		if (this.config.disableClick && !this.trigger.onclick) {
			trigger.onclick = function(e) {
				$E.stopEvent($E.getEvent(e));
			};
		}			
	}
	
	var popupMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		$E.stopEvent(ev);				
	}

	var mouseOutHandler = function(ev) {
		clearTimeout(popupShowTimeId);
		$E.stopEvent(ev);
		if (!checkContains(this.popup, $E.getRelatedTarget(ev))){
			this.delayHide();
		}
	}
	
	this.decorate = function(trigger, popup, config) {
		if (YAHOO.lang.isArray(trigger) || (YAHOO.lang.isObject(trigger) && trigger.length)) {
			
			for (var i = 0; i < trigger.length; i++) {
				this.decorate(trigger[i], popup, config);
			}
			return;
		}
		
		trigger = $(trigger);
		popup = $(popup);
		if (!trigger || !popup) return;
		config = TB.applyIf(config||{}, defConfig);
				
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
						t = dh-ph+st-2; 
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
						var anim = new Y.Anim(this.popup, { opacity: {to: 1} }, .4);
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
	



TB.widget.SimpleRating = new function() {
	
	var defConfig = {
		rateUrl: '',  
		rateParams: '',  
		scoreParamName: 'score', 
		topScore: 5,  
		currentRatingClass: 'current-rating'
	};

	var rateHandler = function(ev, handle) {
		$E.stopEvent(ev);
		var aEl = $E.getTarget(ev);
		var score = parseInt(aEl.innerHTML);
		try {
			aEl.blur();	
		} catch (e) {}
		handle.rate(score);
	}
	
	var updateCurrentRating = function(currentRatingLi, avg, config) {
		if (currentRatingLi) 
			currentRatingLi.innerHTML = avg;
			$D.setStyle(currentRatingLi, 'width', avg*100/config.topScore + '%');
	} 
		
	this.decorate = function(ratingContainer, config) {
		ratingContainer = $(ratingContainer);  
		config = TB.applyIf(config || {}, defConfig);
		var currentRatingLi = $D.getElementsByClassName(config.currentRatingClass, 'li', ratingContainer)[0];
		
		var onRateEvent = new YAHOO.util.CustomEvent('onRate', null, false, YAHOO.util.CustomEvent.FLAT);
		if (config.onRate)
			onRateEvent.subscribe(config.onRate);
		var handle = {};
		
		handle.init = function(avg) {
			
			updateCurrentRating(currentRatingLi, avg, config);
		}
		
		handle.update = function(ret) {
			if (ret && ret.Average && currentRatingLi) {
				updateCurrentRating(currentRatingLi, ret.Average, config);
			}
			
			$E.purgeElement(ratingContainer, true, 'click');
			
			for (var lis = ratingContainer.getElementsByTagName('li'), i = lis.length-1; i > 0; i--) {
				ratingContainer.removeChild(lis[i]);		
			}
			onRateEvent.fire(ret);
		}
		
		handle.rate = function(score) {
			var indicator = TB.util.Indicator.attach(ratingContainer, {message:$M('pleaseWait')});
			indicator.show();		
			ratingContainer.style.display = 'none';
			var postData = config.scoreParamName + '=' + score;
			if (config.rateParams) 
				postData += '&' + config.rateParams;
			YAHOO.util.Connect.asyncRequest('POST', config.rateUrl, {
				success: function(req) {
					indicator.hide();
					ratingContainer.style.display = '';					
					var ret = eval('(' + req.responseText + ')');
					if (ret.Error) {
						alert(ret.Error.Message);
						return;
					} else {
						handle.update(ret);	
					}
				},
				failure: function(req) {
					indicator.hide();
					ratingContainer.style.display = '';							
					TB.trace($M('ajaxError'));
				}
			}, postData);				
		}
		
		handle.onRate = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				onRateEvent.subscribe(callback);		
		}				
		
		var triggers = ratingContainer.getElementsByTagName('a');
		for (var i = 0; i < triggers.length; i++) {
			$E.on(triggers[i], 'click', rateHandler, handle);
		}
				
		return handle;
	}
}

TB.widget.InputHint = new function() {
	var defConfig = {
		hintMessage: '',
		hintClass: 'InputHint',
		appearOnce: false
	};
	var EMPTY_PATTERN = /^\s*$/;
	
	var focusHandler = function(ev, handle) {
		handle.disappear();
	}
	var blurHandler = function(ev, handle) {
		handle.appear();
	}
	
	this.decorate = function(inputField, config) {
		inputField = $(inputField);
		config = TB.applyIf(config || {}, defConfig);
		var hintMessage = config.hintMessage || inputField.title;

		var handle = {};
		handle.disappear = function() {
			if (hintMessage == inputField.value) {
				inputField.value = '';
				$D.removeClass(inputField, config.hintClass);
			}
		};
		
		handle.appear = function() {
			if (EMPTY_PATTERN.test(inputField.value) || hintMessage == inputField.value) {
				inputField.value = hintMessage;
				$D.addClass(inputField, config.hintClass);
			}
		}

		
		inputField.setAttribute("title", hintMessage);
		$E.on(inputField, 'focus', focusHandler, handle);
		$E.on(inputField, 'drop', focusHandler, handle); 
		
		if (!config.appearOnce)
			$E.on(inputField, 'blur', blurHandler, handle);
		
		
		handle.appear();
		return handle;
	}
}
	
TB.anim.Highlight = function(el, config) {
	if (!el) return;
	this.init(el, config)
}
TB.anim.Highlight.defConfig = {
	startColor: '#ffff99',
	duration: .5,
	keepBackgroundImage: true
};
TB.anim.Highlight.prototype = {
	init: function(el, config) {	
		var Y = YAHOO.util;
		config = TB.applyIf(config||{}, TB.anim.Highlight.defConfig);
	
		var attr = {backgroundColor: {from: config.startColor}};
		var anim =	new Y.ColorAnim(el, attr, config.duration);
		var originBgColor = anim.getAttribute('backgroundColor');
		anim.attributes['backgroundColor']['to'] = originBgColor;
	
		if (config.keepBackgroundImage) {
			var originBg = $D.getStyle(el, 'background-image');
			anim.onComplete.subscribe(function() {
				$D.setStyle(el, 'background-image', originBg);
			});
		}
			
		this.onComplete = anim.onComplete;
		this.animate = function() {
			$D.setStyle(el, 'background-image', 'none');
			anim.animate();
		}
	}
};



TB.util.Indicator = new function() {
	
	var defConfig = {
		message: 'loading',
		useShim: false,
		useIFrame: false,
		centerIndicator: true
	}
	
	var prepareShim = function(target, useIFrame) {
		shim = document.createElement('div');
		shim.className = 'tb-indic-shim';
		$D.setStyle(shim, 'display', 'none');
		target.parentNode.insertBefore(shim, target);
		if (useIFrame) {
			var shimFrame = document.createElement('iframe');
			shimFrame.setAttribute("frameBorder", 0);
			shimFrame.className = 'tb-indic-shim-iframe';
			target.parentNode.insertBefore(shimFrame, target);
		}
		return shim;
	}	
	
	this.attach = function(target, config) {
		target = $(target);
		config = TB.applyIf(config||{}, defConfig);
		
		var indicator =  document.createElement('div');
		indicator.className = 'tb-indic';
		$D.setStyle(indicator, 'display', 'none');
		$D.setStyle(indicator, 'position', 'static');
		indicator.innerHTML = $M(config.message);
		
		if (config.useShim) {
			var shim = prepareShim(target, config.useIFrame);
			shim.appendChild(indicator);
		} else {
			target.parentNode.insertBefore(indicator, target);			
		}
		
		var handle = {};
		
		handle.show = function(xy) {
			if (config.useShim) {
				var region = $D.getRegion(target);	
				
				var shim = indicator.parentNode;
				$D.setStyle(shim, 'display', 'block');
				$D.setXY(shim, [region[0], region[1]]);
				$D.setStyle(shim, 'width', (region.right-region.left)+'px');
				$D.setStyle(shim, 'height', (region.bottom-region.top)+'px');
				
				if (config.useIFrame) {
					var shimFrame = shim.nextSibling;
					$D.setStyle(shimFrame, 'width', (region.right-region.left)+'px');
					$D.setStyle(shimFrame, 'height', (region.bottom-region.top)+'px');
					$D.setStyle(shimFrame, 'display', 'block');
				}
				
				$D.setStyle(indicator, 'display', 'block');
				$D.setStyle(indicator, 'position', 'absolute');
				if (config.centerIndicator) {
					$D.setStyle(indicator, 'top', '50%');
					$D.setStyle(indicator, 'left', '50%');
					indicator.style.marginTop = -(indicator.offsetHeight/2) + 'px';
					indicator.style.marginLeft = -(indicator.offsetWidth/2) + 'px';
				}
			} else {
				$D.setStyle(indicator, 'display', '');
				if (xy) {
					$D.setStyle(indicator, 'position', 'absolute');
					$D.setXY(indicator, xy);
				}
			}
		};

		handle.hide = function() {
			if (config.useShim) {
				var shim = indicator.parentNode;
				$D.setStyle(indicator, 'display', 'none');
				$D.setStyle(shim, 'display', 'none');
				if (config.useIFrame)
					$D.setStyle(indicator.parentNode.nextSibling, 'display', 'none');
				try {
					if (config.useIFrame)
						shim.parentNode.removeChild(shim.nextSibling);
					shim.parentNode.removeChild(shim);
				} catch (e) {}
			} else {
				$D.setStyle(indicator, 'display', 'none');
				try {
					indicator.parentNode.removeChild(indicator);
				} catch (e) {}
			}
		};
		
		return handle;
	}
}

TB.util.QueryData = function() {
	this.data = [];
	this.addField = function(input) {
		for(var i = 0; i < arguments.length; i++) {
			var field = arguments[i];
			if (field)
				this.add(field.name, encodeURIComponent(field.value));
		}
	}
	this.add = function(name, value) {
		this.data.push({"name":name, "value":value});
	}
	this.get = function(name) {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].name === name)
				return this.data[i].value;
		}
		return null;
	}
	this.toQueryString = function() {
		var qs = this.data.map(function(o, i) {
			return o.name + '=' + o.value;
		});
		return qs.join('&'); 			
	}
}
TB.util.Pagination = new function() {
	
	var PAGE_SEPARATOR = '...'; 	

		
	var defConfig = {
		pageUrl: '',
		prevPageClass: 'PrevPage',  
		noPrevClass: 'NoPrev',       
		prevPageText: 'prevPageText',
		nextPageClass: 'NextPage',  
		nextPageText: 'nextPageText',
		noNextClass: 'NoNext',       		
		currPageClass: 'CurrPage',  
		pageParamName: 'page',		
		appendParams: '',   
		pageBarMode: 'bound',  
		showIndicator: true,   
		cachePageData: false  
	}
	
	
	var cancelHandler = function(ev) {
		$E.stopEvent(ev);
	}
	
	
	var pageHandler = function(ev, args) {
		$E.stopEvent(ev);
		var target = $E.getTarget(ev);
		args[1].gotoPage(args[0]);
	}
	
	
	var buildBoundPageList = function(pageIndex, pageCount) {
        var l = [];
        var leftStart = 1;
        var leftEnd = 2;
        var mStart = pageIndex - 2;
        var mEnd = pageIndex + 2;
        var rStart = pageCount - 1;
        var rEnd = pageCount;

        if (mStart <= leftEnd) {
            leftStart = 0;
            leftEnd = 0;
            mStart = 1;
        }

        if (mEnd >= rStart) {
            rStart = 0;
            rEnd = 0;
            mEnd = pageCount;
        }

        if (leftEnd > leftStart) {
            for (var i = leftStart; i <= leftEnd; ++i) {
            	l[l.length] = ""+i;
            }

            if ((leftEnd + 1) < mStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }
        }

        for (var i = mStart; i <= mEnd; ++i) {
        	l[l.length] = ""+i;
        }

        if (rEnd > rStart) {
            if ((mEnd + 1) < rStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }

            for (var i = rStart; i <= rEnd; ++i) {
            	l[l.length] = ""+i;
            }
        }
        return l;
	}
	
	
	var buildPageEntry = function(idx, config) {
		var liEl = document.createElement('li');
		if (idx != PAGE_SEPARATOR) {
			$D.addClass(liEl, (idx=='prev')?config.prevPageClass:(idx=='next')?config.nextPageClass:'');
			var aEl = document.createElement('a');
			aEl.setAttribute('title',(idx == 'prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):''+idx);
			aEl.href = buildPageUrl(idx, config) + '&t=' + new Date().getTime();
			aEl.innerHTML = (idx=='prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):idx;
			liEl.appendChild(aEl);
		} else {
			
			liEl.innerHTML = PAGE_SEPARATOR;
		}
		return liEl;
	}
	
	
	var buildPageUrl = function(idx, config) {
		var url = config.pageUrl + (config.pageUrl.lastIndexOf('?')!=-1?'&':'?') + config.pageParamName + '=' + idx;
		if (config.appendParams)
			url += '&' + config.appendParams;
		return url;
	}
	
	
	this.attach = function(pageBarContainer, pageDataContainer, config) {	
		pageBarContainer = $(pageBarContainer);
		pageDataContainer = $(pageDataContainer);
		config = TB.applyIf(config||{}, defConfig);
		
		
		if (config.cachePageData) {
			var pageDataCache = {};
		}
		
		var ulEl = document.createElement('ul');
		pageBarContainer.appendChild(ulEl);
		
		var pageLoadEvent = new YAHOO.util.CustomEvent('pageLoad', null, false, YAHOO.util.CustomEvent.FLAT);
		
		var handle = {};
		
		
		handle.rebuildPageBar = function(pageObj) {
			if (pageObj) {
				this.pageIndex = parseInt(pageObj.PageIndex);
				this.totalCount = parseInt(pageObj.TotalCount);
				this.pageCount = parseInt(pageObj.PageCount);
				this.pageSize = parseInt(pageObj.PageSize);
			}
			
			
			ulEl.innerHTML = '';
			
			
			var list = this.repaginate();

			
			var prevLiEl = buildPageEntry('prev', config);
			if (!this.isPrevPageAvailable()) {
				$D.addClass(prevLiEl, config.noPrevClass);
				$E.on(prevLiEl, 'click', cancelHandler);
			} else {
				$E.on(prevLiEl, 'click', pageHandler, [this.pageIndex-1, this]);
			}
			ulEl.appendChild(prevLiEl);			
			
			
			for (var i = 0; i < list.length; i++) {
				var liEl = buildPageEntry(list[i], config);
				if (list[i] == this.pageIndex) {
					$D.addClass(liEl, config.currPageClass);
					$E.on(liEl, 'click', cancelHandler);
				} else {
					$E.on(liEl, 'click', pageHandler, [list[i], this]);				
				}
				ulEl.appendChild(liEl);
			}
			
			
			var nextLiEl = buildPageEntry('next', config);
			if (!this.isNextPageAvailable()) {
				$D.addClass(nextLiEl, config.noNextClass);
				$E.on(nextLiEl, 'click', cancelHandler);
			} else {
				$E.on(nextLiEl, 'click', pageHandler, [this.pageIndex+1, this]);
			}			
			ulEl.appendChild(nextLiEl);
		}
		
		
		handle.repaginate = function() {
			var mode = config.pageBarMode;
			if (mode == 'bound') {
				
				return buildBoundPageList(parseInt(this.pageIndex), parseInt(this.pageCount));
			} else if (mode == 'line') {
				
				var l = [];
				for (var i = 1; i <= this.pageCount; i++) {
					l.push(i);
				}
				return l;
			} else if (mode == 'eye') {
				
				return [];
			}
		}
		
		
		handle.gotoPage = function(idx) {
			this.disablePageBar();
			if (config.showIndicator) {
				$D.setStyle(pageDataContainer, 'display', 'none');
				var indicator = TB.util.Indicator.attach(pageDataContainer, {message:$M('loading')});
				indicator.show();
			}
			var url = buildPageUrl(idx, config);
			
			
			if (config.cachePageData) {
				if (pageDataCache[url]) {
					handle.showPage(pageDataCache[url]);
					return;
				}
			} 
			
			YAHOO.util.Connect.asyncRequest('GET', url + '&t=' + new Date().getTime(), {
				success: function(req) {
					var resultSet = eval('(' + req.responseText + ')');
					handle.showPage(resultSet.Pagination);
					if (config.cachePageData) {
						pageDataCache[url] = resultSet.Pagination;	
					}
					if (config.showIndicator){
						indicator.hide();
						$D.setStyle(pageDataContainer, 'display', 'block');
					}			
				},
				failure: function(req) {
					if (config.showIndicator){
						$D.setStyle(pageDataContainer, 'display', 'block');						
						indicator.hide();
					}
					handle.rebuildPageBar();					
					alert($M('ajaxError'));
				}
			});	
		}
		
		handle.showPage = function(pageObj) {
			if (pageObj.PageData && YAHOO.lang.isString(pageObj.PageData))
				pageDataContainer.innerHTML = pageObj.PageData;
			this.rebuildPageBar(pageObj);
			pageLoadEvent.fire(pageObj);
		}

		
		handle.isNextPageAvailable = function() {
			return this.pageIndex < this.pageCount;
		}

		
		handle.isPrevPageAvailable = function() {
			return this.pageIndex > 1;
		}
		
		
		handle.disablePageBar = function() {
			$D.addClass(pageBarContainer, 'Disabled');
			
			$E.purgeElement(pageBarContainer, true, 'click');
			var els = TB.common.toArray(pageBarContainer.getElementsByTagName('a'));
			els.forEach(function(el, i){
				$E.on(el, 'click', cancelHandler);
				el.disabled = 1;
			});
		}		
		
		
		handle.onPageLoad = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				pageLoadEvent.subscribe(callback);
		} 
		
		
		handle.setAppendParams = function(params) {
			config.appendParams = params;
		}
		
		return handle;		
	}			
}

TB.util.CountdownTimer = new function() {
	
	var Y = YAHOO.util;
	
	var MINUTE = 60;
	var HOUR = MINUTE * 60;
	var DAY = HOUR*24;	
	
	var defConfig = {
		formatStyle: 'short', 
		formatPattern: '',  
		hideZero: true, 
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

TB.form.TagAssistor = new function() {
	
	
	var defConfig = {
		separator: ' ', 
		selectedClass: 'Selected'
	}
	
	
	var tagExists = function(tagArr, tagEl) {
		return tagArr.indexOf(TB.common.trim(tagEl.innerHTML)) != -1;
	}
	
	var value2TagArray = function(textField, separator) {
		
		var val = textField.value.replace(/\s+/g, ' ').trim();
		if (val.length > 0)
			return val.split(separator);
		else
			return [];
	}
	
	
	this.attach = function(textField, tagsContainer, config) {
		textField = $(textField);
		tagsContainer = $(tagsContainer);
		config = TB.applyIf(config || {}, defConfig);
		
		
		var triggers = TB.common.toArray(tagsContainer.getElementsByTagName('a'));		
		
		
		var clickHandler = function(ev) {
			var tagArray = value2TagArray(textField, config.separator);
			var target = $E.getTarget(ev);
			
			if (tagExists(tagArray, target)) {
				tagArray.remove(TB.common.trim(target.innerHTML));
			} else {
				tagArray.push(TB.common.trim(target.innerHTML));
			}
			updateClass(tagArray);
			textField.value = tagArray.join(config.separator);
		}
		
		var updateClass = function(tagArray) {
			triggers.forEach(function(o, i) {
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				} else {
					$D.removeClass(o, config.selectedClass);
				}						
			})						
		}
		
		var handle = {};
		
		handle.init = function() {
			var tagArray = value2TagArray(textField, config.separator);

			
			triggers.forEach(function(o, i){
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				}
				$E.on(o, 'click', clickHandler);
			});
			
			
			$E.on(textField, 'keyup', function(ev){
				var tagArray = value2TagArray(textField, config.separator);
				updateClass(tagArray);				
			});
		}
		handle.init();
	}
}


TB.form.CheckboxGroup = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		checkAllBox: 'CheckAll',
		checkOnInit: true 
	}
	var getChecked = function(o, i) { return o.checked;	}
	var setChecked = function(o, i) { o.checked = true; }
	var setUnchecked = function(o, i) {	o.checked = false; }
	
	this.attach = function(checkboxGroup, config) {
		config = TB.applyIf(config || {}, defConfig);
			
		var handle = {};
		var onCheckEvent = new Y.CustomEvent('onCheck', handle, false, Y.CustomEvent.FLAT);			
	
		var checkboxes = [];
		if (checkboxGroup) {
			if(checkboxGroup.length)
				checkboxes = TB.common.toArray(checkboxGroup);
			else
				checkboxes[0] = checkboxGroup; 		
		}

		var checkAllBox = $(config.checkAllBox);
		var doCheck = function() {
			var checkedBoxes = checkboxes.filter(getChecked);
			if (checkAllBox && checkAllBox.type == 'checkbox') {
				if (checkedBoxes.length == 0) {
					checkAllBox.checked = 0;
				} else {
					checkAllBox.checked = (checkedBoxes.length == checkboxes.length);
				}
			}
			handle._checkedBoxCount = checkedBoxes.length;
		}		
		var clickHandler = function(ev) {
			var checkbox = $E.getTarget(ev);
			doCheck();
			onCheckEvent.fire(checkbox);
			return true;
		}

		TB.apply(handle, {
			_checkedBoxCount : 0,
			
			onCheck: function(func) {
				onCheckEvent.subscribe(func);
			},
			
			isCheckAll: function() {
				return this._checkedBoxCount == checkboxes.length;				
			},
			isCheckNone: function() {
				return this._checkedBoxCount == 0;				
			},
			isCheckSome: function() {
				return this._checkedBoxCount != 0;
			},
			isCheckSingle: function() {
				return this._checkedBoxCount == 1;
			},
			isCheckMulti: function() {
				return this._checkedBoxCount > 1;
			},			
			toggleCheckAll: function() {
				if (checkboxes.length == 0) {
					if (checkAllBox && checkAllBox.type == 'checkbox') 
						checkAllBox.checked = 0;
					return false;
				}
				var allChecked = checkboxes.every(getChecked);
				checkboxes.forEach(allChecked?setUnchecked:setChecked);
				handle._checkedBoxCount = (allChecked)?0:checkboxes.length;
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			},
			toggleChecked: function(checkbox) {
				checkbox.checked = !checkbox.checked;
				doCheck();
				onCheckEvent.fire(checkbox);
			},
			getCheckedBoxes: function() {
				return checkboxes.filter(getChecked);
			}
		});

		$E.on(checkboxes, 'click', clickHandler);
		if (config.onCheck && YAHOO.lang.isFunction(config.onCheck)) 
			onCheckEvent.subscribe(config.onCheck, handle, true);
		if (checkAllBox) {
			$E.on(checkAllBox, 'click', handle.toggleCheckAll);
		}
		if (config.checkOnInit) {
			doCheck();
			var checkOnInit = function() {
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			}
			setTimeout(checkOnInit, 10);
		}
		return handle;
	}	 
}
