/**
 * @author zexin.zhaozx
 */

(function() {
	var ua = navigator.userAgent.toLowerCase();
	var _isOpera = ua.indexOf('opera') != -1,
		_isSafari = ua.indexOf('safari') != -1,
		_isGecko = !_isOpera && !_isSafari && ua.indexOf('gecko') > -1,
		_isIE = !_isOpera && ua.indexOf('msie') != -1, 
		_isIE6 = !_isOpera && ua.indexOf('msie 6') != -1,
		_isIE7 = !_isOpera && ua.indexOf('msie 7') != -1;
	TB.bom = {
		isOpera: _isOpera,
		isSafari: _isSafari,
		isGecko: _isGecko,
		isIE: _isIE,
		isIE6: _isIE6,
		isIE7: _isIE7,
		/**
	     * 获取cookie
	     * @method getCookie
	     * @param {String} name cookie名称
	     * @return {String} cookie 的值或者空字符串
	     */	
		getCookie: function(name) {
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]) : '';
		},
	
	    /**
	     * 设置cookie
	     * @method setCookie
	     * @param {String} name cookie名称
		 * @param {String} value cookie的值
	     * @return {String} cookie 的值或者空字符串
	     */	
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
	
		/**
		 * 删除cookie
		 * @method removeCookie
		 * @param {Object} name
		 */
		removeCookie: function(name) {
			setCookie(name, '', -1);
		},
	
		/**
		 * 提取当前hostname的domain.domain;
		 * 默认返回当前hostname的第一层父级域，如 www.xyx.taobao.com -> xyz.taoboa.com，store.taobao.com - > taobao.com
		 * 可传递一个参数n，指定取n级的父级域，如n=2, 则www.xyx.taobao.com -> taoboa.com
		 * 如果hostname本身只有二级域，或参数n过大，则总是返回二级域
		 * 
		 * 注意：类似sina.com.cn这样带国家区域的域名可能有误。
		 * 
		 * @method pickDocumentDomain
		 * @return expected document.domain value
		 */
		pickDocumentDomain: function() {
			var da = location.hostname.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		}
	}
})();