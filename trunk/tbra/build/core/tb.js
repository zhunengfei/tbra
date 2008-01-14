/**
 * 常用变量
 */

$D = YAHOO.util.Dom;
$E = YAHOO.util.Event;
$ = $D.get;

TB = {};
TB.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=TB;
        for (j=(d[0] == "TB") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
};

/********* Env *********/
TB.namespace('env');
TB.env = {
	hostname: 'taobao.com',
	debug: false,
	lang: 'zh-cn' /*(navigator.userLanguage?navigator.userLanguage.toLowerCase():navigator.language.toLowerCase())*/
};

/******** Locale ********/
TB.namespace('locale');
TB.locale = {
	Messages: {},
	getMessage: function(key) {
		return TB.locale.Messages[key] || key;
	},
	setMessage: function(key, value) {
		TB.locale.Messages[key] = value;
	}
}
$M = TB.locale.getMessage;

/******** Trace *********/
TB.trace = function(msg) {
	if (!TB.env.debug) return;
	if (window.console) {
		window.console.debug(msg);
	} else {
		alert(msg);
	}
}

/********* TB.init *********/
TB.init = function() {
	this.namespace('widget', 'dom', 'bom', 'util', 'form', 'anim');

	if (location.hostname.indexOf('taobao.com') == -1) {
		TB.env.hostname = location.hostname;
		TB.env.debug = true;
	}

	var scripts = document.getElementsByTagName("script");
	var scriptName = /tbra(?:[\w\.\-]*?)\.js(?:$|\?(.*))/;
	var matchs;
	for (var i = 0; i < scripts.length; ++i) {
		if(matchs = scriptName.exec(scripts[i].src)) {
			TB.env['path'] = scripts[i].src.substring(0, matchs.index);
			if (matchs[1]) {
				var params = matchs[1].toQueryParams();
				for (n in params) {
					if (n == 't' || n == 'timestamp') {
						TB.env['timestamp'] = parseInt(params[n]);
						continue;
					}
					TB.env[n] = params[n];
				}				
			}
		}
	}
	document.write('<script type="text/javascript" src="' + TB.env['path'] + 'locale/' + TB.env.lang.toLowerCase() + '.js' + (TB.env.timestamp?'?t='+TB.env.timestamp+'.js':'') + '"><\/script>' );
	document.write('<link type="text/css" rel="stylesheet" href="' + TB.env['path'] + 'assets/tbra.css' + (TB.env.timestamp?'?t='+TB.env.timestamp+'.css':'') + '" />');	
}
TB.init();