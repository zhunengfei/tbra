/**
 * TB Common function
 */
TB.common = {
	/**
	 * 移除文字前后的空白字符
	 * 
	 * @method trim
	 * @param {String} str 
	 * @deprecated 使用String.prototpye.trim()来替代
	 */
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,''); 
	},

	/**
	 * 编码HTML (from prototype framework 1.4)
	 * @method escapeHTML
	 * @param {Object} str
	 */
	escapeHTML: function(str) {
		var div = document.createElement('div');
		var text = document.createTextNode(str);
		div.appendChild(text);
		return div.innerHTML;
	},

	/**
	 * 解码HTML (from prototype framework 1.4)
	 * @method unescapeHTML
	 * @param {Object} str
	 */
	unescapeHTML: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	},
	
	/**
	 * 删除字符串中的(x)html中的标签信息
	 * @method stripTags
	 * @param {Object} str
	 */
	stripTags: function(str) {
    	return str.replace(/<\/?[^>]+>/gi, '');
  	},

	/**
	 * 转换 NodeList 或者 arguments 为数组
	 * @method toArray
	 * @param {Object} list
	 * @param {Object} start
	 * @return {Array} 转换后的数组，如果start大于list的容量，返回空数组
	 */
	toArray : function(list, start) {
		var array = [];
		for (var i = start || 0; i < list.length; i++) {
			array[array.length] = list[i];
		}
		return array;
	},

	/**
	 * 复制配置属性给某对象，如果对象已存在该配置，不进行覆盖
	 * @param {Object} obj 目标对象 
	 * @param {Object} config 包含属性/参数 对象
	 */	
	applyIf: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config) {
				if (!YAHOO.lang.hasOwnProperty(obj, p))
            		obj[p] = config[p];
			}
    	}
    	return obj;
	},

	/**
	 * 复制配置属性给某对象，如果对象已存在该配置，将被覆盖为新属性
	 * @param {Object} obj 目标对象 
	 * @param {Object} config 包含属性/参数 对象
	 */		
	apply: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config)
				obj[p] = config[p];
		}
		return obj;
	},
	
	/**
	 * 格式化字符串
	 * eg:
	 * 	TB.common.formatMessage('{0}天有{1}个小时', [1, 24]) 
	 *  or
	 *  TB.common.formatMessage('{day}天有{hour}个小时', {day:1, hour:24}}
	 * @param {Object} msg
	 * @param {Object} values
	 */
	formatMessage: function(msg, values, filter) {
		var pattern = /\{([\w-]+)?\}/g;
		return function(msg, values, filter) {
			return msg.replace(pattern, function(match, key) {
				return filter?filter(values[key], key):values[key];
			});	
		}
	}(),
	
	/**
	 * 解析URI
	 */
	parseUri: (function() {
		var keys = ['source', 'prePath', 'scheme', 'username', 'password', 'host', 'port', 'path', 'dir', 'file', 'query', 'fragment'];
		var re = /^((?:([^:\/?#.]+):)?(?:\/\/)?(?:([^:@]*):?([^:@]*)?@)?([^:\/?#]*)(?::(\d*))?)((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?/;	
		return function(sourceUri) {
			var uri = {};
			var uriParts = re.exec(sourceUri);
			for(var i = 0; i < uriParts.length; ++i){
				uri[keys[i]] = (uriParts[i] ? uriParts[i] : '');
			}
			return uri;
		}
	})()
};

TB.applyIf = TB.common.applyIf;
TB.apply = TB.common.apply;