/**
 * @author zexin.zhaozx
 */
TB.form.CheckboxGroup = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		checkAllBox: 'CheckAll',
		checkOnInit: true /* 初始化时是否预处理 */
	}
	var getChecked = function(o, i) { return o.checked;	}
	var setChecked = function(o, i) { o.checked = true; }
	var setUnchecked = function(o, i) {	o.checked = false; }
	
	this.attach = function(checkboxGroup, config) {
		config = TB.applyIf(config || {}, defConfig);
		//返回给调用者的控制器，只包含对调用者可见的方法/属性	
		var handle = {};
		var onCheckEvent = new Y.CustomEvent('onCheck', handle, false, Y.CustomEvent.FLAT);			
	
		var checkboxes = [];
		if (checkboxGroup) {
			if(checkboxGroup.length)
				checkboxes = TB.common.toArray(checkboxGroup);
			else
				checkboxes[0] = checkboxGroup; //如果只有一个checkbox		
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