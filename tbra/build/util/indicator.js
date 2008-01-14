/** ״ָ̬ʾ�� */
TB.util.Indicator = new function() {
	
	var defConfig = {
		message: 'loading',
		useShim: false,
		useIFrame: false,
		centerIndicator: true
	}
	
	var prepareShim = function(target, useIFrame) {
		shim = document.createElement('div');
		shim.className = 'tb-indic-shim';
		$D.setStyle(shim, 'display', 'none');
		target.parentNode.insertBefore(shim, target);
		if (useIFrame) {
			var shimFrame = document.createElement('iframe');
			shimFrame.setAttribute("frameBorder", 0);
			shimFrame.className = 'tb-indic-shim-iframe';
			target.parentNode.insertBefore(shimFrame, target);
		}
		return shim;
	}	
	
	this.attach = function(target, config) {
		target = $(target);
		config = TB.applyIf(config||{}, defConfig);
		
		var indicator =  document.createElement('div');
		indicator.className = 'tb-indic';
		$D.setStyle(indicator, 'display', 'none');
		$D.setStyle(indicator, 'position', 'static');
		indicator.innerHTML = '<span>'+$M(config.message)+'</span>';
		
		if (config.useShim) {
			var shim = prepareShim(target, config.useIFrame);
			shim.appendChild(indicator);
		} else {
			target.parentNode.insertBefore(indicator, target);			
		}
		
		var handle = {};
		
		handle.show = function(xy) {
			if (config.useShim) {
				var region = $D.getRegion(target);	
				
				var shim = indicator.parentNode;
				$D.setStyle(shim, 'display', 'block');
				$D.setXY(shim, [region[0], region[1]]);
				$D.setStyle(shim, 'width', (region.right-region.left)+'px');
				$D.setStyle(shim, 'height', (region.bottom-region.top)+'px');
				
				if (config.useIFrame) {
					var shimFrame = shim.nextSibling;
					$D.setStyle(shimFrame, 'width', (region.right-region.left)+'px');
					$D.setStyle(shimFrame, 'height', (region.bottom-region.top)+'px');
					$D.setStyle(shimFrame, 'display', 'block');
				}
				
				$D.setStyle(indicator, 'display', 'block');
				$D.setStyle(indicator, 'position', 'absolute');
				if (config.centerIndicator) {
					$D.setStyle(indicator, 'top', '50%');
					$D.setStyle(indicator, 'left', '50%');
					indicator.style.marginTop = -(indicator.offsetHeight/2) + 'px';
					indicator.style.marginLeft = -(indicator.offsetWidth/2) + 'px';
				}
			} else {
				$D.setStyle(indicator, 'display', '');
				if (xy) {
					$D.setStyle(indicator, 'position', 'absolute');
					$D.setXY(indicator, xy);
				}
			}
		};

		handle.hide = function() {
			if (config.useShim) {
				var shim = indicator.parentNode;
				$D.setStyle(indicator, 'display', 'none');
				$D.setStyle(shim, 'display', 'none');
				if (config.useIFrame)
					$D.setStyle(indicator.parentNode.nextSibling, 'display', 'none');
				try {
					if (config.useIFrame)
						shim.parentNode.removeChild(shim.nextSibling);
					shim.parentNode.removeChild(shim);
				} catch (e) {}
			} else {
				$D.setStyle(indicator, 'display', 'none');
				try {
					indicator.parentNode.removeChild(indicator);
				} catch (e) {}
			}
		};
		
		return handle;
	}
}