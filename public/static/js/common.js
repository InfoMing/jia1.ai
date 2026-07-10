
function checkBan() {
	$.ajax({
		url: '/user/check-ban-mobile.php',
		type: 'POST',
		dataType: 'json',
		success: function (response) {
			if (response.code == 200) {
				if (!response.ban_mobile) {
					window.lightTips('未绑定手机号，请先绑定手机号');
					$('.mask1').addClass('on');
					$('.tc-layout').removeClass('on');
					$('.tc-supplement').addClass('on');
				}
			}
		},
	});
}
$(function () {
	var w = $(window).width();
	var pc = w > 768;
	initWow();
	lazyLoad();
	// initLenis();
	initEAlert();
	scrollClass();
	im4Copy();

	$('body').on('click', '.goTop', function () {
		$('html,body').animate({ scrollTop: 0 }, 1000);
	});

	// 数字滚动动画
	$('.countUp').each(function (i, v) {
		ScrollTrigger.create({
			trigger: v,
			start: 'top bottom',
			end: 'bottom bottom',
			scrub: 1,
			onEnter: function (self) {
				gsapCountUp(v);
			},
		});
	});

	// $('body').on('click', '.navbar-toggle', function () {
	// 	$('header').toggleClass('open');
	// 	$('html').toggleClass('act');
	// });
	// $('body').on('click', 'header .menu', function () {
	// 	$('header').toggleClass('open');
	// 	$('html').toggleClass('act');
	// });
	// 打开下拉
	$('header').on('mouseenter', '.nav .menu li', function () {
		$('.navdown').addClass('on');
	});
	$('header').on('mouseenter', '.navdown-list', function () {
		$('.navdown').addClass('on');
	});
	// 关闭下拉
	$('header').on('mouseleave', '.nav .menu li', function () {
		$('.navdown').removeClass('on');
	});
	$('header').on('mouseleave', '.navdown-list', function () {
		$('.navdown').removeClass('on');
	});

	/*视频弹窗*/
	$('body').on('click', '.bofang', function () {
		$('#vid_tanchuang').removeClass('act').addClass('act');
		var src = $(this).attr('data-vid');
		$('html').addClass('act');
		$('#vid_tanchuang video').attr({ src: src }).trigger('play');
	});
	$('body').on('click', '#vid_tanchuang .out', function () {
		$('#vid_tanchuang').removeClass('act');
		$('html').removeClass('act');
		$('#vid_tanchuang video').trigger('pause');
	});
	$('body').on('click', '#vid_tanchuang', function () {
		$('#vid_tanchuang').removeClass('act');
		$('html').removeClass('act');
		$('#vid_tanchuang video').trigger('pause');
	});
	$('body').on('click', '#vid_tanchuang .modal', function (e) {
		e.stopPropagation();
	});

	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	var isAndroid = /android/i.test(userAgent);
	var isiOS = /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;
	var isWeixin = /MicroMessenger/i.test(userAgent); // 新增微信环境检测
	var $videos = $('video'); // 获取所有video元素

	// 遍历每个video元素
	$videos.each(function () {
		var $video = $(this);
		// 检查当前video是否有autoplay属性或.autoplay
		var hasAutoplay = $video.prop('autoplay') || $video.hasClass('autoplay');

		// 如果有autoplay相关设置，才执行播放逻辑
		if (hasAutoplay) {
			if (!isAndroid && !isiOS) {
				console.log('其他设备 - 处理视频自动播放');
				$video.get(0).play();
			}
			if (isAndroid) {
				console.log('安卓设备 - 处理视频自动播放');
				try {
					$video.get(0).play();
				} catch (error) {
					$(window).on('touchstart', function () {
						$video.get(0).play();
					});
				}
			} else if (isiOS) {
				// iOS设备
				console.log('iOS设备 - 处理视频自动播放');
				try {
					$video.get(0).play();
				} catch (error) {
					if (!isWeixin) {
						$(window).on('touchstart', function () {
							$video.get(0).play();
						});
					} else {
						document.addEventListener('WeixinJSBridgeReady', function () {
							$video.get(0).play();
						});
					}
				}
			}
		}
	});

	setTimeout(() => {
		// 检查是否已经同意过 Cookie 使用
		if (!getCookie('cookieConsent')) {
			// 如果未同意过，显示同意按钮
			$('.foot3').addClass('on');
		}
	}, 500);

	// 同意按钮点击事件处理
	$('.foot3 .tongyi').on('click', function () {
		// 设置 Cookie 记录用户同意（有效期1年）
		setCookie('cookieConsent', 'accepted', 365);

		// 隐藏同意
		$('.foot3').removeClass('on');

		// 可选：在这里触发其他需要 Cookie 的功能
		initializeCookies();
	});

	// 用户同意后初始化 Cookie 相关功能
	function initializeCookies() {
		// 在这里添加需要用户同意后才能初始化的代码
		// 例如：
		// 初始化统计分析工具
		// 初始化广告相关功能
		console.log('用户已同意使用 Cookie，正在初始化相关功能');
	}

	//登陆后设置用户名
	// cookies版
	// function setUserName() {
	// 	// 获取URL中的contact参数
	// 	var contactParam = getUrlParameter('contact') || getCookie('cookieName');
	// 	var lastFour = '';
	// 	if (contactParam) {
	// 		// 将contact参数存入cookie，有效期365天
	// 		setCookie('cookieName', contactParam, 365);

	// 		// 判断是邮箱还是电话
	// 		if (contactParam.indexOf('@') > -1) {
	// 			// 处理邮箱：取@前的内容的后四位
	// 			var emailPrefix = contactParam.split('@')[0];
	// 			lastFour = emailPrefix.slice(-4);
	// 			console.log('邮箱后四位：' + lastFour);
	// 		} else {
	// 			// 处理电话：直接取后四位
	// 			lastFour = contactParam.slice(-4);
	// 			console.log('电话后四位：' + lastFour);
	// 		}

	// 		var str = 'NO.'+lastFour;
	// 		var url = $('.signup-btn').attr('data-url');
	// 		$('.signup-btn .btn-text-inner').text(str);
	// 		$('.signup-btn').attr('href',url);
	// 	}

	// 	// 获取URL参数的函数
	// 	function getUrlParameter(name) {
	// 		name = name.replace(/[\[\]]/g, '\\$&');
	// 		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	// 			results = regex.exec(window.location.href);
	// 		if (!results) return null;
	// 		if (!results[2]) return '';
	// 		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	// 	}
	// }
	function setUserName() {
		// 从 localStorage 获取 user 参数
		var contactParam = getCookie('user');
		var lastFour = '';
		if (contactParam) {
			contactParam = JSON.parse(contactParam);
			contactParam = contactParam.email || contactParam.phone;
			console.log(contactParam);
			// 判断是邮箱还是电话
			if (contactParam.indexOf('@') > -1) {
				// 处理邮箱：取 @ 前内容的后四位
				var emailPrefix = contactParam.split('@')[0];
				lastFour = emailPrefix.slice(-4);
				console.log('邮箱后四位：' + lastFour);
			} else {
				// 处理电话：直接取后四位
				lastFour = contactParam.slice(-4);
				console.log('电话后四位：' + lastFour);
			}

			var str = 'NO.' + lastFour;
			var url = $('.signup-btn').attr('data-url');
			$('.signup-btn .btn-text-inner').text(str);
			$('.signup-btn').attr('href', url);
		}
	}

	setUserName();

	$('.model-select .jt').on('click', function () {
		$(this).siblings('select').focus().click();
	});
});

