/* script by ProVerstka */
$(window).on('load',function(){
	initPreloader();
});
function initPreloader(){
	$('.preloader').addClass('loaded');
}
$(document).ready(function(){
	$(window).on('load',function(){
		initPreloader();
	});
	initMap();
	initPictuireAnimation ();
	initPlayerForm();

	// add background to fixed header
	$(window).scroll(function(){
		var wS = $(window).scrollTop();
		if (wS>50){
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});
	
	// start loop video
	if ($('#startVideo').length) {
		var startVideo = document.getElementsByTagName('video')[0];
		startVideo.onended = function(e) {
			$('.loop').addClass('active');
		};
	}

	// autoplay all video
	$('video, audio').each(function(){
		var element = $(this).get(0);
		if( element.hasAttribute('data-autoplay') && typeof element.play === 'function' ) {
			element.play();
			element.controls = false; 
		}
	});

	$(".nav-opener").click(function(e) {
		e.preventDefault();
		$('body').toggleClass('nav-active');
	});

	$('.team-list-opener').on('click', 'a', function(event) {
		event.preventDefault();
		var item = $(this).closest('.team-list-wrap'),
			// item = $parent.find('.team-list'),
			opener = $(this),
			openText = opener.data('shown-text'),
			closeText = opener.data('hidden-text');

		if(item.hasClass('active')){
			item.find('.team-list').slideUp(function(){
				item.toggleClass('active');
				opener.text(openText);
			});
		}else{
			item.find('.team-list').slideDown(function(){
				item.toggleClass('active');
				opener.text(closeText);
			});
		}
	});

	// accordion
	$('.application-item__header').click(function(e){
		var item=$(this).closest('.application-item');
		var elemTop = $('.applications').offset().top;
		

		if(item.hasClass('active')){
			item.find('.application-item__expand').slideToggle(function(){
				item.toggleClass('active');
			});
		}else{
			item.parent().find('.application-item.active .application-item__expand').slideToggle(function(){
				$(this).parent().toggleClass('active');
			});
			$('body,html').animate({'scrollTop':elemTop}, 300);
			item.find('.application-item__expand').slideToggle(function(){
				item.toggleClass('active');
			});
		}
		e.preventDefault();
	});

	$(".tabset").tabset({

	});

	$('[data-fancybox]').fancybox({
		autoFocus: false,
		backFocus: false,
		trapFocus: false,
	});

	$("#input-file").fileinput({
		// browseLabel: 'Select Folder...',
		language: "cl",
		required: true,
		browseOnZoneClick: true,
		showBrowse: false,
		showUpload: false,
		previewFileType: "text",
		allowedFileExtensions: ["pdf", "docx"],
		fileActionSettings: {
			showRemove: true,
			showUpload: false,
			showZoom: false,
			showDrag: false,
		},
		preferIconicPreview: true,
		previewFileIconSettings: {
			'docx': '<i class="fileIcon fileIcon-docx">docx</i>',
			'pdf': '<i class="fileIcon fileIcon-pdf">pdf</i>',
		},
		frameClass: "better-theme",
		// uploadUrl: "/files",
		// theme: 'explorer-fa',
	});

	$('.close-cookies').on('click', function(event) {
		event.preventDefault();
		$('.cookies').fadeOut('400', function() {
			$('body').removeClass('has-cookies');
		});
	});

});


function initPictuireAnimation (){
	$('.team-item__visual').each(function(){
		var _this = $(this);
		var _fl = false;
		var _timer ;
		_this
		.mouseenter(function(event){
			var _x = event.pageX-250;
			var _y = event.pageY-400;
			$(this).find('img').next().stop().animate({opacity:1},300);
			$('.back-figure, .back-figure--small').stop();
			if (_this.hasClass('small')) {
				$('.back-figure--small').addClass('active');
				$('.back-figure').removeClass('active');
				_x = event.pageX-150;
				_y = event.pageY-200;
			} else {
				$('.back-figure').addClass('active');
				$('.back-figure--small').removeClass('active');
			}
			$('.back-figure, .back-figure--small').css({'top':_y,'left':_x});

		})
		.mouseleave(function(){
			$(this).find('img').next().stop().animate({opacity:0},300);
			$('.back-figure').removeClass('active');
			$('.back-figure--small').removeClass('active');
			
		})
		.mousemove(function(event) {
			var _x = event.pageX-250;
			var _y = event.pageY-400;
			if (_this.hasClass('small')) {
				_x = event.pageX-150;
				_y = event.pageY-200;
			}
			$('.back-figure, .back-figure--small').css({'top':_y,'left':_x});

		})
	})
	if ($('.team-item__visual').length) {
		$('#wrapper').append('<span class="back-figure" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>');
		$('#wrapper').append('<span class="front-figure" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}
	if ($('.team-item__visual.small').length) {
		$('#wrapper').append('<span class="back-figure--small" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>');
		$('#wrapper').append('<span class="front-figure--small" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}
};

$.fn.tabset = function(o){
	var o = $.extend({
				"tab":">.tab",
				"tab_control":">ul",
				"tab_control_parent":">div",
				"tab_control_item":">li",
				"a_class":"active",
				"t_a_class":"active",
				"style": {
					"forActive": {"display":"block"},
					"forInActive": {"display":"none"}
				}
			},o);
	return this.each(function(){
		var tabset=$(this),
			tab=$(o.tab,tabset),
			ctrl_pnt=$(o.tab_control_parent,tabset),
			ctrl=$(o.tab_control,tabset).size() ? $(o.tab_control,tabset):$(o.tab_control,ctrl_pnt),
			ctrl_item=$(o.tab_control_item,ctrl),
			a_class={"name":o.a_class,"selector":"."+o.a_class},
			t_a_class={"name":o.t_a_class,"selector":"."+o.t_a_class},
			style=o.style;
			ctrl_item.click(function(e){
				var index=$(this).index(),
					curTab=tab.filter(t_a_class.selector).size() ? tab.filter(t_a_class.selector):tab.filter(':visible'),
					nextTab=tab.eq(index);
				$(this).parent().find(o.tab_control_item+a_class.selector).removeClass(a_class.name);
				$(this).addClass(a_class.name);
				if(style){
					curTab.css(style.forInActive).removeClass(t_a_class.name);
					nextTab.css(style.forActive).addClass(t_a_class.name);
				}else{
					curTab.removeClass(t_a_class.name);
					nextTab.addClass(t_a_class.name);
				}
				e.preventDefault();
			});
	});
};

function initMap() {
	$('.contact-map').each(function (index, Element) {
		var coords = $(Element).text().split(",");
		if (coords.length != 3) {
			$(this).display = "none";
			return;
		}
		var latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
		var myOptions = {
			zoom: parseFloat(coords[2]),
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: false,
			mapTypeControl: false,
			zoomControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},

			scrollwheel: false,
			styles: [
			{
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#fafafa"
				}
				]
			},
			{
				"elementType": "labels.icon",
				"stylers": [
				{
					"visibility": "off"
				}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#616161"
				}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
				{
					"color": "#f5f5f5"
				}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#bdbdbd"
				}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#757575"
				}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#e4e7fc"
				}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#757575"
				}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#e4e7fc"
				}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#616161"
				}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#e5e5e5"
				}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#eeeeee"
				}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
				{
					"color": "#7192da"
				}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
				{
					"color": "#9e9e9e"
				}
				]
			}
			]
		};
		var map = new google.maps.Map(Element, myOptions);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			icon: "images/map-marker.png"
		});
	});
}

