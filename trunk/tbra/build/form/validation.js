TB.form.Validation = new function() {
	var Y = YAHOO;
	var _ = this;

	//默认设置
	var defConfig = {
		useTitle: true,						//使用表单域的title信息作为提示内容
		immediate: false,					//是否即时校验，通过注册表单域的 onblur 事件
		focusOnError: true,					//选中首个校验失败的表单域
		passedClass: 'tb-fv-passed',		//校验成功给表单增加的 className
		failedClass: 'tb-fv-failed',		//校验失败给表单增加的 className
		onFieldValidate: false,				//表单域校验后的回调函数
		beforeValidate: false,				//校验前的回调函数
		onValidate: false,					//表单校验后的回调函数
		advice: 'default',					//错误信息通知类型
		adviceClass: 'tb-fv-advice',		//校验信息通知层的 class
		adviceContainerClass: null,			//校验信息通知层的父容器的 class， 有时通知层和表单域不是同一个parentNode
		adviceMsgClass: 'tb-fv-advicemsg',	//校验信息通知层中放信息的标签 class，有时通知层可能包含其他标签
		attachEvent: true					//是否注册 onSubmit 和 onReset 事件，默认为 true ，只有静态调用时为false
	};

	//校验器对象
	var Validator = function(clazz, warnMsg, test, rules) {
		if (Y.lang.isFunction(test)) { //第三个参数是校验方法，第四个参数是校验规则
			this._test = test;
			this._rules = rules;
		} else if (Y.lang.isObject(test)) { //第三个参数就是校验规则
			this._rules = test;
		}
		this.warnMsg = warnMsg || 'Validation failed!';
	}
	
	//扩展校验器对象原型
	Y.lang.augmentObject(Validator.prototype, {
		_test: function() {return true;},
		_testRules: function(val, el) {
			var ra = [];
			for (var r in this._rules) {
				if (_.METHODS[r] && !_.METHODS[r](val, el, this._rules[r])) {
					return false;
				}
			}
			return true;
		},
		test: function(val, el) {
			return this._test(val, el) && this._testRules(val,el);
		}
	});


	_.ADVISORS = {
		'default': {
			__advices: {},
			getAdvice: function(el) {
				var id = $D.generateId(el, 'fv:field'); //检查表单域是否拥有id属性，如果没有，给其设置id (格式为 fv:field0, fv:field1....)，如果本身有id，返回该id.
				var advice;
				//首先从cache中寻找
				if (id in this.__advices)
					advice = this.__advices[id];
				else {
					var aid = (el.id || el.name) + '-advice'; //拼出advice的id
					advice = $(aid); //如果页面中存在该id的<div>，使用其作为advice
					if (!advice) {
						//如果设置了 adviceContainerClass，根据该class找到父容器，因为表单域可能存在多层嵌套(在<table>或多层<div>下)，而advice可能要求显示在父容器指定处
						var container = this.adviceContainerClass? $D.getAncestorByClassName(el, this.adviceContainerClass) : el.parentNode;
						advice = $D.getElementsByClassName(this.adviceClass, 'div', container)[0];
						if (advice && advice.id && advice.id != aid) { advice = null; } //两个表单域同parentNode时，避免覆盖
						if (!advice) {
							//创建advice
							advice = document.createElement('div');
							$D.addClass(advice, this.adviceClass);
							if (this.adviceContainerClass) {
								container.appendChild(el);
							} else {
								//将advice显示在紧随表单域的后面
								switch (el.type.toLowerCase()) {
									//checkbox 和 radio 显示在父元素的最后面
									case 'checkbox':
									case 'radio':
										el.parentNode.appendChild(advice, el);
										break;
									default:
										TB.dom.insertAfter(advice, el);
								}
							}
						}
						advice.id = aid;
					}
					
					this.__advices[id] = advice;
				}
				return advice;				
			},
			doFieldAdvice: function(ret, el, warnMsg) {
				var advice = this.getAdvice(el);
				if (!advice) return;
				if (!ret) {
					var msgbox = advice;
					//如果指定了放消息提示的容器的class，则再从advice层中找到指定的容器
					if (this.adviceMsgClass)
						msgbox = $D.getElementsByClassName(this.adviceMsgClass, '*', advice)[0] || advice;
					
					msgbox.innerHTML = warnMsg;
					$D.setStyle(advice, 'display', '');
				} else {
					$D.setStyle(advice, 'display', 'none');
				}
			},
			showAdvices: function(ret) {
				return;
			},
			resetAdvices: function() {
				for (var a in this.__advices) {
					$D.setStyle(this.__advices[a], 'display', 'none');
				}
			}
		},
		'alert': {
			__msgs: [],
			doFieldAdvice: function(ret, el, warnMsg) {
				if (!ret) {
					if (this.immediate) 
						alert(warnMsg);
					else
						this.__msgs[this.__msgs.length] = warnMsg;
				}
			},
			showAdvices: function(ret) {
				if (!ret && !this.immediate) {
					alert(' * ' + this.__msgs.join('\n * '));
				}
				this.resetAdvices();
			},
			resetAdvices: function() {
				this.__msgs.length = 0;	
			}
		}
	}

	_.METHODS = {
		//为空
		isEmpty: function(val, el) {return ((val == null) || (val.length == 0))},
		//不为空
		notEmpty: function(val, el) {return !((val == null) || (val.length == 0))},
		//正则表达式
		regexp : function(val,el,opt) {return opt.test(val)},
		//最小长度
		minLength : function(val,el,opt) {return val.length >= opt},
		//最大长度
		maxLength : function(val,el,opt) {return val.length <= opt},
		//最小值
		minValue : function(val,el,opt) {return val >= parseFloat(opt)}, 
		//最大值
		maxValue : function(val,el,opt) {return val <= parseFloat(opt)},
		//不属于其中
		notOneOf : function(val,el,opt) {return TB.common.toArray(opt).every(function(v) {
			return val != v;
		})},
		//其中之一
		oneOf : function(val,el,opt) {return TB.common.toArray(opt).some(function(v) {
			return val == v;
		})},
		//等于
		equal : function(val,el,opt) {return val == opt},
		//不等于
		notEqual : function(val,el,opt) {return val != opt},
		//等于某个表单域的值
		equalToField : function(val,el,opt) {return val == $(opt).value},
		//不等于某个表单域的值
		notEqualToField : function(val,el,opt) {return val != $(opt).value}
	}

	/**
	 * 校验器Map
	 */
	_.VALIDATORS = {};

	/**
	 * 表单域是否可见 (style.display != none)
	 */
	var _isVisible = function(el) {
		while(el.tagName != 'BODY') {
			if($D.getStyle(el, 'display') == 'none') return false;
			el = el.parentNode;
		}
		return true;
	}
	
	/**
	 * 取得可见且具备校验hook(class=fv:xxx)的表单域集合
	 */
	var _getElements = function(frm) {
		var tags = ['INPUT', 'SELECT', 'TEXTAREA'];
		return $D.getElementsBy(function(f) {
			return $D.hasClass(f, 'fv:force') || ((tags.indexOf(f.tagName) != -1) && _isVHook(f.className) && _isVisible(f));
		}, '*', frm);
	}

	/**
	 * className 中是否包含 fv:xxx 形式的class
	 */
	var _isVHook = function(c) {
		return c.indexOf('fv:') != -1;		
	}

	/**
	 * 静态的检验函数
	 */
	var _validate = function(frm, handle) {
		var els = _getElements(frm);
		var result = $D.batch(els, _validateField, handle).every(function(r){return r});
		handle.showAdvices(result);

		//如果设置 focusOnError=true， 选中第一个校验失败表单域
		if (!result && handle.focusOnError) {
			var fel = $D.getElementsByClassName(handle.failedClass, '*', frm)[0];
			try {
				fel.focus();
				fel.select(); //select 方法对<select>无效
			} catch (e) {}
		}

		//执行整个表单的校验后回调函数
		if (handle.onValidate) {
			handle.onValidate(result, frm);
		}
		return result;
	}
	
	var _validateField = function(el, handle) {
		var hooks = el.className.split(/\s+/).filter(_isVHook);  //得到所有fv:xxx hook
		var result = hooks.every(function(h) {
			//根据hook取得对应校验器对象
			var validator = (handle.validators)? (handle.validators[h] || _.VALIDATORS[h]) : _.VALIDATORS[h]; 
			if (!validator) return true;
			//执行校验，并得到结果
			if (el.getAttribute('fv:params')) {
				validator = Y.lang.merge(validator, {
					_rules: el.getAttribute('fv:params').toQueryParams()
				});
			}
			var ret = validator.test(el.value, el);
			var msg; 
			if (!ret) {
				//取得提示消息
				msg = handle.useTitle ? (el.title || validator.warnMsg) : validator.warnMsg;
				$D.removeClass(el, handle.passedClass);
				$D.addClass(el, handle.failedClass);
			} else {
				$D.removeClass(el, handle.failedClass);
				$D.addClass(el, handle.passedClass);
			}

			handle.doFieldAdvice(ret, el, msg);
			return ret;
		}, _);
		//执行表单域校验后的回调函数
		if (handle.onFieldValidate) {
			handle.onFieldValidate(result, el);
		} 
		return result;
	}

	var _reset = function(frm, handle) {
		var els = _getElements(frm);
		$D.removeClass(els, handle.failedClass);
		$D.removeClass(els, handle.passedClass);
		if (handle.resetAdvices)
			handle.resetAdvices();
	}

	/**
	 * 静态调用
	 * @param {Object} frm
	 * @param {Object} config
	 */
	_.validate = function(frm, config) {
		return this.attach(frm, Y.lang.merge(config || {}, {
			attachEvent: false,
			immediate: false
		})).validate();
	}

	/**
	 * 增加全局校验器
	 */
	_.add = function(clazz, warnMsg, test, rules) {
		this.validators[clazz] = new Validator(clazz, warnMsg, test, rules);
	}

	/**
	 * 批量增加全局校验器
	 */
	_.addAll = function(validators) {
		var vs = {};
		validators.forEach(function(v) {
			vs[v[0]] = new Validator(v[0], v[1], v[2], (v.length > 3 ? v[3] : {}));
		});
		Y.lang.augmentObject(_.VALIDATORS, vs);	
	}

	/**
	 * 给指定表单增加校验功能，通过注册表单的 onsubmit 事件，在表单提交时执行校验
	 * 如果使用脚本调用 form.submit() 方法，那么 onsubmit 事件不会触发，需要手工先调用
	 *  TB.form.Validation.validate(form);
	 */
	_.attach = function(frm, config) {
		frm = $(frm);
		var handle = Y.lang.merge(defConfig, config||{});
		handle.form = frm;
		handle.validators = {};

		if (Y.lang.isString(handle.advice)) {
			var type = (handle.advice in _.ADVISORS)? handle.advice : 'default';
			Y.lang.augmentObject(handle, _.ADVISORS[type]);
		} else {
			Y.lang.augmentObject(handle, handle.advice);
		}
		
		var onSubmit = function(ev) {
			if (!handle.validate())
				$E.stopEvent(ev);
		}

		var onReset = function(ev) {
			handle.reset();
		}
	
		handle.add = function(clazz, warnMsg, test, rules) {
			this.validators[clazz] = new Validator(clazz, warnMsg, test, rules);
		}

		handle.addAll = function(validators) {
			var vs = {};
			validators.forEach(function(v) {
				vs[v[0]] = new Validator(v[0], v[1], v[2], (v.length > 3 ? v[3] : {}));
			});
			Y.lang.augmentObject(this.validators, vs);
		}

		handle.reset = function() {
			_reset(frm, handle);
		}
		
		handle.validate = function(){
			if (Y.lang.isFunction(handle.beforeValidate) && !handle.beforeValidate(frm))
				return false;
			else
				return _validate(frm, handle);
		};

		if (handle.attachEvent) {
			$E.on(frm, 'submit', onSubmit);
			$E.on(frm, 'reset', onReset);
		}
		
		if (handle.immediate) {
			var els = _getElements(frm);
			$E.on(els, 'blur', function() {
				_validateField(this, handle);
			});
		}

		return handle;
	}

	var _isEmpty = _.METHODS['isEmpty'];

	/** 
	 * 批量增加默认的校验器
	 */
	_.addAll([
		['fv:required', '请输入内容！', function(v) {
				return !_isEmpty(v);
		}],
		//数字
		['fv:number', '请输入一个有效的数字！', function(v) {
			return _isEmpty(v) || (!isNaN(v) && !/^\s+$/.test(v));
		}],
		//整数
		['fv:digits', '请输入有效的整数！', function(v) {
			return _isEmpty(v) ||  !/[^\d]/.test(v);
		}],
		//字母
		['fv:alpha', '请输入英文字母！', function (v) {
			return _isEmpty(v) ||  /^[a-zA-Z]+$/.test(v);
		}],
		//数字及字母
		['fv:alphanum', '请输入英文字母或数字！', function(v) {
			return _isEmpty(v) ||  !/\W/.test(v);
		}],
		//常用日期格式 yyyy-MM-dd， 不校验日期合法性
		['fv:date', '请输入有效的时间！', function(v) {
			return _isEmpty(v) || /^\d{4}-(?:[0]?)\d{1,2}-(?:[0]?)\d{1,2}$/.test(v);
		}],
		//中国手机号码
		['fv:mobile', '请输入有效的手机号码！', function(v) {
			return _isEmpty(v) || /^(86)*0*1[3|5]\d{9}$/.test(v);
		}],
		//中国邮编
		['fv:postcode', '请输入有效的邮政编码！', function(v) {
			return _isEmpty(v) || /^[1-9]{1}(\d+){5}$/.test(v);
		}],
		//Email地址
		['fv:email', '请输入有效的Email地址！', function (v) {
			return _isEmpty(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v);
		}],
		//URL
		['fv:url', '请输入有效的URL！', function(v) {
			return _isEmpty(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v);
		}],
		//是否选择 for <select>
		['fv:selection', '请选择一个选项！', function(v, el){
			return el.options ? el.selectedIndex > 0 : !_isEmpty(v);
		}],
		//是否选定 for <input type=radio|checkbox />
		['fv:oneRequired', '请选择其中一个选项！', function (v,el) {
			var name = el.name;
			var group = el.form.elements[name];
			if (group.length) {
				return TB.common.toArray(group).some(function(o) {
					return o.checked;
				});
			} else {
				return group.checked;
			}
		}]
	]);

}

