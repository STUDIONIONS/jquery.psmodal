var time = (new Date()).getTime();
yepnope.injectCss('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&amp;subset=cyrillic,cyrillic-ext');
yepnope('assets/js/jquery.js', undefined, function() {
	yepnope('assets/js/jquery.psmodal.js?'+time, undefined, function() {
		yepnope('assets/js/main.js?'+time, undefined, function() {
			
		})
	})
})