(function($){
	/*jshint expr:true */
	/*jshint multistr: true */
var txt1 = '<div><p>Кастомное модальное окно</p>\
<p>Сообщение для кастомного модального окна</p>\
<p><a href="">Сообщение для кастомного</a> модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p></div>',
	txt2 = '<div><p>Кастомное модальное окно</p>\
<p>Сообщение для кастомного модального окна</p>\
<p>Сообщение для кастомного модального окна</p></div>';

	$('button.btn1').on('click', function(e){
		e.preventDefault();
		$.psmodal({
			class: 'iframe--video',
			content: $("<div />").append($("<div />", {'class':'iframe--video-wrapper'}).append($("<iframe />", {
				frameborder: 0,
				wmode: "opaque",
				allowfullscreen: "allowfullscreen",
				//src: 'https://www.youtube.com/embed/lf72xzoW_XU?rel=0&showinfo=0'
				src: 'https://www.youtube.com/embed/lf72xzoW_XU?rel=0&showinfo=0'
			}))),
			title: 'Заголовок окна 1',
			closeBtn: true,
			clone: false,
			beforePsOpen: function(d, el){
				//console.log('closest', );
				//$(this.body).closest('.psmodal-container').addClass("iframe--video");
				//el.closest('.psmodal-container').addClass("iframe--video");
			},
			container: {
				closeHtml: '\
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">\
<g><path d="M990,39.9L960.1,10L500,470.1L39.9,10L10,39.9L470.1,500L10,960.1L39.9,990L500,529.9L960.1,990l29.9-29.9L529.9,500L990,39.9z"/></g>\
</svg>',
				closeTpl: '<i class="psmodal-close icon-psmodal-close"></i>'
			}
		});
		/*$.psmodal.open(
			'modal',
			txt1,
			'Заголовок окна 1',
			{
				yes: {
					text: 'УГУ )',
					callback: function(e){
						//console.log(this);
						// Собственный обработчик.
						// Если вернуть false - окно не закроется;
						// Если вернуть true  - окно закроется;
						return !0;
					}
				},
				no: {
					text: 'НЕА )'
				}
			}
		);*/
		return !1;
	});
	$('button.btn2').on('click', function(e){
		e.preventDefault();
		$.psmodal({
			content: txt2,
			clone: true,
			container: {
				closeHtml: 'Закрыть'
			},
			closeBtn: true,
		});
		/*$.psmodal.open(
			'alert',
			txt2,
			'Заголовок окна 2',
			{
				yes: {
					text: 'Ок',
					callback: function(e){
						//console.log(this);
						return !0;
					}
				}
			}
		);*/
		return !1;
	});
}(jQuery));