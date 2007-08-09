/**
 * 评分组件
 * 需要star-rating.css
 */

TB.widget.SimpleRating = new function() {
	
	var defConfig = {
		rateUrl: '',  /* 评分数据发送给的URL */
		rateParams: '',  /* 其他参数，格式k1=v1&k2=v2 */
		scoreParamName: 'score', /* 评论参数名 */
		topScore: 5,  /* 最高分 */
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
		ratingContainer = $(ratingContainer);  /* 一个<ul> */
		config = TB.applyIf(config || {}, defConfig);
		var currentRatingLi = $D.getElementsByClassName(config.currentRatingClass, 'li', ratingContainer)[0];
		
		var onRateEvent = new YAHOO.util.CustomEvent('onRate', null, false, YAHOO.util.CustomEvent.FLAT);
		if (config.onRate)
			onRateEvent.subscribe(config.onRate);
		var handle = {};
		
		handle.init = function(avg) {
			/* 检查看是否需要显示当前的分数 */
			updateCurrentRating(currentRatingLi, avg, config);
		}
		
		handle.update = function(ret) {
			if (ret && ret.Average && currentRatingLi) {
				updateCurrentRating(currentRatingLi, ret.Average, config);
			}
			/* 只能评分一次 */
			$E.purgeElement(ratingContainer, true, 'click');
			/* 移除其他的li */
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