/* -----------------------------------------下面写其他页面逻辑-------------------------------------- */
$(function () {
	var w = $(window).width();
	var pc = w > 768;
	function toVw(px) {
		return (px / 1920) * w;
	}
	//wowList
	// $('.wowList').each(function (i, v) {
	// 	var all = $(v).find('.item,.ev').length;
	// 	if (all == 0) {
	// 		return;
	// 	}
	// 	var step = $(v).attr('data-step') || 0.1;
	// 	var gap = $(v).attr('data-gap') || 4;
	// 	var num = 0;
	// 	$(v)
	// 		.find('.item,.ev')
	// 		.each(function (j, m) {
	// 			num++;
	// 			if (j % gap == 0) {
	// 				num = 0;
	// 			}
	// 			var delay = (num + 1) * step;
	// 			$(m).css('animation-delay', delay + 's');
	// 		});
	// });
	// strategy
	$('.strategy-hero .model-btn').click(function () {
		var index = $(this).index();
		SetOn('.strategy-hero .model-btn', index);
		SetOn('.strategy-hero .info .ev', index);
		SetOn('.input-group', index);
	});

	//
	$('.strategy2 .tab-group .tab').click(function () {
		var index = $(this).index();
		SetOn('.strategy2 .tab-group .tab', index);
		SetOn('.strategy2 .C-list1', index);
		scrollToNextPosition();
	});
	// $('.tutorial2 .tab-group .tab').click(function () {
	// 	var index = $(this).index();
	// 	SetOn('.tutorial2 .tab-group .tab', index);
	// 	SetOn('.tutorial2 .C-list3', index);
	// 	scrollToNextPosition();
	// });

	// $('.tool4 .tab-group .tab').click(function () {
	// 	var index = $(this).index();
	// 	SetOn('.tool4 .tab-group .tab', index);
	// 	SetOn('.tool4 .C-list1', index);
	// 	scrollToNextPosition();
	// });
	// tool
	// 切换高亮&滚动
	$(window).on('scroll', function () {
		switchOn();
		// switchOn2();
	});
	switchOn();
	// switchOn2();
	function switchOn() {
		var realT = $('html,body').scrollTop();
		var arr = [];
		$('.tool3-section').each(function (i, v) {
			var vReal = $(v).offset().top,
				screen = $(window).height() / 2;
			if (vReal < realT + screen) {
				arr[i] = i;
			}
		});
		var currentOn;
		if (arr.length > 0) {
			currentOn = arr.length - 1;
		}
		//  else {
		// 	currentOn = arr.length;
		// }
		$('.tool3 .tab').removeClass('on').eq(currentOn).addClass('on');
	}
	// 其他通用页面
	function switchOn2() {
		var realT = $('html,body').scrollTop();
		var arr = [];
		$('.hashlistSection').each(function (i, v) {
			var vReal = $(v).offset().top,
				screen = $(window).height() / 2;
			if (vReal < realT + screen) {
				arr[i] = i;
			}
		});
		// console.log(arr);
		var currentOn;
		if (arr.length > 0) {
			currentOn = arr.length - 1;
		}
		$('.hashlist .tab').removeClass('on').eq(currentOn).addClass('on');
	}
	//
	new Swiper('.tool4 .swiper', {
		speed: 1000,
		autoplay: {
			delay: 3000,
			stopOnLastSlide: false,
			disableOnInteraction: false,
		},
		// rewind: true, //“倒带”模式
		loop: true,
		pagination: {
			el: '.tool4 .swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.tool4 .next',
			prevEl: '.tool4 .prev',
		},
	});
	//
	function initMagneticButtons() {
		// Magnetic Buttons
		// Found via: 
		var magnets = document.querySelectorAll('.magnetic');
		var strength = 100;

		// START : If screen is bigger as 540 px do magnetic
		if (window.innerWidth > 540) {
			// Mouse Reset
			magnets.forEach((magnet) => {
				magnet.addEventListener('mousemove', moveMagnet);
				$(this.parentNode).removeClass('not-active');
				magnet.addEventListener('mouseleave', function (event) {
					gsap.to(event.currentTarget, 1.5, {
						x: 0,
						y: 0,
						ease: Elastic.easeOut,
					});
					gsap.to($(this).find('.btn-text'), 1.5, {
						x: 0,
						y: 0,
						ease: Elastic.easeOut,
					});
				});
			});

			// Mouse move
			function moveMagnet(event) {
				var magnetButton = event.currentTarget;
				var bounding = magnetButton.getBoundingClientRect();
				var magnetsStrength = magnetButton.getAttribute('data-strength');
				var magnetsStrengthText = magnetButton.getAttribute('data-strength-text');

				gsap.to(magnetButton, 1.5, {
					x: ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) * magnetsStrength,
					y: ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) * magnetsStrength,
					rotate: '0.001deg',
					ease: Power4.easeOut,
				});
				gsap.to($(this).find('.btn-text'), 1.5, {
					x: ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) * magnetsStrengthText,
					y: ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) * magnetsStrengthText,
					rotate: '0.001deg',
					ease: Power4.easeOut,
				});
			}
		} // END : If screen is bigger as 540 px do magnetic

		var isWhiteHead = $('.white-head').length;
		// Mouse Enter
		$('.magnetic').on('mouseenter', function () {
			var isHeadBtn = $(this).hasClass('signup-btn');
			var isWhiteHeadBtn = isWhiteHead && isHeadBtn;

			if ($(this).find('.btn-fill').length) {
				gsap.to($(this).find('.btn-fill'), 0.6, {
					startAt: { y: '76%' },
					y: '0%',
					ease: Power2.easeInOut,
				});
			}
			if ($(this).find('.btn-text-inner.change').length) {
				gsap.to($(this).find('.btn-text-inner.change'), 0.3, {
					startAt: { color: isWhiteHeadBtn ? '#ffffff' : '#171717' },
					color: isWhiteHeadBtn ? '#000000' : '#FFFFFF',
					ease: Power3.easeIn,
				});
			}
			$(this.parentNode).removeClass('not-active');
		});

		// Mouse Leave
		$('.magnetic').on('mouseleave', function () {
			var isHeadBtn = $(this).hasClass('signup-btn');
			var isWhiteHeadBtn = isWhiteHead && isHeadBtn;
			if ($(this).find('.btn-fill').length) {
				gsap.to($(this).find('.btn-fill'), 0.6, {
					y: '-76%',
					ease: Power2.easeInOut,
				});
			}
			if ($(this).find('.btn-text-inner.change').length) {
				gsap.to($(this).find('.btn-text-inner.change'), 0.3, {
					color: isWhiteHeadBtn ? '#ffffff' : '#171717',
					ease: Power3.easeOut,
					delay: 0.3,
				});
			}

			$(this.parentNode).removeClass('not-active');
		});
	}

	setTimeout(() => {
		initMagneticButtons();
	}, 1000);

	//鼠标跟随效果
	// let mql = window.matchMedia('(min-width: 480px)');
	// if (mql.matches) {
	// 	const $bigBall = document.querySelector('.cursor__ball--big');
	// 	const $smallBall = document.querySelector('.cursor__ball--small');
	// 	const $hoverables = document.querySelectorAll('.hoverable');
	// 	const $hoverablesLarge = document.querySelectorAll('.hoverable--large');
	// 	$bigBall.style.transform = 'translateX(' + window.clientX + 'px)';
	// 	$bigBall.style.transform = 'translateY(' + window.clientY + 'px)';
	// 	$smallBall.style.transform = 'translateX(' + window.clientX + 'px)';
	// 	$smallBall.style.transform = 'translateY(' + window.clientY + 'px)';
	// 	// Listeners
	// 	window.addEventListener('mousemove', onMouseMove);
	// 	for (let i = 0; i < $hoverables.length; i++) {
	// 		$hoverables[i].addEventListener('mouseenter', onMouseHover);
	// 		$hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
	// 	}
	// 	for (let i = 0; i < $hoverablesLarge.length; i++) {
	// 		$hoverablesLarge[i].addEventListener('mouseenter', onMouseHoverLarge);
	// 		$hoverablesLarge[i].addEventListener('mouseleave', onMouseHoverOut);
	// 	}
	// 	// Move the cursor
	// 	function onMouseMove(e) {
	// 		gsap.to($bigBall, 0.6, {
	// 			x: e.clientX - 30,
	// 			y: e.clientY - 30,
	// 			opacity: 1,
	// 		});
	// 		gsap.to($smallBall, 0.1, {
	// 			x: e.clientX - 7,
	// 			y: e.clientY - 7,
	// 			opacity: 1,
	// 		});
	// 	}
	// 	// Hover an element
	// 	function onMouseHover() {
	// 		gsap.to($bigBall, 0.3, {
	// 			scale: 2.2,
	// 		});
	// 	}

	// 	function onMouseHoverLarge() {
	// 		gsap.to($bigBall, 0.3, {
	// 			scale: 5,
	// 		});
	// 	}

	// 	function onMouseHoverOut() {
	// 		gsap.to($bigBall, 0.3, {
	// 			scale: 1,
	// 		});
	// 	}

	// 	$('.canvas-wrapper').on('mouseenter', function () {
	// 		$('.cursor__ball').hide();
	// 	});
	// 	$('.canvas-wrapper').on('mouseleave', function () {
	// 		$('.cursor__ball').show();
	// 	});
	// }

	//
	setTimeout(() => {
		animateText();
	}, 500);
	function animateText() {
		var viewX = document.documentElement.clientWidth;
		// if (viewX < 1024) {
		// 	return;
		// }
		// 小字
		if (document.querySelector('[animateText]')) {
			$('[animateText]').each(function (i, e) {
				let split = new SplitText(e, { type: 'chars' });
				// 'chars,words,lines'
				var delay = e.getAttribute('data-delay');
				var len = split.chars.length;
				delay === null ? (delay = 0.02) : delay;
				// len/26400
				gsap.from(split.chars, {
					autoAlpha: 0,
					rotationX: -45,
					x: 2,
					stagger: delay,
					scrollTrigger: {
						trigger: e,
						start: 'top 80%',
						toggleActions: 'play none none none',
					},
					onStart: function () {
						$(e).addClass('on');
					},
				});
			});
		}
	}
	//
	var initialSlide = $('.menumob .swiper-slide.on').index() || 0;
	new Swiper('.head1 .swiper', {
		speed: 600,
		initialSlide: initialSlide,
		normalizeSlideIndex: false,
		slideToClickedSlide: true,
		slidesPerView: 'auto',
		spaceBetween: 20,
	});
});
//
//
//
//
//
//
//
//
//
//
//
//
function SetOn(sel, index) {
	$(sel).eq(index).addClass('on').siblings().removeClass('on');
}
// 防抖
function debounce(fn, delay) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(this, args), delay);
	};
}
// 节流
function throttle(fn, limit) {
	let lastCall = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - lastCall >= limit) {
			lastCall = now;
			return fn.apply(this, args);
		}
	};
}

