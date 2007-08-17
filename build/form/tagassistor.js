/**
 * @author zexin.zhaozx
 */
TB.form.TagAssistor = new function() {
	
	/**
	 * 默认配置参数
	 */
	var defConfig = {
		separator: ' ', /*默认分隔符是空格*/
		selectedClass: 'Selected'
	}
	
	/**
	 * 判断选中的tag是否在array中存在，如果存在返回true，反之false。
	 * @param {Object} tagArr
	 * @param {Object} tagEl
	 */
	var tagExists = function(tagArr, tagEl) {
		return tagArr.indexOf(TB.common.trim(tagEl.innerHTML)) != -1;
	}
	
	var value2TagArray = function(textField, separator) {
		/*将连续的空格替换为单个空格，并去除首尾的空格*/
		var val = textField.value.replace(/\s+/g, ' ').trim();
		if (val.length > 0)
			return val.split(separator);
		else
			return [];
	}
	
	/**
	 * 指派给输入元素和备选tag的容器
	 * @param {Object} textField 必须是一个<input>或者<textarea>
	 * @param {Object} tagsContainer 放置备选tag的element，可能是一个ul或dl
	 * @param {Object} config 配置参数
	 */
	this.attach = function(textField, tagsContainer, config) {
		textField = $(textField);
		tagsContainer = $(tagsContainer);
		config = TB.applyIf(config || {}, defConfig);
		
		
		var triggers = TB.common.toArray(tagsContainer.getElementsByTagName('a'));		
		
		/**
		 * 点击备选tag的事件处理程序
		 * @param {Object} ev
		 */
		var clickHandler = function(ev) {
			var tagArray = value2TagArray(textField, config.separator);
			var target = $E.getTarget(ev);
			/* tag已选中 */
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
		/**
		 * 初始化的一些工作
		 */
		handle.init = function() {
			var tagArray = value2TagArray(textField, config.separator);

			/* 给每个	备选tag的<a> 注册事件处理程序 */
			triggers.forEach(function(o, i){
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				}
				$E.on(o, 'click', clickHandler);
			});
			
			/* 监测每次的键盘动作，如果发现匹配或者不匹配的tag文字，增加或取消着重效果 */
			$E.on(textField, 'keyup', function(ev){
				var tagArray = value2TagArray(textField, config.separator);
				updateClass(tagArray);				
			});
		}
		handle.init();
	}
}
