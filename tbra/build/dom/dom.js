/**
 * DOM utilities
 * @TODO
 */
TB.dom = {
	
	/**
	 * insertAfter
	 * @param {Object} node
	 * @param {Object} refNode
	 */
	insertAfter: function(node, refNode) {
		var node = $(node), refNode = $(refNode);
		if (refNode.nextSibling) {
			return refNode.parentNode.insertBefore(node, refNode.nextSibling);
		} else {
			return refNode.parentNode.appendChild(node);
		}
	},
	
	/**
	 * 根据tagName获取最近一个祖先节点
	 * @param {Object} el
	 * @param {Object} tag
	 */
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
	
	/**
	 * 根据class获取最近的一个祖先节点
	 * @param {Object} el
	 * @param {Object} cls
	 */
	getAncestorByClassName: function(el, cls) {
		el = $(el);
		while(el.parentNode) {
			if ($D.hasClass(el, cls)) return el;
			if (el.tagName.toUpperCase == "BODY") return null;
			el = el.parentNode;
		}
		return null;
	}, 
	
	/** 
	 * 获取之后的兄弟节点
	 * @param {Object} el
	 */	
	getNextSibling: function(el) {
		var sibling = $(el).nextSibling;	
		while (sibling.nodeType != 1) {
			sibling = sibling.nextSibling;
		}
		return sibling;
	},
	
	/** 
	 * 获取之前的兄弟节点
	 * @param {Object} el
	 */
	getPreviousSibling: function(el) {
		var sibling = $(el).previousSibling;	
		while (sibling.nodeType != 1) {
			sibling = sibling.previousSibling;
		}
		return sibling;		
	},
	
	/**
	 * 获取表单域的label
	 * @param {Object} el
	 * @param {Object} parent
	 */
	getFieldLabelHtml: function(el, parent) {
		var labels = (parent || el.parentNode).getElementsByTagName('label');
		for (var i = 0; i < labels.length; i++) {
			var forAttr = labels[i].htmlFor || labels[i].getAttribute('for')
			if (forAttr == input.id)
				return labels[i].innerHTML;
		} 		
	},
	
	/**
	 * 获取iframe的document
	 * @param {Object} el
	 */
	getIframeDocument: function(el) {
		var iframe = $(el);
		return iframe.contentWindow? iframe.contentWindow.document : iframe.contentDocument;
	},

	/**
	 * 设置表单的action属性，处理表单中包含同名的field时的情况
	 * @param {Object} form  form 对象
	 * @param {Object} url  action url
	 */
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