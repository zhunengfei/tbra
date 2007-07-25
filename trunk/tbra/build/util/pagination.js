TB.util.Pagination = new function() {
	
	var PAGE_SEPARATOR = '...'; //页省略符号	

	//默认配置参数	
	var defConfig = {
		pageUrl: '',
		prevPageClass: 'PrevPage',  //上一页<li>的className
		noPrevClass: 'NoPrev',       //上一页不可用时<li>的className
		prevPageText: 'prevPageText',
		nextPageClass: 'NextPage',  //下一页<li>的className
		nextPageText: 'nextPageText',
		noNextClass: 'NoNext',       //下一页不可用时<li>的className		
		currPageClass: 'CurrPage',  //当前页<li>的className
		pageParamName: 'page',		//标识页数的参数名
		appendParams: '',   //附带其他的参数
		pageBarMode: 'bound',  //分页条的样式  bound | eye | line
		showIndicator: true,   //显示加载提示图标,
		cachePageData: false  //缓存分页数据
	}
	
	/**
	 * 停止click事件传播，用于上/下一页不可用时，或者分页数据加载中时所有分页点都被禁用时
	 * @param {Object} ev  事件对象
	 */
	var cancelHandler = function(ev) {
		$E.stopEvent(ev);
	}
	
	/**
	 * 分页点击事件处理程序
	 * @param {Object} ev  	 事件对象
	 * @param {Object} args  参数格式为 [pageIndex, handle]
	 */
	var pageHandler = function(ev, args) {
		$E.stopEvent(ev);
		var target = $E.getTarget(ev);
		args[1].gotoPage(args[0]);
	}
	
	/**
	 * 构造"bound"形式的分页列表
	 * @param {Object} pageIndex  当前页
	 * @param {Object} pageCount  总页数
	 */
	var buildBoundPageList = function(pageIndex, pageCount) {
        var l = [];
        var leftStart = 1;
        var leftEnd = 2;
        var mStart = pageIndex - 2;
        var mEnd = pageIndex + 2;
        var rStart = pageCount - 1;
        var rEnd = pageCount;

        if (mStart <= leftEnd) {
            leftStart = 0;
            leftEnd = 0;
            mStart = 1;
        }

        if (mEnd >= rStart) {
            rStart = 0;
            rEnd = 0;
            mEnd = pageCount;
        }

        if (leftEnd > leftStart) {
            for (var i = leftStart; i <= leftEnd; ++i) {
            	l[l.length] = ""+i;
            }

            if ((leftEnd + 1) < mStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }
        }

        for (var i = mStart; i <= mEnd; ++i) {
        	l[l.length] = ""+i;
        }

        if (rEnd > rStart) {
            if ((mEnd + 1) < rStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }

            for (var i = rStart; i <= rEnd; ++i) {
            	l[l.length] = ""+i;
            }
        }
        return l;
	}
	
	/**
	 * 创建包括页符的<li> element
	 * @param {Object} idx   页符
	 * @param {Object} config
	 */
	var buildPageEntry = function(idx, config) {
		var liEl = document.createElement('li');
		if (idx != PAGE_SEPARATOR) {
			$D.addClass(liEl, (idx=='prev')?config.prevPageClass:(idx=='next')?config.nextPageClass:'');
			var aEl = document.createElement('a');
			aEl.setAttribute('title',(idx == 'prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):''+idx);
			aEl.href = buildPageUrl(idx, config) + '&t=' + new Date().getTime();
			aEl.innerHTML = (idx=='prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):idx;
			liEl.appendChild(aEl);
		} else {
			//如果是分页省略分隔符，直接显示省略号
			liEl.innerHTML = PAGE_SEPARATOR;
		}
		return liEl;
	}
	
	/**
	 * 构造页标Url
	 * @param {Object} idx
	 * @param {Object} config
	 */
	var buildPageUrl = function(idx, config) {
		var url = config.pageUrl + (config.pageUrl.lastIndexOf('?')!=-1?'&':'?') + config.pageParamName + '=' + idx;
		if (config.appendParams)
			url += '&' + config.appendParams;
		return url;
	}
	
	/**
	 * 接口函数
	 * @param {Object} pageBarContainer 分页条容器
	 * @param {Object} pageDataContainer  页面数据容器
	 * @param {Object} config 配置参数
	 */
	this.attach = function(pageBarContainer, pageDataContainer, config) {	
		pageBarContainer = $(pageBarContainer);
		pageDataContainer = $(pageDataContainer);
		config = TB.applyIf(config||{}, defConfig);
		
		//数据缓存对象
		if (config.cachePageData) {
			var pageDataCache = {};
		}
		
		var ulEl = document.createElement('ul');
		pageBarContainer.appendChild(ulEl);
		
		var pageLoadEvent = new YAHOO.util.CustomEvent('pageLoad', null, false, YAHOO.util.CustomEvent.FLAT);
		
		var handle = {};
		
		/**
		 * 重新整理分页符
		 * @param {Object} pageObj  JSON格式的分页数据
		 * 
		 * 数据格式
		 * {
		 * 		"Pagination": {
		 * 			"PageIndex": 1, //当前页
		 * 			"PageCount" : 3 , //总页数
		 * 			"PageSize" : 100, //页面条目数
		 * 			"TotalCount" : 300, //条目总数（可选）
		 * 			"PageData" : "<html>" //编码后的html代码
		 * 		} 
		 * 	}
		 */
		handle.rebuildPageBar = function(pageObj) {
			if (pageObj) {
				this.pageIndex = parseInt(pageObj.PageIndex);
				this.totalCount = parseInt(pageObj.TotalCount);
				this.pageCount = parseInt(pageObj.PageCount);
				this.pageSize = parseInt(pageObj.PageSize);
			}
			
			//清除page UL 内容并重新构造
			ulEl.innerHTML = '';
			
			//获取分页页码列表
			var list = this.repaginate();

			//上一页导航单元
			var prevLiEl = buildPageEntry('prev', config);
			if (!this.isPrevPageAvailable()) {
				$D.addClass(prevLiEl, config.noPrevClass);
				$E.on(prevLiEl, 'click', cancelHandler);
			} else {
				$E.on(prevLiEl, 'click', pageHandler, [this.pageIndex-1, this]);
			}
			ulEl.appendChild(prevLiEl);			
			
			//循环构造分页符
			for (var i = 0; i < list.length; i++) {
				var liEl = buildPageEntry(list[i], config);
				if (list[i] == this.pageIndex) {
					$D.addClass(liEl, config.currPageClass);
					$E.on(liEl, 'click', cancelHandler);
				} else {
					$E.on(liEl, 'click', pageHandler, [list[i], this]);				
				}
				ulEl.appendChild(liEl);
			}
			
			//下一页导航单元
			var nextLiEl = buildPageEntry('next', config);
			if (!this.isNextPageAvailable()) {
				$D.addClass(nextLiEl, config.noNextClass);
				$E.on(nextLiEl, 'click', cancelHandler);
			} else {
				$E.on(nextLiEl, 'click', pageHandler, [this.pageIndex+1, this]);
			}			
			ulEl.appendChild(nextLiEl);
		}
		
		/**
		 * 构造分页页码表
		 */
		handle.repaginate = function() {
			var mode = config.pageBarMode;
			if (mode == 'bound') {
				//返回 bound 形式的分页条，间断性的显示页码
				return buildBoundPageList(parseInt(this.pageIndex), parseInt(this.pageCount));
			} else if (mode == 'line') {
				//返回 line 形式的分页条，显示所有页码
				var l = [];
				for (var i = 1; i <= this.pageCount; i++) {
					l.push(i);
				}
				return l;
			} else if (mode == 'eye') {
				//返回 eye 形式的分页条,只有向前向后的分页形式
				return [];
			}
		}
		
		/**
		 * 显示指定页码的数据
		 * @param {Object} idx  页码
		 */
		handle.gotoPage = function(idx) {
			this.disablePageBar();
			if (config.showIndicator) {
				$D.setStyle(pageDataContainer, 'display', 'none');
				var indicator = TB.util.Indicator.attach(pageDataContainer, {message:$M('loading')});
				indicator.show();
			}
			var url = buildPageUrl(idx, config);
			
			//如果设置了数据缓存，而发现缓存数据已存在，直接显示缓存中的数据
			if (config.cachePageData) {
				if (pageDataCache[url]) {
					handle.showPage(pageDataCache[url]);
					return;
				}
			} 
			
			YAHOO.util.Connect.asyncRequest('GET', url + '&t=' + new Date().getTime(), {
				success: function(req) {
					var resultSet = eval('(' + req.responseText + ')');
					handle.showPage(resultSet.Pagination);
					if (config.cachePageData) {
						pageDataCache[url] = resultSet.Pagination;	
					}
					if (config.showIndicator){
						indicator.hide();
						$D.setStyle(pageDataContainer, 'display', 'block');
					}			
				},
				failure: function(req) {
					if (config.showIndicator){
						$D.setStyle(pageDataContainer, 'display', 'block');						
						indicator.hide();
					}
					handle.rebuildPageBar();					
					alert($M('ajaxError'));
				}
			});	
		}
		
		handle.showPage = function(pageObj) {
			if (pageObj.PageData && YAHOO.lang.isString(pageObj.PageData))
				pageDataContainer.innerHTML = pageObj.PageData;
			this.rebuildPageBar(pageObj);
			pageLoadEvent.fire(pageObj);
		}

		/**
		 * 存在下一页？
		 */
		handle.isNextPageAvailable = function() {
			return this.pageIndex < this.pageCount;
		}

		/**
		 * 存在上一页?
		 */
		handle.isPrevPageAvailable = function() {
			return this.pageIndex > 1;
		}
		
		/**
		 * 禁用分页条，当用户点击某个分页符时，禁用整个分页条中所有<a>的点击操作，并设置其disabled=1
		 * @param {Object} bar
		 */
		handle.disablePageBar = function() {
			$D.addClass(pageBarContainer, 'Disabled');
			//先重置所有onclick event handler
			$E.purgeElement(pageBarContainer, true, 'click');
			var els = TB.common.toArray(pageBarContainer.getElementsByTagName('a'));
			els.forEach(function(el, i){
				$E.on(el, 'click', cancelHandler);
				el.disabled = 1;
			});
		}		
		
		/**
		 * 注册页面数据加载完成后执行的回调函数
		 * @param {Object} callback
		 */
		handle.onPageLoad = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				pageLoadEvent.subscribe(callback);
		} 
		
		/**
		 * 设置query其他参数
		 * @param {Object} params
		 */
		handle.setAppendParams = function(params) {
			config.appendParams = params;
		}
		
		return handle;		
	}			
}