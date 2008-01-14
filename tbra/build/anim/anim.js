/**
 * @fileOverview TB.anim 基于YAHOO.util.Anim封装的动画效果
 * @name TB.anim
 * @example
	new TB.anim.Highlight(el, {
		startColor: '#ffff99'
	}).animate();
 */
 
/**
 * @constructor
 * @param {Object} el 应用动画的元素
 * @param {Object} [config]  配置参数
 */	
TB.anim.Highlight = function(el, config) {
	if (!el) return;
	this.init(el, config)
}

/**
 * 默认配置
 */
TB.anim.Highlight.defConfig = {
	/** 加亮开始时设置的背景色*/
	startColor: '#ffff99',
	/** 动画时长 */
	duration: .5,
	/** 是否保持原先的背景 */
	keepBackgroundImage: true
};

TB.anim.Highlight.prototype.init = function(el, config) {
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
	
	/**
	 * onComplete 回调，直接引用被封装的 Anim 对象的 onComplete 事件
	 */	
	this.onComplete = anim.onComplete;
	
	/**
	 * 执行动画
	 */
	this.animate = function() {
		$D.setStyle(el, 'background-image', 'none');
		anim.animate();
	}
};