function initPlayerForm(){
	$('.fileInput').on('change', function () {
		$(this).closest('.file-upload-target').removeClass('format-error');
		$(this).closest('.file-upload-target').removeClass('error');
        if (!($(this).val())) {
        	$(this).closest('.file-upload-target').addClass('error');
        }
        if ($(this).val().indexOf(".pdf") > 0 || $(this).val().indexOf(".docx") > 0) {
            $('.fileType').addClass('hidden');
            $('.fileName').text($(this).val());
        }else{
            $(this).val('');
            $('.fileType').removeClass('hidden');
            $('.fileName').text('');
            $(this).closest('.file-upload-target').addClass('format-error');
            return false;
        }
    });
	$('form').each(function(){
		var form=$(this),
		input=form.find('.form-input');
		form.find('.required').blur(function(){
			var val=$(this).val();
			if(val){
				$(this).removeClass('error');
			}
			else{
				$(this).addClass('error');
				// $(this).val('');
			}
		});
		form.on('keyup keydown', '.required.error', function(){
			var val=$(this).val();
			if((/^[a-zA-Z0-9а-яА-ЯіІєЄїЇ\s-\(\)\+]{1,40}$/ig).test(val)){
				$(this).removeClass('error');
			}
			else{
				$(this).addClass('error active');
			}
		});
		form.find('.email').blur(function(){
			var val=$(this).val();
			if((/^[-\._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/ig).test(val) && val.length<=30){
				$(this).removeClass('error ');
			}
			else{
				$(this).addClass('error active');
				// $(this).val('');
			}
		});
		form.on('keyup keydown', '.email.error', function(){
			var val=$(this).val();
			if((/^[-\._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/ig).test(val) && val.length<=30){
				$(this).removeClass('error');
			}
			else{
				$(this).addClass('error');
			}
		});


		form.find('.website').blur(function(){
			var val=$(this).val();
			if((/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ig).test(val) && val.length<=300){
				$(this).removeClass('error ');
			}
			else{
				$(this).addClass('error active');
				// $(this).val('');
			}
		});
		form.on('keyup keydown', '.website.error', function(){
			var val=$(this).val();
			if((/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ig).test(val) && val.length<=300){
				$(this).removeClass('error');
			}
			else{
				$(this).addClass('error');
			}
		});


        form.submit(function(){
            var _this = $(this);
            input.trigger('blur');
            $('.fileInput').trigger('change');
            if(form.find('.error').length){
                return false;
            } else {

                var values = new FormData(_this.get(0));
                $.ajax({
                    url: form.attr('action'),
                    type: form.attr('method'),
                    contentType: false,
                    processData: false,
                    data: values,
                    success: function(){
                        form.find('input[type=text], input[type=email], input[type=file], textarea').each(function() {
                            $(this).val('');
                        });
                        $('.fileType').removeClass('hidden');
                        $('.fileName').text('');
		            	$.fancybox.close();
		            	$.fancybox.open('<div class="message modal-item"><div class="modal-title">Thank you!</div><div class="modal-text">Your form has been sent. We will be in touch soon</div><button data-fancybox-close class="btn btn-block btn-go-it">GOT IT</button></div>');

                    },
                    error:function(){
                        console.log('error')
                    }
                });
                return false;
            }
        });
	});
};

(function ($) {
    "use strict";

    $.fn.fileinputLocales['cl'] = {
        dropZoneClickTitle: '<br>(or click to select {files}) <span class="red-text">Please, upload all files at once from the same folder</span>',
    };
})(window.jQuery);
