import 'remodal/dist/remodal.css';
import 'remodal/dist/remodal-default-theme.css';
import './site.scss';
import '@babel/polyfill';
import 'whatwg-fetch';
import 'remodal/dist/remodal.min.js';


const app = require('./app');
window.app = app;
app.tools = require('osmium-tools');

import 'jquery';
import '@fancyapps/fancybox';
import Vue from 'vue';
import Vuelidate from 'vuelidate';

Vue.use(Vuelidate);
window.$ = $;
window.jQuery = jQuery;

app.Vue = Vue;

$(window).on('load', () => $('.preloader').addClass('loaded'));

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
	|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
	isMobile = true;
}

$(document).ready(() => {
	if (window.isApp) app.initVueApp();
	if (app.getCookie('acceptCookie') !== 'true') {
		$('body').addClass('has-cookies');
	} else {
		$('.cookies').remove();
	}
	$('#partnerBtn').click(() => {
		let modal = jQuery('[data-remodal-id=modal]').remodal();
	});
	$('#modalSend').click(() => {
		alert('Your application has been successfully submitted.');
	});

	app.map.init();
	if( !isMobile ) {
		initPictuireAnimation();
	}

	$(window).scroll(() => {
		let wS = $(window).scrollTop();
		$('#header')[wS > 50 ? 'addClass' : 'removeClass']('fixed');
	});

	if ($('#startVideo').length) {
		let startVideo = document.getElementsByTagName('video')[0];
		startVideo.onended = () => $('.loop').addClass('active');
	}

	$('video, audio').each(function () {
		let element = $(this).get(0);
		if (!(element.hasAttribute('data-autoplay') && typeof element.play === 'function')) return;

		element.play();
		element.controls = false;
	});

	$('.nav-opener').click((e) => {
		e.preventDefault();
		$('body').toggleClass('nav-active');
	});

	$('.team-list-opener').on('click', 'a', function (event) {
		event.preventDefault();
		let item = $(this).closest('.team-list-wrap'),
			opener = $(this),
			openText = opener.data('shown-text'),
			closeText = opener.data('hidden-text');

		item.find('.team-list')[item.hasClass('active') ? 'slideUp' : 'slideDown'](() => {
			item.toggleClass('active');
			opener.text(item.hasClass('active') ? openText : closeText);
		});

	});

	$('.application-item__header').click(function (e) {
		let item = $(this).closest('.application-item');
		let elemTop = $('.applications').offset().top;

		if (item.hasClass('active')) {
			item.find('.application-item__expand').slideToggle(() => item.toggleClass('active'));
		} else {
			item.parent().find('.application-item.active .application-item__expand').slideToggle(function () {
				$(this).parent().toggleClass('active');
			});
			$('body,html').animate({'scrollTop': elemTop}, 300);
			item.find('.application-item__expand').slideToggle(() => item.toggleClass('active'));
		}
		e.preventDefault();
	});

	$('[data-fancybox]').fancybox({
		autoFocus: false,
		backFocus: false,
		trapFocus: false
	});

	$('.close-cookies').on('click', (event) => {
		event.preventDefault();
		app.setCookie('acceptCookie', 'true', 365 * 2);
		$('.cookies').fadeOut('400', () => $('body').removeClass('has-cookies'));
	});

});

function initPictuireAnimation() {
	let itemVisual = $('.team-item__visual');
	if (itemVisual.length) {
		$('#wrapper').append('<span class="back-figure" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>' +
			'<span class="front-figure" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}
	if (itemVisual.hasClass("small")) {
		$('#wrapper').append('<span class="back-figure--small" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>' +
			'<span class="front-figure--small" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}
	var backFigure = $('.back-figure, .back-figure--small');

	itemVisual.each(function () {
		let _this = $(this);
		_this.mouseenter(function (event) {
			let _x = event.pageX - 250;
			let _y = event.pageY - 400;

			$(this).find('img').next().stop().animate({opacity: 1}, 300);

			backFigure.stop();

			if (_this.hasClass('small')) {
				_x = event.pageX - 150;
				_y = event.pageY - 200;
				backFigure.css({
					'top' : _y,
					'left': _x
				});
				backFigure.css("display");
				$('.back-figure--small').addClass('active');
				$('.back-figure').removeClass('active');
			} else {
				$('.back-figure, .back-figure--small').css({
					'top' : _y,
					'left': _x
				});
				backFigure.css("display");
				$('.back-figure--small').removeClass('active');
				$('.back-figure').addClass('active');
			}

			backFigure.css({'top': _y, 'left': _x});

		}).mouseleave(function () {
			$(this).find('img').next().stop().animate({opacity: 0}, 300);
			$('.back-figure').removeClass('active');
			$('.back-figure--small').removeClass('active');

		}).mousemove(function (event) {
			let isSmall = _this.hasClass('small');
			backFigure.css({
				'top' : event.pageY - (isSmall ? 200 : 400),
				'left': event.pageX - (isSmall ? 150 : 250)
			});

		});
	});
}

