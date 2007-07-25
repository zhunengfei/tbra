/**
 * @author zexin.zhaozx
 */
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

		//初始化
		inputField.setAttribute("title", hintMessage);
		$E.on(inputField, 'focus', focusHandler, handle);
		$E.on(inputField, 'drop', focusHandler, handle); //for ie/safari
		
		if (!config.appearOnce)
			$E.on(inputField, 'blur', blurHandler, handle);
		
		//默认先显示
		handle.appear();
		return handle;
	}
}