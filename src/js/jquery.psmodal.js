(function($) {
	
	/*jshint expr:true */
	/*jshint multistr: true */
	
	var default_options = {
		
		type: 'html', // ajax или html
		content: '',
		title: '',
		class: '',
		closeBtn: false,
		url: '',
		ajax: {},
		ajax_request: null,
		
		closeOnEsc: true,
		closeOnOverlayClick: true,
		
		clone: false,
		
		overlay: {
			block: undefined,
			tpl: '<div class="psmodal-overlay"></div>',
			css: {
				backgroundColor: '#000',
				opacity: 0.6
			}
		},
		
		container: {
			block: undefined,
			tpl: '\
<div class="psmodal-container">\
	<div class="psmodal-container_i">\
		<div class="psmodal-container_i2">\
			\
		</div>\
	</div>\
</div>',
			header: 
'<div class="psmodal-container_header">\
	\
</div>',
			closeTpl: '<button class="psmodal-close"></button>',
			closeHtml: '',
			titleTpl: '<span class="psmodal--title-h"></span>'
		},
		
		wrap: undefined,
		body: undefined,
		
		errors: {
			tpl: '<div class="psmodal-error psmodal-close"></div>',
			autoclose_delay: 2000,
			ajax_unsuccessful_load: 'Error'
		},
		
		openEffect: {
			type: 'fade',
			speed: 400
		},
		closeEffect: {
			type: 'fade',
			speed: 400
		},
		
		beforePsOpen: $.noop,
		afterPsOpen: $.noop,
		beforePsClose: $.noop,
		afterPsClose: $.noop,
		afterPsLoading: $.noop,
		afterPsLoadingOnShow: $.noop,
		errorPsLoading: $.noop
		
	};
	
	
	var modalID = 0;
	var modals = $([]);
	
	
	var utils = {
		
		
		// Определяет произошло ли событие e вне блока block
		isEventOut: function(blocks, e) {
			var r = true;
			$(blocks).each(function() {
				if ($(e.target).get(0)==$(this).get(0)) r = false;
				if ($(e.target).closest('HTML', $(this).get(0)).length==0) r = false;
			});
			return r;
		}
		
		
	};
	
	
	var modal = {
		
		
		// Возвращает элемент, которым был вызван плагин
		getParentEl: function(el) {
			var r = $(el);
			if (r.data('psmodal'))
				return r;
			r = $(el).closest('.psmodal-container').data('psmodalParentEl');
			if (r) return r;
			return false;
		},
		
		
		// Переход
		transition: function(el, action, options, callback) {
			callback = callback==undefined ? $.noop : callback;
			switch (options.type) {
				case 'fade':
					action=='show' ? el.fadeIn(options.speed, callback) : el.fadeOut(options.speed, callback);
					break;
				case 'none':
					action=='show' ? el.show() : el.hide();
					callback();
					break;
			}
		},
		
		
		// Подготвка содержимого окна
		prepare_body: function(D, $this) {
			
			// Обработчик закрытия
			$('.psmodal-close', D.body).unbind('click.psmodal').bind('click.psmodal', function() {
				$this.psmodal('close');
				return false;
			});
		},
		
		
		// Инициализация элемента
		init_el: function($this, options) {
			var D = $this.data('psmodal');
			if (D) return;
			D = options;
			modalID++;
			D.modalID = modalID;
			
			// Overlay
			D.overlay.block = $(D.overlay.tpl);
			D.overlay.block.css(D.overlay.css);
			
			// Container
			D.container.block = $(D.container.tpl);
			D.container.block.addClass(D.class);
			// BODY
			D.body = $('.psmodal-container_i2', D.container.block);
			
			if(options.title.length > 0 || options.closeBtn){
				var header = $(D.container.header).clone(),
					cls = options.closeBtn ? $(D.container.closeTpl).clone().html(D.container.closeHtml) : "",
					titleBlock = $("<div></div>", {
						'class': 'psmodal--title'
					}),
					titleSpan = $(D.container.titleTpl).clone().text($("<div></div>").append(options.title).text());
				header.append(titleBlock.append(titleSpan, cls));
				$this.prepend(header);
			}
			
			if (options.clone) {
				D.body.empty().append($this.clone(true));
			} else {
				$this.before('<div id="psmodalReserve' + D.modalID + '" style="display: none" />');
				D.body.empty().append($this);
			}
			
			
			// Подготовка содержимого
			modal.prepare_body(D, $this);
			// Закрытие при клике на overlay
			if (D.closeOnOverlayClick)
				D.overlay.block.add(D.container.block).click(function(e) {
					if (utils.isEventOut($('>*', D.body), e))
						$this.psmodal('close');
				});
			
			// Запомним настройки
			D.container.block.data('psmodalParentEl', $this);
			$this.data('psmodal', D);
			modals = $.merge(modals, $this);
			
			// Показать
			$.proxy(actions.show, $this)();
			if (D.type=='html') return $this;
			
			// Ajax-загрузка
			if (D.ajax.beforeSend!=undefined) {
				var fn_beforeSend = D.ajax.beforeSend;
				delete D.ajax.beforeSend;
			}
			if (D.ajax.success!=undefined) {
				var fn_success = D.ajax.success;
				delete D.ajax.success;
			}
			if (D.ajax.error!=undefined) {
				var fn_error = D.ajax.error;
				delete D.ajax.error;
			}
			var o = $.extend(true, {
				url: D.url,
				beforeSend: function() {
					if (fn_beforeSend==undefined) {
						D.body.html('<div class="psmodal-loading" />');
					} else {
						fn_beforeSend(D, $this);
					}
				},
				success: function(responce) {
					
					// Событие после загрузки до показа содержимого
					$this.trigger('afterPsLoading');
					D.afterPsLoading(D, $this, responce);

					if (fn_success==undefined) {
						D.body.html(responce);
					} else {
						fn_success(D, $this, responce);
					}
					modal.prepare_body(D, $this);

					// Событие после загрузки после отображения содержимого
					$this.trigger('afterPsLoadingOnShow');
					D.afterPsLoadingOnShow(D, $this, responce);
					
				},
				error: function() {
					
					// Событие при ошибке загрузки
					$this.trigger('errorPsLoading');
					D.errorPsLoading(D, $this);
					
					if (fn_error==undefined) {
						D.body.html(D.errors.tpl);
						$('.psmodal-error', D.body).html(D.errors.ajax_unsuccessful_load);
						$('.psmodal-close', D.body).click(function() {
							$this.psmodal('close');
							return false;
						});
						if (D.errors.autoclose_delay)
							setTimeout(function() {
								$this.psmodal('close');
							}, D.errors.autoclose_delay);
					} else {
						fn_error(D, $this);
					}
				}
			}, D.ajax);
			D.ajax_request = $.ajax(o);
			
			// Запомнить настройки
			$this.data('psmodal', D);
			
		},
		
		
		// Инициализация
		init: function(options) {
			options = $.extend(true, {}, default_options, options);
			if ($.isFunction(this)) {
				if (options==undefined) {
					$.error('jquery.psmodal: Uncorrect parameters');
					return;
				}
				if (options.type=='') {
					$.error('jquery.psmodal: Don\'t set parameter "type"');
					return;
				}
				switch (options.type) {
					case 'html':
						if (options.content=='') {
							$.error('jquery.psmodal: Don\'t set parameter "content"');
							return;
						}
						var c = options.content;
						options.content = '';
						
						return modal.init_el($(c), options);
					case 'ajax':
						if (options.url=='') {
							$.error('jquery.psmodal: Don\'t set parameter "url"');
							return;
						}
						return modal.init_el($('<div />'), options);
				}
			} else {
				return this.each(function() {
					modal.init_el($(this), $.extend(true, {}, options));
				});
			}
		}
		
		
	};
	
	
	var actions = {
		
		
		// Показать
		show: function() {
			var $this = modal.getParentEl(this);
			if ($this===false) {
				$.error('jquery.psmodal: Uncorrect call');
				return;
			}
			var D = $this.data('psmodal');
			
			// Добавить overlay и container
			D.overlay.block.hide();
			D.container.block.hide();
			$('BODY').append(D.overlay.block);
			$('BODY').append(D.container.block);
			
			// Событие
			D.beforePsOpen(D, $this);
			$this.trigger('beforePsOpen');
			
			// Wrap
			if (D.wrap.css('overflow')!='hidden') {
				D.wrap.data('psmodalOverflow', D.wrap.css('overflow'));
				var w1 = D.wrap.outerWidth(true);
				D.wrap.css('overflow', 'hidden');
				var w2 = D.wrap.outerWidth(true);
				if (w2!=w1)
					D.wrap.css('marginRight', (w2 - w1) + 'px');
			}
			
			// Скрыть предыдущие оверлеи
			modals.not($this).each(function() {
				var d = $(this).data('psmodal');
				d.overlay.block.hide();
			});
			
			// Показать
			modal.transition(D.overlay.block, 'show', modals.length>1 ? {type: 'none'} : D.openEffect);
			modal.transition(D.container.block, 'show', modals.length>1 ? {type: 'none'} : D.openEffect, function() {
				D.afterPsOpen(D, $this);
				$this.trigger('afterPsOpen');
			});
			var fcs = $('a, button, input:visible, select, textarea', $this);
			if(fcs.length){
				var last = $(fcs[0]),
					first = $(fcs[fcs.length-1]);
				first.unbind('keydown.psmodal').bind('keydown.psmodal', function(e){
					if (e.keyCode == 9 && !e.shiftKey) {
						last.focus();
						return !1;
					}
				});
				last.unbind('keydown.psmodal').bind('keydown.psmodal', function(e){
					if (e.keyCode == 9 && e.shiftKey) {
						first.focus();
						return !1;
					}
				});
				setTimeout(function(){
					last.focus();
				}, 200);
			}
			return $this;
		},
		
		
		// Закрыть
		close: function() {
			if ($.isFunction(this)) {
				modals.each(function() {
					$(this).psmodal('close');
				});
			} else {
				return this.each(function() {
					var $this = modal.getParentEl(this);
					if ($this===false) {
						$.error('jquery.psmodal: Uncorrect call');
						return;
					}
					var D = $this.data('psmodal');
					
					// Событие перед закрытием
					if (D.beforePsClose(D, $this)===false) return;
					$this.trigger('beforePsClose');
					
					// Показать предыдущие оверлеи
					modals.not($this).last().each(function() {
						var d = $(this).data('psmodal');
						d.overlay.block.show();
					});
					
					modal.transition(D.overlay.block, 'hide', modals.length>1 ? {type: 'none'} : D.closeEffect);
					modal.transition(D.container.block, 'hide', modals.length>1 ? {type: 'none'} : D.closeEffect, function() {
						
						// Событие после закрытия
						D.afterPsClose(D, $this);
						$this.trigger('afterPsClose');
						
						// Если не клонировали - вернём на место
						if (!D.clone)
							$('#psmodalReserve' + D.modalID).replaceWith(D.body.find('>*'));
						
						D.overlay.block.remove();
						D.container.block.remove();
						$this.data('psmodal', null);
						if (!$('.psmodal-container').length) {
							if (D.wrap.data('psmodalOverflow'))
								D.wrap.css('overflow', D.wrap.data('psmodalOverflow'));
							D.wrap.css('marginRight', 0);
						}
						
					});
					
					if (D.type=='ajax')
						D.ajax_request.abort();
					
					modals = modals.not($this);
				});
			}
		},
		
		
		// Установить опции по-умолчанию
		setDefault: function(options) {
			$.extend(true, default_options, options);
		}
		
		
	};
	
	
	$(function() {
		default_options.wrap = $((document.all && !document.querySelector) ? 'html' : 'body');
	});
	
	
	// Закрытие при нажатии Escape
	$(document).bind('keyup.psmodal', function(e) {
		var m = modals.last();
		if (!m.length) return;
		var D = m.data('psmodal');
		if (D.closeOnEsc && (e.keyCode===27))
			m.psmodal('close');
	});
	
	
	$.psmodal = $.fn.psmodal = function(method) {

		if (actions[method]) {
			return actions[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method==='object' || !method) {
			return modal.init.apply(this, arguments);
		} else {
			$.error('jquery.psmodal: Method ' + method + ' does not exist');
		}
		
	};
	
	
})(jQuery);