function initWow(w) {
	if (typeof WOW != 'function') {
		return;
	}
	if (!/msie [6|7|8|9]/i.test(navigator.userAgent)) {
		new WOW({
			offset:w>768?100:0
		}).init();
	}
}

function initLenis() {
	function shouldDisableSmoothScrolling() {
		// 1. 检查硬件并发数
		const concurrency = navigator.hardwareConcurrency || 4;

		// 2. 检查设备内存（如果可用）
		const memory = navigator.deviceMemory || 4;

		return concurrency <= 2 || memory < 2

		// // 3. 运行小型性能测试
		// const start = performance.now();
		// let sum = 0;
		// for (let i = 0; i < 100000; i++) {
		// 	sum += Math.sqrt(i);
		// }
		// const perfDuration = performance.now() - start;
		// console.log({ 检查硬件并发数: concurrency, 设备内存: memory });
		// console.log('性能测试耗时：', perfDuration.toFixed(2), 'ms');

		// // 综合判断条件
		// return concurrency <= 2 || memory < 2 || perfDuration > 5;
	}
	if (shouldDisableSmoothScrolling()) {
		console.log('低性能设备，禁用Lenis平滑滚动');
		return;
	}
	if (typeof Lenis == 'function') {
		const lenis = new Lenis({
			lerp: 0.06,
			// wheelMultiplier: 0.7,
			// infinite: false,
			// gestureOrientation: 'vertical',
			normalizeWheel: false,
			smoothTouch: false,
			syncTouchLerp: 1,
			touchMultiplier: 0.1,
			autoResize: true,

			prevent: (node) => {
				return node.classList.contains('gdt');
			},
		});
		lenis.on('scroll', (e) => {});
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// const images = document.querySelectorAll('img');
		// images.forEach((img) => {
		// 	img.addEventListener('load', () => {
		// 		lenis.resize();
		// 	});
		// });

		// window.addEventListener('load', function () {
		// 	lenis.resize();
		// });
	}
}

function initEAlert() {
	/**
	 * 弹窗提示
	 * @param {*} config(title、btnText)
	 * @param {*} cb(closed:关闭弹窗)
	 */

	// EAlert(
	// 	{
	// 		title: '订阅成功',
	// 		desc: '订阅成功副标题',
	// 		btnText: '我知道了',
	// 	},
	// 	function cb(closed,parentId) {
	// 		console.log('点击按钮的回调');
	//    closed();//关闭弹窗
	// 	},
	// 	function closecb() {
	// 		console.log('关闭弹窗后的回调');
	// 	},
	// );
	function EAlert(config, cb, closecb) {
		var key = Date.parse(new Date()) + '' + parseInt(Math.random());
		var btnText = config.btnText || 'CONFIRM';
		var html = `
  <div class="C-Alert" id="C-Alert-${key}">
    <div class="alertPop">
			<div class="alert-content">
				<div class="close"></div>
				<div class="tips">${config.title}</div>
				<div class="desc">${config.desc}</div>
				<div class="btn ${btnText ? '' : 'hide'}" data-key="${key}">${btnText}</div>
			</div>
    </div>
  </div>
  `;
		$('body').append(html);
		// $('html').addClass('act');

		function closed() {
			$('#C-Alert-' + key).remove();
			// $('html').removeClass('act');
		}
		$('body').on('click', '#C-Alert-' + key + ' .alertPop .btn', function () {
			if (cb) {
				var parentId = '#C-Alert-' + key;
				cb(closed, parentId);
			} else {
				closed();
			}
		});
		$('body').on('click', '#C-Alert-' + key + ' .close', function () {
			closed();
			if (closecb) {
				closecb();
			}
		});
	}
	window.EAlert = EAlert;
}

function lazyLoad() {
	const placeholder = '/img/loading.gif'; // 占位图路径

	function loadImgs() {
		const lazyImages = document.querySelectorAll('.lazy[data-src]');
		lazyImages.forEach(function (img) {
			// 如果还没有 src，说明第一次进入页面，可以设置占位图
			// if (!img.src) {
			// 	img.src = placeholder;
			// }

			const rect = img.getBoundingClientRect();
			if (rect.top - 400 < window.innerHeight && img.getAttribute('data-src')) {
				const realSrc = img.getAttribute('data-src');
				const tempImg = new Image();
				tempImg.onload = function () {
					img.src = realSrc;
					img.removeAttribute('data-src');
					img.classList.add('loaded'); // 可选：用于加动画效果
					img.classList.remove('lazy');
				};
				tempImg.src = realSrc;
			}
		});
	}

	window.addEventListener('scroll', throttle(loadImgs, 200));
	window.addEventListener('resize', throttle(loadImgs, 200));
	// 兜底：DOM 就绪和 window load 后各跑一次，避免首屏时序导致的"破图闪现"
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadImgs);
	}
	window.addEventListener('load', loadImgs);
	loadImgs();

	// function lazyLoad() {
	// 	const imgs = document.querySelectorAll('img.lazy');
	// 	imgs.forEach((img) => {
	// 		const rect = img.getBoundingClientRect();
	// 		const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
	// 		if (inViewport) {
	// 			img.src = img.dataset.src;
	// 			img.classList.remove('lazy'); // 移除lazy类，避免重复加载
	// 		}
	// 	});
	// }

	// window.addEventListener('scroll', throttle(lazyLoad, 200));
	// window.addEventListener('resize', throttle(lazyLoad, 200));
	// document.addEventListener('DOMContentLoaded', lazyLoad);
}

/**
 * jQuery + GSAP 数字滚动动画
 * @param {jQuery} $el - jQuery元素
 * @param {number} end - 目标值
 * @param {number} duration - 动画时长（秒）
 * @param {string} format - 输出格式:
 *   "int"     => 整数（默认）
 *   "float"   => 保留两位小数
 *   "comma"   => 千分位 + 两位小数
 */
function animateNumber($el, end, duration = 2, format = 'int') {
	let start = parseFloat($el.text().replace(/,/g, '')) || 0;
	let obj = {
		val: start,
	};

	gsap.to(obj, {
		val: end,
		duration: duration,
		ease: 'power1.out',
		onUpdate: function () {
			let output;
			switch (format) {
				case 'float':
					output = obj.val.toFixed(2);
					break;
				case 'comma':
					output = obj.val.toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					});
					break;
				case 'int':
				default:
					output = Math.round(obj.val);
					break;
			}
			$el.text(output);
		},
	});
}

function scrollClass() {
	var scrollTop = 0;
	$(document).on('mousewheel', function (event) {
		var delta = event.originalEvent.deltaY || -event.originalEvent.detail;
		if (delta > 0 && scrollTop > 10) {
			$('body').addClass('isback');
		} else {
			$('body').removeClass('isback');
		}
	});
	$(document).on('scroll', function () {
		scrollTop = $(this).scrollTop();

		if (scrollTop > this.prevScrollTop) {
			$('body').addClass('isback');
		} else {
			$('body').removeClass('isback');
		}

		if (scrollTop > 10) {
			$('body').addClass('scroll');
		} else {
			$('body').removeClass('scroll');
		}
		this.prevScrollTop = scrollTop <= 0 ? 0 : scrollTop;
	});
}

