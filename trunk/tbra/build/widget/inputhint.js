/**
 * @author zexin.zhaozx
 */
TB.widget.InputHint = new function() {
	var defConfig = {
		hintMessage: '',
		hintClass: 'tb-input-hint',
		appearOnce: false
	};
	var EMPTY_PATTERN = /^\s*$/;
	
	var focusHandler = function(ev, handle) {
		if (!handle.disabled)
			handle.disappear();
	}
	var blurHandler = function(ev, handle) {
		if (!handle.disabled)
			handle.appear();
	}
	
	this.decorate = function(inputField, config) {
		inputField = $(inputField);
		config = TB.applyIf(config || {}, defConfig);
		var hintMessage = config.hintMessage || inputField.title;
		var handle = {};
		handle.disabled = false;
		
		handle.disappear = function() {
			if (hintMessage == inputField.value) {
				inputField.value = '';
				$D.removeClass(inputField, config.hintClass);
			}
		};
		
		handle.appear = function() {
			if (EMPTY_PATTERN.test(inputField.value) || hintMessage == inputField.value) {
				$D.addClass(inputField, config.hintClass);
				inputField.value = hintMessage;				
			}
		}
		
		handle.purge = function() {
			this.disappear();
			$E.removeListener(inputField, 'focus', focusHandler);
			$E.removeListener(inputField, 'drop', focusHandler);
			$E.removeListener(inputField, 'blur', blurHandler);
		}
		
		/* 初始化 */
		if (!inputField.title)
			inputField.setAttribute("title", hintMessage);
		$E.on(inputField, 'focus', focusHandler, handle);
		$E.on(inputField, 'drop', focusHandler, handle); /* for ie/safari */
		
		if (!config.appearOnce)
			$E.on(inputField, 'blur', blurHandler, handle);
		
		/* 默认先显示 */
		handle.appear();
		return handle;
	}
}