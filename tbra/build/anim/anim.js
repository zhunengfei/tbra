/**
 * 加亮效果
 * 封装一个 YAHOO.util.ColorAnim
 * @namespace TB.anim
 * @class Highlight 
 * @param {Object} el
 * @param {Object} config
 */	
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