// 设置 Cookie 的辅助函数
function setCookie(name, value, days) {
	var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// 获取 Cookie 的辅助函数
function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * 获取当前滚动位置并滚动到当前位置+1的位置
 */
var scrollToNextPositionFlag = false;
function scrollToNextPosition() {
	// 获取当前滚动条位置
	var currentPosition = $(window).scrollTop();

	// 计算新的滚动位置（当前+1）
	var newPosition = null;
	if (scrollToNextPositionFlag) {
		newPosition = currentPosition + 1;
	} else {
		// newPosition = currentPosition - 1;
		newPosition = currentPosition + 1;
	}
	scrollToNextPositionFlag = !scrollToNextPositionFlag;

	// 平滑滚动到新位置
	$('html, body').animate(
		{
			scrollTop: newPosition,
		},
		50
	); // 50毫秒的动画时间，可以根据需要调整
}
window.scrollToNextPosition = scrollToNextPosition;
// 首页交互逻辑
$(function () {
	// 按钮悬停效果
	$('.btn').hover(
		function () {
			$(this).css('transform', 'scale(1.02)');
		},
		function () {
			$(this).css('transform', 'scale(1)');
		}
	);

	// 滚动动画效果
	gsap.registerPlugin(ScrollTrigger);

	// gsap.from('.future-text', {
	// 	duration: 1,
	// 	opacity: 0,
	// 	y: 100,
	// 	ease: 'power3.out',
	// 	delay: 0.2,
	// });

	// gsap.from('.hero-desc', {
	// 	duration: 1,
	// 	opacity: 0,
	// 	y: 50,
	// 	ease: 'power3.out',
	// 	delay: 0.4,
	// });

	// gsap.from('.button-area', {
	// 	duration: 1,
	// 	opacity: 0,
	// 	y: 50,
	// 	ease: 'power3.out',
	// 	delay: 0.6,
	// });

	// 滚动触发动画
	gsap.from('.business-canvas', {
		scrollTrigger: {
			trigger: '.business-canvas',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none none',
		},
		duration: 1,
		opacity: 0,
		y: 100,
		ease: 'power3.out',
	});

	gsap.from('.app-content', {
		scrollTrigger: {
			trigger: '.app-section',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none none',
		},
		duration: 1,
		opacity: 0,
		x: -100,
		ease: 'power3.out',
	});

	gsap.from('.app-image img', {
		scrollTrigger: {
			trigger: '.app-section',
			start: 'top 80%',
			end: 'bottom 20%',
			toggleActions: 'play none none none',
		},
		duration: 1,
		opacity: 0,
		x: 100,
		ease: 'power3.out',
	});

	var path1 =
		'M23.5925 12.7768C24.1178 12.7743 24.6432 12.7707 25.1685 12.7662L25.4589 12.7634C28.2476 12.7428 30.1552 15.0074 29.6664 17.7514L28.1329 26.3641C27.8 28.2383 26.0107 29.7357 24.111 29.7372L9.91525 29.7499C9.54117 29.7494 9.18244 29.6011 8.91712 29.3374C8.65181 29.0736 8.50139 28.7158 8.49858 28.3417L8.47167 15.5924C8.47163 15.2204 8.61796 14.8632 8.87906 14.5981C9.14016 14.3331 9.49506 14.1814 9.86708 14.1758L9.97192 14.1737C10.1455 14.1722 10.3636 14.1722 10.6236 14.1737C13.6765 14.1992 16.2973 11.295 16.2917 8.49778C16.2867 5.6177 17.6127 4.28886 19.8263 4.26195C21.8932 4.23715 23.3658 6.24103 23.3906 9.2132C23.3977 10.0965 23.1816 11.6449 22.9089 12.7804C23.1143 12.7804 23.3431 12.7782 23.5925 12.7768ZM8.06704 14.8763L8.08333 29.0402C8.08362 29.1339 8.06527 29.2268 8.02935 29.3134C7.99343 29.4 7.94065 29.4786 7.87409 29.5447C7.80752 29.6107 7.7285 29.6629 7.6416 29.6981C7.55471 29.7333 7.46168 29.7509 7.36792 29.7499H5.96471C5.87104 29.7507 5.77813 29.733 5.69136 29.6977C5.60459 29.6624 5.52568 29.6102 5.45921 29.5442C5.39274 29.4782 5.34003 29.3997 5.30411 29.3131C5.2682 29.2266 5.24981 29.1338 5.25 29.0402L5.25142 14.8763C5.25095 14.7829 5.26901 14.6904 5.30455 14.604C5.3401 14.5176 5.39243 14.4392 5.4585 14.3732C5.52458 14.3071 5.60309 14.2549 5.68949 14.2194C5.7759 14.184 5.86848 14.166 5.96188 14.1666H7.35588C7.74333 14.1666 8.06704 14.4846 8.06704 14.8763Z';
	var path2 =
		'M23.5925 12.7768C24.1178 12.7743 24.6432 12.7708 25.1685 12.7662L25.4589 12.7634C28.2476 12.7428 30.1552 15.0074 29.6664 17.7515L28.1329 26.3641C27.8 28.2383 26.0107 29.7357 24.111 29.7372L9.91525 29.7499C9.54117 29.7494 9.18244 29.6011 8.91712 29.3374C8.65181 29.0737 8.50139 28.7158 8.49858 28.3417L8.47167 15.5925C8.47163 15.2204 8.61796 14.8632 8.87906 14.5982C9.14016 14.3331 9.49506 14.1814 9.86708 14.1758L9.97192 14.1737C10.1455 14.1722 10.3636 14.1722 10.6236 14.1737C13.6765 14.1992 17 10.5001 20 8.99994C21 8.49987 22.1911 8.28194 22.9089 8.9999C23.4089 9.49997 26.3418 12.1815 26.5 12.8676C26.7067 13.764 25 12.7676 22.9089 12.7804C23.1143 12.7804 23.3431 12.7782 23.5925 12.7768ZM8.06704 14.8763L8.08333 29.0402C8.08362 29.1339 8.06527 29.2268 8.02935 29.3134C7.99343 29.4 7.94065 29.4786 7.87409 29.5447C7.80752 29.6107 7.7285 29.6629 7.6416 29.6981C7.55471 29.7333 7.46168 29.7509 7.36792 29.7499H5.96471C5.87104 29.7508 5.77813 29.733 5.69136 29.6977C5.60459 29.6624 5.52568 29.6102 5.45921 29.5442C5.39274 29.4782 5.34003 29.3997 5.30411 29.3131C5.2682 29.2266 5.24981 29.1338 5.25 29.0402L5.25142 14.8763C5.25095 14.7829 5.26901 14.6904 5.30455 14.604C5.3401 14.5176 5.39243 14.4392 5.4585 14.3732C5.52458 14.3072 5.60309 14.2549 5.68949 14.2194C5.7759 14.184 5.86848 14.166 5.96188 14.1666H7.35588C7.74333 14.1666 8.06704 14.4846 8.06704 14.8763Z';
	gsap.set('#givepath', {
		attr: { d: path1 },
	});
	$('.giveLike').hover(
		function () {
			gsap.to('#givepath', {
				attr: { d: path2 },
				duration: 0.3,
				ease: 'power2.inOut',
			});
		},
		function () {
			gsap.to('#givepath', {
				attr: { d: path1 },
				duration: 0.3,
				ease: 'power2.inOut',
			});
		}
	);

	// 移动端适配
	// function checkMobile() {
	// 	if ($(window).width() <= 768) {
	// 		// 移动端逻辑
	// 		gsap.set('.app-image img', { clearProps: 'all' });
	// 		gsap.set('.app-content', { clearProps: 'all' });

	// 		// 重新设置移动端动画
	// 		ScrollTrigger.refresh();
	// 	}
	// }

	// // 初始检查和窗口调整时检查
	// checkMobile();
	// $(window).resize(function () {
	// 	checkMobile();
	// });
});
function showPayCode() {
	if (typeof checkInterval != 'undefined') {
		clearInterval(checkInterval);
	}
	var code_url = '/pay/wechatnative.php?timestamp=' + Date.now();
	$('#tc-payment-pro .wxqr').attr('src', code_url);
	var checkInterval = setInterval(function () {
		$.ajax({
			url: '/pay/check_payment.php',
			type: 'POST',
			dataType: 'json',
			success: function (response) {
				if (response.code == 200) {
					clearInterval(checkInterval);
					location.reload(); // 支付成功后刷新页面
				}
			},
		});
	}, 3000);
}

function showPayCode2() {
	if (typeof checkInterval != 'undefined') {
		clearInterval(checkInterval);
	}
	var code_url = '/pay/wechatnative2.php?timestamp=' + Date.now();
	$('.tc-payment2 .wxqr').attr('src', code_url);
	var checkInterval = setInterval(function () {
		$.ajax({
			url: '/pay/check_payment2.php',
			type: 'POST',
			dataType: 'json',
			success: function (response) {
				if (response.code == 200) {
					clearInterval(checkInterval);
					location.reload(); // 支付成功后刷新页面
				}
			},
		});
	}, 3000);
}
function showPayCode3() {
	if (typeof checkInterval != 'undefined') {
		clearInterval(checkInterval);
	}
	var code_url = '/pay/wechatnative_1.php?timestamp=' + Date.now();
	$('.tc-payment3 .wxqr').attr('src', code_url);
	var checkInterval = setInterval(function () {
		$.ajax({
			url: '/pay/check_payment.php',
			type: 'POST',
			dataType: 'json',
			success: function (response) {
				if (response.code == 200) {
					clearInterval(checkInterval);
					location.reload(); // 支付成功后刷新页面
				}
			},
		});
	}, 3000);
}

function showPayCodeLifetime() {
	if (typeof checkIntervalLifetime != 'undefined') {
		clearInterval(checkIntervalLifetime);
	}
	var code_url = '/pay/wechatnative_lifetime.php?timestamp=' + Date.now();
	$('.tc-payment-lifetime .wxqr').attr('src', code_url);
	var checkIntervalLifetime = setInterval(function () {
		$.ajax({
			url: '/pay/check_payment.php',
			type: 'POST',
			dataType: 'json',
			success: function (response) {
				if (response.code == 200) {
					clearInterval(checkIntervalLifetime);
					location.reload();
				}
			},
		});
	}, 3000);
}

function showPayCodeBiz() {
	if (typeof checkIntervalBiz != 'undefined') {
		clearInterval(checkIntervalBiz);
	}
	var code_url = '/pay/wechatnative_biz.php?timestamp=' + Date.now();
	$('#tc-payment-biz .wxqr').attr('src', code_url);
	var checkIntervalBiz = setInterval(function () {
		$.ajax({
			url: '/pay/check_payment_biz.php',
			type: 'POST',
			dataType: 'json',
			success: function (response) {
				if (response.code == 200) {
					clearInterval(checkIntervalBiz);
					location.reload();
				}
			},
		});
	}, 3000);
}

function payStrategy() {
	$('.tc-payment2').addClass('on');
	showPayCode2();
}
// 登录，付费逻辑
$(function () {
	var w = $(window).width();
	var pc = w > 768;
	function toVw(px) {
		return (px / 1920) * w;
	}

	let mask = {
		open: () => {
			$('.mask1').addClass('on');
		},
		close: () => {
			$('.mask1').removeClass('on');
		},
	};
	function showCode() {
		// PC 登录已改为扫码关注公众号,改走 common/js.php 的 refreshPcLogin()
		if (typeof refreshPcLogin === 'function') { refreshPcLogin(); return; }
		$.ajax({
			url: '/user/WechatCode.php',
			type: 'post',
			dataType: 'json',
			success: function (res) {
				$('.tc-login .wxqr frame').attr('src', res.imgurl);
			},
		});
	}
	// 打开登录（每次都恢复默认面板：海外=邮箱、国内 PC=微信、国内移动=手机号）
	$('.signup-btn').on('click', function () {
		mask.open();
		$('.tc-login').addClass('on');
		if (typeof resetLoginPanel === 'function') resetLoginPanel();
	});
	// 登录-获取验证码（仅手机号，排除邮箱按钮）
	var getcodetime = 60;
	$('.tc-login .getcode').not('.getcode-email').click(function () {
		var tel = $('.tc-login input[name="tel"]').val();
		if (!tel) {
			window.lightTips('请输入手机号');
			return;
		}
		$(this).prop('disabled', true);
		var timer = setInterval(function () {
			getcodetime--;
			$('.tc-login .getcode').text(getcodetime);
			if (getcodetime <= 0) {
				$('.tc-login .getcode').prop('disabled', false);
				$('.tc-login .getcode').text('重新发送');
				getcodetime = 60;
				clearInterval(timer);
			}
		}, 1000);
		$.ajax({
			url: '/sms/send-code.php',
			data: {
				mobile: tel,
				type: 2,
			},
			dataType: 'json',
			type: 'post',
			success: function (res) {
				window.lightTips(res.msg);
			},
		});
	});
	// 登录-邮箱获取验证码
	var getEmailCodeTime = 60;
	$('.tc-login .getcode-email').click(function () {
		var email = $('.tc-login input[name="email"]').val();
		if (!email) {
			window.lightTips('请输入邮箱');
			return;
		}
		var $btn = $(this);
		$btn.prop('disabled', true);
		var timer = setInterval(function () {
			getEmailCodeTime--;
			$btn.text(getEmailCodeTime);
			if (getEmailCodeTime <= 0) {
				$btn.prop('disabled', false);
				$btn.text('获取验证码');
				getEmailCodeTime = 60;
				clearInterval(timer);
			}
		}, 1000);
		$.ajax({
			url: '/email/send-code.php',
			data: { email: email, type: 1 },
			dataType: 'json',
			type: 'post',
			success: function (res) {
				window.lightTips(res.msg || (res.code == 200 ? '发送成功' : '发送失败'));
				if (res.code != 200) {
					$btn.prop('disabled', false);
					$btn.text('获取验证码');
					getEmailCodeTime = 60;
					clearInterval(timer);
				}
			},
			error: function () {
				window.lightTips('网络异常，请稍后重试');
				$btn.prop('disabled', false);
				$btn.text('获取验证码');
				getEmailCodeTime = 60;
				clearInterval(timer);
			},
		});
	});
	// 登录-邮箱提交
	$('.tc-login .submit-email').click(function () {
		var email = $('.tc-login input[name="email"]').val();
		var code = $('.tc-login input[name="email_code"]').val();
		var cdk  = $('.tc-login input[name="email_cdk"]').val() || '';
		if (!email) {
			window.lightTips('请输入邮箱');
			return;
		}
		if (!code) {
			window.lightTips('请输入验证码');
			return;
		}
		$.ajax({
			url: '/user/login-email.php',
			data: { email: email, code: code, cdk: cdk },
			dataType: 'json',
			type: 'post',
			success: function (res) {
				if (res.code == 200) {
					var msg = '登录成功,欢迎来到刺猬星球Suepr-i';
					// 兑换码填写了 → 后端会返回 cdk_msg,合并提示
					if (res.cdk_msg) {
						msg += '(' + res.cdk_msg + ')';
					}
					window.lightTips(msg);
					mask.close();
					$('.tc-layout').removeClass('on');
					var _rd = sessionStorage.getItem('login_redirect');
					if (_rd) {
						sessionStorage.removeItem('login_redirect');
						window.location.href = _rd;
					} else {
						location.reload();
					}
				} else {
					window.lightTips(res.msg || '登录失败，请重试');
				}
			},
			error: function () {
				window.lightTips('网络异常，请稍后重试');
			},
		});
	});
	// 登录提交（仅手机号，排除邮箱按钮）
	$('.tc-login .submit').not('.submit-email').click(function () {
		var tel = $('.tc-login input[name="tel"]').val();
		var telcode = $('.tc-login input[name="code"]').val();
		if (!tel) {
			window.lightTips('请输入手机号');
			return;
		}
		if (!telcode) {
			window.lightTips('请输入验证码');
			return;
		}

		$.ajax({
			url: '/user/login.php',
			data: {
				mobile: tel,
				code: telcode,
			},
			dataType: 'json',
			type: 'post',
			success: function (res) {
				if (res.code == 200) {
					window.lightTips('登录成功,欢迎来到刺猬星球Suepr-i');
					mask.close();
					$('.tc-layout').removeClass('on');
					var _rd = sessionStorage.getItem('login_redirect');
					if(_rd){ sessionStorage.removeItem('login_redirect'); window.location.href = _rd; }
					else{ location.reload(); }
				} else {
					window.lightTips(res.msg || '登录失败，请重试');
				}
			},
			error: function(){
				window.lightTips('网络异常，请稍后重试');
			}
		});
	});
	// 绑定手机号-获取验证码
	var supplementTime = 60;
	$('.tc-supplement .getcode').click(function () {
		var tel = $('.tc-supplement input[name="tel"]').val();
		if (!tel) {
			window.lightTips('请输入手机号');
			return;
		}
		$(this).prop('disabled', true);
		var timer = setInterval(function () {
			supplementTime--;
			$('.tc-supplement .getcode').text(supplementTime);
			if (supplementTime <= 0) {
				$('.tc-supplement .getcode').prop('disabled', false);
				$('.tc-supplement .getcode').text('重新发送');
				supplementTime = 60;
				clearInterval(timer);
			}
		}, 1000);
		$.ajax({
			url: '/sms/send-code.php',
			data: {
				mobile: tel,
				type: 2,
			},
			dataType: 'json',
			type: 'post',
			success: function (res) {
				window.lightTips(res.msg);
			},
		});
	});
	// 绑定手机号提交
	// confirmMerge: 当手机号已被其他账号注册时,弹出确认后带 1 重新提交,执行账号合并 + 会员权益同步
	function submitBanMobile(tel, telcode, confirmMerge) {
		$.ajax({
			url: '/user/ban-mobile.php',
			data: {
				mobile: tel,
				code: telcode,
				confirm_merge: confirmMerge ? 1 : 0,
			},
			dataType: 'json',
			type: 'post',
			success: function (res) {
				if (res.code == 200) {
					window.lightTips(res.merged ? '账号合并成功,已同步会员权益' : '绑定手机成功,欢迎来到刺猬星球Super-i');
					mask.close();
					$('.tc-layout').removeClass('on');
					// 首次绑定手机号 = 首次注册新用户 → 设标记,跳转/刷新后自动弹"开通会员"弹窗
					// header.php 末尾有一段 PHP+JS:登录态 && 非会员 && 检测到 letter_postLogin=tcPro 时打开 #tc-pro
					// 已是会员 / 终身 / 企业会员的用户不会跳进这个分支,所以不会重复打扰
					try { sessionStorage.setItem('letter_postLogin', 'tcPro'); } catch(e){}
					var _rd = sessionStorage.getItem('login_redirect');
					if(_rd){ sessionStorage.removeItem('login_redirect'); window.location.href = _rd; }
					else{ location.reload(); }
				} else if (res.code == 409) {
					// 手机号已被其他账号注册 → 二次确认是否合并到当前微信
					if (window.confirm('该账户已注册,是否确认合并到此微信,并同步会员权益?\n\n合并后该手机号原账号的会员权益、超级币、收藏等将归入当前微信账号。')) {
						submitBanMobile(tel, telcode, true);
					}
				} else {
					window.lightTips(res.msg);
				}
			},
			error: function () {
				window.lightTips('网络异常,请稍后重试');
			},
		});
	}
	$('.tc-supplement .submit').click(function () {
		var tel = $('.tc-supplement input[name="tel"]').val();
		var telcode = $('.tc-supplement input[name="code"]').val();
		if (!tel) {
			window.lightTips('请输入手机号');
			return;
		}
		if (!telcode) {
			window.lightTips('请输入验证码');
			return;
		}
		submitBanMobile(tel, telcode, false);
	});
	// 打开用户信息
	if (pc) {
		$('.logged-simple').on('mouseenter', function () {
			$('.user-info').addClass('on');
		});
	} else {
		$('.logged-simple').on('click', function () {
			$('.user-info').addClass('on');
			$('.loggedbox .tc-close').addClass('on');
		});
	}
	// 关闭用户信息
	if (pc) {
		$('.user-info').on('mouseleave', function () {
			$('.user-info').removeClass('on');
		});
	} else {
		$('.loggedbox .tc-close').on('click', function () {
			$('.user-info').removeClass('on');
			$('.loggedbox .tc-close').removeClass('on');
		});
	}
	// 倒计时
	function countDown() {
		// 遍历所有的倒计时元素
		$('.C-djs').each(function () {
			const $djsContainer = $(this);
			const $djsBox = $djsContainer.find('.djs-box');

			// 获取结束时间（从data-endTime属性中获取）
			const endTimeStr = $djsContainer.attr('data-endtime');
			console.log(endTimeStr);
			const endTime = new Date(endTimeStr).getTime();

			// 更新倒计时函数
			function updateCountdown() {
				// 获取当前时间
				const now = new Date().getTime();

				// 计算剩余时间（毫秒）
				const distance = endTime - now;

				// 如果时间已到，停止倒计时
				if (distance < 0) {
					clearInterval(countdownTimer);
					$djsBox.html('<div class="f_26">活动已结束</div>');
					return;
				}

				// 计算天、小时、分钟
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				// 倒计时单位多语言:中文/繁体保持原样,其他语言用 d/h/m/s 短格式
				// (英文/日文等用完整 "days hours minutes seconds" 太长会撑爆容器)
				const _lang = (document.documentElement.getAttribute('data-site-lang') || 'zh').toLowerCase();
				const _isZh = (_lang === 'zh' || _lang === 'zh_tw' || _lang === 'zh-cn' || _lang === 'zh-tw');
				let timeStr;
				if (_isZh) {
					timeStr = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
				} else {
					// 通用短格式:1d 3h 28m 49s
					timeStr = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
				}
				$djsBox.text(timeStr);
			}

			// 立即执行一次更新
			updateCountdown();

			// 设置定时器，每秒更新一次
			var countdownTimer = setInterval(updateCountdown, 1000);
		});
	}
	countDown();
	// 加入会员
	$('#joinPro').on('click', function () {
		$('.user-info').removeClass('on');
		$('#tc-pro .sec3 > .item').show();
		$('#tc-pro .sec3 > .item.qiye').hide();
		mask.open();
		$('#tc-pro').addClass('on');
	});
	// 加入会员-个人中心
	$('#joinPro-user').on('click', function () {
		$('.user-info').removeClass('on');
		$('#tc-pro .sec3 > .item').show();
		$('#tc-pro .sec3 > .item.qiye').hide();
		mask.open();
		$('#tc-pro').addClass('on');
	});
	$('.joinPro-user').on('click', function () {
		$('.user-info').removeClass('on');
		$('#tc-pro .sec3 > .item').show();
		$('#tc-pro .sec3 > .item.qiye').hide();
		mask.open();
		$('#tc-pro').addClass('on');
	});
	// 没登录的时候点加入会员
	$('.joinPro-user2').click(function () {
		EAlert(
			{
				title: 'Please login first',
				desc: '',
				btnText: 'Go to Login',
			},
			function (closed) {
				$('.mask1').addClass('on');
				$('.tc-login').addClass('on');

				closed();
			}
		);
	});
	// 弹窗内"购买/立即加入"类按钮：未登录时统一拦截，弹登录框
	function requireLoginThenLogin(){
		EAlert(
			{
				title: 'Please login first',
				desc: '',
				btnText: 'Go to Login',
			},
			function (closed) {
				$('.tc-layout').removeClass('on');
				$('.mask1').addClass('on');
				$('.tc-login').addClass('on');
				closed();
			}
		);
	}
	// 加入会员
	$('#openPayment').on('click', function () {
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro').removeClass('on');
		mask.open();
		$('#tc-payment-pro').addClass('on');
		showPayCode();
	});
	$('.openPayment').on('click', function () {
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro').removeClass('on');
		mask.open();
		$('.tc-payment3').addClass('on');
		showPayCode3();
	});
	// 终身会员（358）
	$('.openLifetimePayment').on('click', function () {
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro').removeClass('on');
		mask.open();
		$('.tc-payment-lifetime').addClass('on');
		showPayCodeLifetime();
	});
	// 企业级会员
	$('.openBizPayment').on('click', function () {
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro').removeClass('on');
		mask.open();
		$('#tc-payment-biz').addClass('on');
		showPayCodeBiz();
	});
	// 只显示企业会员卡片
	$('.open-biz-only').on('click', function () {
		$('.user-info').removeClass('on');
		$('#tc-pro .sec3 > .item').hide();
		$('#tc-pro .sec3 > .item.qiye').show();
		mask.open();
		$('#tc-pro').addClass('on');
	});
	//刷新付款码
	$('#tc-payment-pro .wxqr').click(function () {
		showPayCode();
	});
	$('.tc-payment2 .wxqr').click(function () {
		showPayCode2();
	});
	$('.tc-payment3 .wxqr').click(function () {
		showPayCode3();
	});
	$('.tc-payment-lifetime .wxqr').click(function () {
		showPayCodeLifetime();
	});
	$('#tc-payment-biz .wxqr').click(function () {
		showPayCodeBiz();
	});
	// 直播-支付：事件委托，避免 DOM 异步插入时绑定失效
	$(document).on('click', '.tc-pro .sec3 .item.zhibo .jiesuo, .tc-pro .sec3 .item.zhibo-media .jiesuo', function () {
		$('.tc-zhibo').addClass('on');
	});
	$(document).on('click', '.tc-zhibo .close', function () {
		$('.tc-zhibo').removeClass('on');
	});
	$('#zhibo-payment,#zhibo-payment2').click(function(){
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro').removeClass('on');
		mask.open();
		$('.tc-layout').removeClass('on');
		$('#tc-payment-zhibo').addClass('on');
        
		if (typeof window._zhiboCheckInterval != 'undefined') {
			clearInterval(window._zhiboCheckInterval);
		}
		var code_url = '/pay/wechatnative_2.php?timestamp=' + Date.now();
		$('#tc-payment-zhibo .wxqr').attr('src', code_url);
		window._zhiboCheckInterval = setInterval(function () {
			$.ajax({
				url: '/pay/check_payment.php',
				type: 'POST',
				dataType: 'json',
				success: function (response) {
					if (response.code == 200) {
						clearInterval(window._zhiboCheckInterval);
						$('#tc-payment-zhibo').removeClass('on');
						$('.mask1').addClass('on');
						$('#tc-wechat-zhibo').addClass('on');
					}
				},
			});
		}, 3000);
	})
	// 线下大师课 - 立即报名（定金 2000 元）
	$(document).on('click', '#zhibo-offline-pay', function(){
		if(window.IS_LOGIN === false){ requireLoginThenLogin(); return; }
		$('#tc-pro-zhibo').removeClass('on');
		mask.open();
		$('.tc-layout').removeClass('on');
		$('#tc-payment-zhibo-offline').addClass('on');

		if (typeof window._zhiboOfflineCheckInterval != 'undefined') {
			clearInterval(window._zhiboOfflineCheckInterval);
		}
		// 默认微信渠道二维码（2000 元）
		$('#tc-payment-zhibo-offline .pay-tab').removeClass('active');
		$('#tc-payment-zhibo-offline .pay-tab[data-pay-channel="wechat"]').addClass('active');
		$('#tc-payment-zhibo-offline .pay-tip-wechat').show();
		$('#tc-payment-zhibo-offline .pay-tip-alipay').hide();
		var code_url = '/pay/wechatnative_offline.php?timestamp=' + Date.now();
		$('#tc-payment-zhibo-offline .wxqr').attr('src', code_url);
		window._zhiboOfflineCheckInterval = setInterval(function () {
			$.ajax({
				url: '/pay/check_payment.php',
				type: 'POST',
				dataType: 'json',
				success: function (response) {
					if (response.code == 200) {
						clearInterval(window._zhiboOfflineCheckInterval);
						$('#tc-payment-zhibo-offline').removeClass('on');
						$('.mask1').removeClass('on');
						if (typeof window.lightTips === 'function') {
							window.lightTips('报名成功，请联系客服确认名额');
						}
					}
				},
			});
		}, 3000);
	});
	// 退出登录-个人中心
	$('#logOut-user').on('click', function () {
		window.location.href = '/user/logout.php';
	});

	// 关闭弹窗
	$('.tc-layout .tc-close').on('click', function () {
		mask.close();
		$('.tc-layout').removeClass('on');
		$('#tc-pro .sec3 > .item').show();
		$('#tc-pro .sec3 > .item.qiye').hide();
		if (typeof window._zhiboOfflineCheckInterval != 'undefined') {
			clearInterval(window._zhiboOfflineCheckInterval);
		}
	});

	//页面加载时设置用户信息
	setUserInfo();

	//设置用户信息
	function setUserInfo() {
		var userInfo = getCookie('userInfo');
		if (userInfo) {
			userInfo = JSON.parse(userInfo);

			$('.logged-simple .icon img').attr('src', userInfo.avatar_url);
			$('.logged-simple p').text(userInfo.name);

			$('.user-info .information .ktx1').text(userInfo.name);
			$('.user-info .information .ktx2 span').text(userInfo.wx_openid);
			$('.user-info .avatar img').attr('src', userInfo.avatar_url);

			if (userInfo.is_vip) {
				$('body').addClass('user-pro');
			} else {
				$('body').removeClass('user-pro');
			}

			if (userInfo.name) {
				$('.signup-btn').hide();
				$('.loggedbox').show();
			} else {
				$('.signup-btn').show();
				$('.loggedbox').hide();
			}
		}
	}

	// 通知铃铛
	var _notiType = 'all';
	$('#notiBell').on('click', function(e){
		e.stopPropagation();
		var $dd = $('#notiDropdown');
		if($dd.hasClass('open')){
			$dd.removeClass('open');
		} else {
			$dd.addClass('open');
			loadNoti(_notiType);
		}
	});
	$(document).on('click', function(e){
		if(!$(e.target).closest('.noti-bell-wrap').length){
			$('#notiDropdown').removeClass('open');
		}
	});
	$('.noti-tab').on('click', function(){
		$('.noti-tab').removeClass('active');
		$(this).addClass('active');
		_notiType = $(this).data('type');
		loadNoti(_notiType);
	});
	$('#notiMarkAll').on('click', function(){
		$.post('/common/noti-api.php', {action:'markall', type:_notiType}, function(res){
			if(res.code===200){
				loadNoti(_notiType);
				$('#notiBadge').remove();
			}
		},'json');
	});
	$(document).on('click', '.noti-item', function(){
		var $el = $(this);
		var id = $el.data('id');
		var target = '/user.html?tab=messages';
		if($el.hasClass('unread')){
			$.post('/common/noti-api.php', {action:'read', id:id}, function(res){
				if(res.code===200){
					$el.removeClass('unread');
					var $badge = $('#notiBadge');
					if($badge.length){
						var cur = parseInt($badge.text()) || 0;
						if(cur <= 1) $badge.remove();
						else $badge.text(cur - 1);
					}
				}
				window.location.href = target;
			},'json').fail(function(){ window.location.href = target; });
		} else {
			window.location.href = target;
		}
	});
	function loadNoti(type){
		$('#notiBody').html('<div class="noti-loading">加载中...</div>');
		$.get('/common/noti-api.php', {type:type}, function(res){
			if(res.code===200){
				if(!res.list || res.list.length===0){
					$('#notiBody').html('<div class="noti-empty">暂无通知</div>');
					return;
				}
				var html = '';
				for(var i=0;i<res.list.length;i++){
					var n = res.list[i];
					html += '<div class="noti-item'+(n.is_read?'':' unread')+'" data-id="'+n.id+'">';
					html += '<div class="noti-icon">'+n.icon+'</div>';
					html += '<div class="noti-content">';
					html += '<div class="noti-title">'+n.title+'</div>';
					html += '<div class="noti-text">'+n.content+'</div>';
					html += '<div class="noti-time">'+n.time_text+'</div>';
					html += '</div></div>';
				}
				$('#notiBody').html(html);
				if(res.unread > 0){
					if($('#notiBadge').length) $('#notiBadge').text(res.unread > 99 ? '99+' : res.unread);
				} else {
					$('#notiBadge').remove();
				}
			}
		},'json');
	}

	// 刷新二维码
	$('.tc-login .qr-card .wxqr').on('click', function () {
		showCode();
	});

	// 	// 模拟支付完成
	// 	$('.tc-payment .card .wxqr-box').on('click', function () {
	// 		mask.close();
	// 		$('.tc-layout').removeClass('on');
	// 		// 将用户参数存入cookie，有效期60天
	// 		let user = {
	// 			id: '8784542',
	// 			name: '用户美国队长',
	// 			wx_openid: 'l1289401080',
	// 			avatar_url: '/img/user/user-avatar.png',
	// 			is_vip: true,
	// 			vip_expire_time: '',
	// 		};
	// 		user = JSON.stringify(user);
	// 		setCookie('userInfo', user, 60);
	// 		setUserInfo();
	// 	});

	// 每次页面加载都检查是否绑定手机号(未绑则弹窗,可关闭,但下次进页面还会弹)
	checkBan();
	$('.wxlogin').click(function () {
		if (1) {
			// $('.tc-login').removeClass('on');
			// EAlert({
			//         title: '微信扫码登录',
			//         desc:'<div class="wxqr" id="wxqr" alt="" style="position: relative;width: 220px;height: 220px; margin: 1.354vw auto;"></div>',
			//         btnText: '关闭',
			//     },
			//     function (closed) {
			//         $('.mask1').removeClass('on');
			//         closed()
			//     }
			// );

			$('#phone-login-box').hide();
			$('#email-login-box').hide();
			$('#wx-login-box').show();
			$('.phonelogin').show();
			$('.wxlogin').hide();
			$('.emaillogin').show();
			if (isOverseas) {
				$('.tc-login .quick-login').show();
				$('.tc-login .overseas-tip').hide();
			}
			scheduleUpdateQuickLogin();

		if ($('#wxqr').length) {
			var _rd = sessionStorage.getItem('login_redirect');
			var jump_url = _rd ? (window.location.origin + _rd) : window.location.href;
			if(_rd) sessionStorage.removeItem('login_redirect');
			// PC 登录改为扫码关注公众号,复用 common/js.php 的 refreshPcLogin
			if (typeof window._pcLogin !== 'undefined' && typeof refreshPcLogin === 'function') {
				window._pcLogin.jumpUrl = jump_url;
				refreshPcLogin();
			}
		}
		} else {
			$.ajax({
				url: '/user/wx_jump.php',
				type: 'POST',
				dataType: 'json',
				success: function (response) {
					if (response.code == 200) {
						location.href = response.jump_url;
					}
				},
			});
		}
	});

	// 默认邮箱登录的判定：优先按"站点语言"(用户在站点切换的语言, 存于 cookie site_lang / localStorage site-lang)。
	// 只要站点语言不是简体中文(zh)——包括繁体(zh_tw)、粤语(yue)、英文(en)等——都默认展示邮箱登录。
	// 站点语言未设置时, 回退到浏览器语言(不以 zh 开头视为海外)。
	function __getSiteLang() {
		try {
			var ls = localStorage.getItem('site-lang');
			if (ls) return ls.trim();
		} catch (e) {}
		var m = document.cookie.match(/(?:^|;\s*)site_lang=([^;]*)/);
		if (m && m[1]) {
			try { return decodeURIComponent(m[1]).trim(); } catch (e) { return m[1].trim(); }
		}
		return '';
	}
	var __siteLang = __getSiteLang();
	var isOverseas;
	if (__siteLang) {
		// 简体中文(zh)、粤语(yue)走国内逻辑(微信/手机)；繁体(zh_tw)、英文等其余语言默认邮箱登录
		isOverseas = (__siteLang !== 'zh' && __siteLang !== 'yue');
	} else {
		var __lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
		isOverseas = __lang.indexOf('zh') !== 0;
	}

	// 三个快捷入口（手机号/微信/邮箱）任何时刻只显示其中两个；
	// 隐藏一个按钮后，剩余按钮数若为 1，则容器切换为居中布局
	function updateQuickLoginLayout() {
		$('.quick-login').each(function () {
			var visible = $(this).find('.item').filter(function () {
				return $(this).css('display') !== 'none';
			}).length;
			$(this).toggleClass('single-entry', visible === 1);
		});
	}
	// 包一层 setTimeout，等同帧内的 show/hide 都执行完
	var __qlTimer = null;
	function scheduleUpdateQuickLogin() {
		if (__qlTimer) clearTimeout(__qlTimer);
		__qlTimer = setTimeout(updateQuickLoginLayout, 0);
	}

	// 恢复登录面板初始状态：海外=邮箱表单+提示；国内 PC=微信扫码；国内移动=手机号
	function resetLoginPanel() {
		if (isOverseas) {
			$('#phone-login-box').hide();
			$('#wx-login-box').hide();
			$('#email-login-box').show();
			$('.tc-login .quick-login').hide();
			$('.tc-login .overseas-tip').show();
		} else if (pc) {
			$('#phone-login-box').hide();
			$('#email-login-box').hide();
			$('#wx-login-box').show();
			$('.phonelogin').show();
			$('.wxlogin').hide();
			$('.emaillogin').show();
			$('.tc-login .quick-login').show();
			$('.tc-login .overseas-tip').hide();
		} else {
			$('#phone-login-box').show();
			$('#email-login-box').hide();
			$('#wx-login-box').hide();
			$('.phonelogin').hide();
			$('.wxlogin').show();
			$('.emaillogin').show();
			$('.tc-login .quick-login').show();
			$('.tc-login .overseas-tip').hide();
		}
		scheduleUpdateQuickLogin();
	}
	resetLoginPanel();

	$('.phonelogin').click(function () {
		$('#phone-login-box').show();
		$('#email-login-box').hide();
		$('#wx-login-box').hide();
		$('.phonelogin').hide();
		$('.wxlogin').show();
		$('.emaillogin').show();
		if (isOverseas) {
			$('.tc-login .quick-login').show();
			$('.tc-login .overseas-tip').hide();
		}
		scheduleUpdateQuickLogin();
	});
	$('.emaillogin').click(function () {
		$('#phone-login-box').hide();
		$('#email-login-box').show();
		$('#wx-login-box').hide();
		$('.phonelogin').show();
		$('.wxlogin').show();
		$('.emaillogin').hide();
		if (isOverseas) {
			$('.tc-login .quick-login').show();
			$('.tc-login .overseas-tip').hide();
		}
		scheduleUpdateQuickLogin();
	});
});

/**
 * GSAP数字滚动动画函数
 * @param {string|HTMLElement} element - 目标元素或选择器
 * @param {Object} [options] - 配置选项
 * @param {number} [options.startVal=0] - 起始值，默认0
 * @param {number} [options.endVal] - 结束值，默认使用元素的textContent
 * @param {number} [options.duration=1] - 动画持续时间(秒)
 * @param {boolean} [options.useSeparator=false] - 是否使用分位符号
 * @param {number} [options.decimalPlaces] - 小数位数，默认自动检测
 * @param {string} [options.ease='power1.out'] - 缓动函数
 * @param {Function} [options.onComplete=null] - 动画完成回调
 * @returns {GSAPTimeline} - GSAP时间线对象
 */
function gsapCountUp(element, options = {}) {
	// 处理目标元素
	const target = typeof element === 'string' ? document.querySelector(element) : element;
	if (!target) {
		console.error('找不到目标元素');
		return null;
	}

	// 从元素文本获取结束值（移除可能的分位符）
	const textContent = target.textContent.trim().replace(/,/g, '');
	const defaultEndVal = parseFloat(textContent) || 0;

	// 自动检测小数位数
	const getDecimalPlaces = (numStr) => {
		const parts = numStr.split('.');
		return parts.length > 1 ? parts[1].length : 0;
	};
	const defaultDecimalPlaces = getDecimalPlaces(textContent);

	// 默认配置
	const defaults = {
		startVal: 0,
		endVal: defaultEndVal,
		duration: 1,
		useSeparator: false,
		decimalPlaces: defaultDecimalPlaces,
		ease: 'power1.out',
		onComplete: null,
	};

	// 合并配置
	const config = { ...defaults, ...options };

	// 验证数值
	if (typeof config.startVal !== 'number' || typeof config.endVal !== 'number') {
		console.error('起始值和结束值必须是数字');
		return null;
	}

	// 数字格式化函数
	const formatNumber = (num) => {
		// 四舍五入到指定小数位
		const rounded = Number(num.toFixed(config.decimalPlaces));

		// 处理分位符号和小数
		if (config.useSeparator) {
			return new Intl.NumberFormat('en-US', {
				minimumFractionDigits: config.decimalPlaces,
				maximumFractionDigits: config.decimalPlaces,
			}).format(rounded);
		}

		return rounded.toString();
	};

	// 初始化显示为起始值
	target.textContent = formatNumber(config.startVal);

	// 创建GSAP动画
	const timeline = gsap.timeline({
		onComplete: () => {
			// 确保最终值准确无误
			target.textContent = formatNumber(config.endVal);
			if (typeof config.onComplete === 'function') {
				config.onComplete();
			}
		},
	});

	timeline.to(
		{},
		{
			duration: config.duration,
			ease: config.ease,
			// 每帧更新数字
			onUpdate: function () {
				const progress = this.progress();
				const currentValue = config.startVal + (config.endVal - config.startVal) * progress;
				target.textContent = formatNumber(currentValue);
			},
		}
	);

	return timeline;
}

//轻提示
var lightTipsDiv = document.createElement('div');
lightTipsDiv.className = 'lightTips unTips';
document.body.appendChild(lightTipsDiv);
function myLightTips(data) {
	var Tips = document.querySelector('.lightTips');

	Tips.innerText = data;
	Tips.classList.remove('unTips');

	var a = setTimeout(function () {
		Tips.classList.add('unTips');
		clearTimeout(a);
	}, 2000);
}
window.lightTips = myLightTips;


function im4Copy(){
	$('.im4 .empty .copy').append('<div class="copy-btn">复制</div>');
	$('.im4 .empty').on('click', '.copy-btn', function () {
		var text = $(this).parent().find('.copy-text').text();
		copyTextToClipboard(text);

		window.lightTips('复制成功');
	})
 function copyTextToClipboard(text) {
		let that = this;
		console.log(text);
		if (!navigator.clipboard) {
			function fallbackCopyTextToClipboard(text) {
				// 1.创建一个可选中元素
				let textArea = document.createElement('textarea');
				textArea.value = text;
				// 2.使用定位，阻止页面滚动
				textArea.style.top = '0';
				textArea.style.left = '0';
				textArea.style.position = 'fixed';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					console.log('Fallback: Copying text command was ' + msg);
				} catch (err) {
					console.error('Fallback: Oops, unable to copy', err);
				}
				// 3.移除元素
				document.body.removeChild(textArea);
			}
			fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(
			function () {
				console.log('Async: Copying to clipboard was successful!');
			},
			function (err) {
				console.error('Async: Could not copy text: ', err);
			}
		);
	}

}