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
	initPictuireAnimation();

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
	itemVisual.each(function () {
		let _this = $(this);
		_this.mouseenter(function (event) {
			let _x = event.pageX - 250;
			let _y = event.pageY - 400;

			$(this).find('img').next().stop().animate({opacity: 1}, 300);

			let backFigure = $('.back-figure, .back-figure--small');
			backFigure.stop();

			if (_this.hasClass('small')) {
				$('.back-figure--small').addClass('active');
				$('.back-figure').removeClass('active');
				_x = event.pageX - 150;
				_y = event.pageY - 200;
			} else {
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

			$('.back-figure, .back-figure--small').css({
				'top' : event.pageY - isSmall ? 200 : 400,
				'left': event.pageX - isSmall ? 150 : 250
			});

		});
	});
	if (itemVisual.length) {
		$('#wrapper').append('<span class="back-figure" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>' +
			'<span class="front-figure" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}

	if ($('.team-item__visual.small').length) {
		$('#wrapper').append('<span class="back-figure--small" style="position:absolute; top:-9999px; left:-9999px;  border-radius:50%; background:rgba(9,85,255,1); ">&nbsp;</span>' +
			'<span class="front-figure--small" style="position:absolute; top:-9999px; left:-9999px;   border-radius:50%; z-index:9999; pointer-events:none; background:rgba(9,85,255,.05); ">&nbsp;</span>');
	}
}

