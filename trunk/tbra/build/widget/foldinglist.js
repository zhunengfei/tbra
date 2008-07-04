/**
 * @author zexin.zhaozx
 */
TB.widget.FoldingList = new function() {
	
	var defConfig = {
		titleClass: 'tb-fl-title',
		contentClass: 'tb-fl-content',
		expandClass: 'tb-fl-expand',
		collapseClass: 'tb-fl-collapse',
		multiExpand: true  /* true:允许同时展开多个  false：同一时间只允许展开一个 */
	}

	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config || {}, defConfig);
		var handle = {};
		var titles = $D.getElementsByClassName(config.titleClass, '*', container);
		

		handle.expandAll = function() {
			titles.forEach(handle.expand);
		};

		handle.collapseAll = function() {
			titles.forEach(handle.collapse);
		};

		handle.expand = function(title) {
			if (!config.multiExpand) {
				titles.filter(function(o) {
					var c = TB.dom.getNextSibling(o);
					return !($D.hasClass(c, config.contentClass) && $D.isAncestor(c, title));
				}).forEach(handle.collapse);		
			}
			$D.addClass(title, config.expandClass);
			$D.removeClass(title, config.collapseClass);
			var panel = TB.dom.getNextSibling(title);
			if ($D.hasClass(panel, config.contentClass)) {
				$D.setStyle(panel, 'display', ''); 
			}			
		}
		
		handle.collapse = function(title) {
			$D.addClass(title, config.collapseClass);
			$D.removeClass(title, config.expandClass);
			var panel = TB.dom.getNextSibling(title);
			if ($D.hasClass(panel, config.contentClass)) {
				$D.setStyle(panel, 'display', 'none');
			}
		}		

		$E.on(titles, 'click', function(ev) {
			if ($E.getTarget(ev) === this)
				handle[($D.hasClass(this, config.collapseClass))?'expand':'collapse'](this);
		});
		
		return handle;
	}
	
}