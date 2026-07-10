/**
 * PC 端支付路由 (中文 / 英文)
 *
 * 规则:
 *   - 中文(site_lang=zh / 没设置)  → 走原有微信扫码 + 支付宝(common/header.php 已实现)
 *   - 其它语言                       → 全部走 PayPal,完全隐藏扫码区,只显示 PayPal 智能按钮
 *
 * 依赖:
 *   - jQuery (跟 header.php 的支付脚本同一套)
 *   - window.SUPERI_PAYPAL (由 common/paypal-buttons.php 注入)
 *
 * 工作流程:
 *   1. 监听弹窗打开(.tc-layout.on),识别 data-pay-type
 *   2. 第一次需要时按需加载 paypal-sdk
 *   3. 渲染 paypal.Buttons 到弹窗内的 .paypal-pay-box .pp-buttons
 *   4. createOrder → 调 /pay/paypal/create.php
 *   5. onApprove   → 调 /pay/paypal/capture.php
 *   6. 成功后:刷新页面 / 展示成功文案
 *
 * 中文版下本脚本几乎不工作(直接 return),保持原有行为不变。
 */
(function () {
  'use strict';

  // ---------- 工具 ----------
  function getCookie(name) {
    var m = document.cookie.match('(?:^|;\\s*)' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }
  function getLang() {
    // 优先取 site_lang cookie,降级到 documentElement[data-site-lang]
    return getCookie('site_lang') || document.documentElement.getAttribute('data-site-lang') || 'zh';
  }
  function isEnLang() { return getLang() !== 'zh'; }

  // 给一个根元素打上 data-site-lang,翻译脚本会设,但脚本可能晚于本脚本,
  // 所以我们这里也兜底设一下,保证 CSS 选择器立刻生效
  (function applyLangAttr() {
    var lang = getLang();
    document.documentElement.setAttribute('data-site-lang', lang);
  })();

  if (!window.SUPERI_PAYPAL) return; // 后端没注入配置就不工作
  var CFG = window.SUPERI_PAYPAL;

  // ---------- 按需加载 PayPal SDK ----------
  var _sdkPromise = null;
  function loadPaypalSdk() {
    if (window.paypal) return Promise.resolve(window.paypal);
    if (_sdkPromise) return _sdkPromise;
    _sdkPromise = new Promise(function (resolve, reject) {
      if (!CFG.ready || !CFG.clientId) {
        reject(new Error('PayPal is not configured. Please contact the administrator.'));
        return;
      }
      var s = document.createElement('script');
      s.src = CFG.sdkSrc;
      s.async = true;
      s.onload = function () {
        if (window.paypal) resolve(window.paypal);
        else reject(new Error('PayPal SDK failed to load.'));
      };
      s.onerror = function () { reject(new Error('Cannot load PayPal SDK (network blocked?).')); };
      document.head.appendChild(s);
    });
    return _sdkPromise;
  }

  // ---------- 在每个支付弹窗里注入 PayPal 区块(只一次) ----------
  function ensurePaypalBox($modal) {
    if ($modal.find('.paypal-pay-box').length) {
      // 已存在:每次都把 modal 上最新的 data-bz-tab(博主打赏用) 同步到 box,
      // 避免用户切换不同博主时 PayPal createOrder 仍读到旧 tab。
      var bz = $modal.attr('data-bz-tab') || '';
      if (bz) $modal.find('.paypal-pay-box').attr('data-bz-tab', bz);
      return $modal.find('.paypal-pay-box');
    }
    var payType = $modal.attr('data-pay-type') || 'vip_year';
    var plan = (CFG.plans || {})[payType];
    var usd = plan ? plan.usd : '';
    var cny = plan ? plan.cny : '';

    var html = '<div class="paypal-pay-box" data-pay-type="' + payType + '">' +
      '  <div class="pp-amount-line">Pay <b>$' + usd + '</b> USD' +
      (cny ? '<div class="pp-cny-tip">(approx. ¥' + cny + ' CNY)</div>' : '') +
      '  </div>' +
      '  <div class="pp-buttons"><div class="pp-loading">Loading PayPal…</div></div>' +
      '  <div class="pp-error" style="display:none;"></div>' +
      '  <div class="pp-success" style="display:none;"></div>' +
      '</div>';

    // 插入位置：放到二维码及其提示文案的下方，避免夹在金额行与二维码之间。
    // 优先级：.tongyi(二维码下方提示) 之后 → .wxqr-box(二维码) 之后 → inner 末尾。
    var $inner = $modal.find('.card .inner').first();
    if (!$inner.length) $inner = $modal.find('.card').first();
    var $tongyi = $inner.find('.tongyi').first();
    var $wxqr = $inner.find('.wxqr-box').first();
    if ($tongyi.length) $tongyi.after(html);
    else if ($wxqr.length) $wxqr.after(html);
    else $inner.append(html);

    return $modal.find('.paypal-pay-box');
  }

  // ---------- 渲染 PayPal 按钮 ----------
  function renderButtons($modal) {
    var $box = ensurePaypalBox($modal);
    // 防重复渲染：已渲染('1')或正在渲染('pending')都直接返回。
    // 关键修复——之前只拦 '1'，但 SDK 异步加载期间状态是 'pending'，
    // 多个触发器(首扫/MutationObserver/点击兜底)会在这个窗口内重复进入，导致渲染出两份按钮。
    var rendered = $box.attr('data-rendered');
    if (rendered === '1' || rendered === 'pending') return;
    $box.attr('data-rendered', 'pending');

    var payType = $box.attr('data-pay-type') || 'vip_year';

    loadPaypalSdk().then(function (paypal) {
      $box.find('.pp-loading').remove();
      // 兜底：渲染前清空容器，避免任何历史残留按钮叠加
      $box.find('.pp-buttons').empty();
      paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal', height: 44 },

        createOrder: function () {
          // 博主打赏:需把博主 tab id(data-bz-tab) 一并传给 create.php,
          // 否则后端不知道解锁哪个博主(用 ?tab=xxx 区分)
          var url = CFG.createUrl + '?type=' + encodeURIComponent(payType);
          if (payType === 'blogger') {
            var bzTab = $modal.attr('data-bz-tab') || $box.attr('data-bz-tab') || '';
            if (!bzTab) bzTab = jQuery('#tc-bozhu-pay').attr('data-bz-tab') || '';
            var bzMode = $modal.attr('data-bz-mode') || $box.attr('data-bz-mode') || 'single';
            var bzCourse = $modal.attr('data-bz-course') || $box.attr('data-bz-course') || '';
            if (bzTab) url += '&tab=' + encodeURIComponent(bzTab);
            url += '&mode=' + encodeURIComponent(bzMode);
            if (bzMode === 'single' && bzCourse) url += '&course=' + encodeURIComponent(bzCourse);
          }
          return jQuery.ajax({
            url: url,
            type: 'POST',
            dataType: 'json'
          }).then(function (res) {
            if (!res || res.code !== 200 || !res.orderID) {
              throw new Error((res && res.msg) || 'Create order failed');
            }
            $box.data('localOrder', res.out_trade_no);
            return res.orderID;
          });
        },

        onApprove: function (data) {
          var outTradeNo = $box.data('localOrder') || '';
          $box.find('.pp-buttons').hide();
          $box.find('.pp-error').hide();
          $box.find('.pp-success').show().text('Confirming payment…');
          return jQuery.ajax({
            url: CFG.captureUrl,
            type: 'POST',
            dataType: 'json',
            data: { orderID: data.orderID, out_trade_no: outTradeNo }
          }).then(function (res) {
            if (res && res.code === 200) {
              $box.find('.pp-success').text('Payment successful! Refreshing…');
              setTimeout(function () { location.reload(); }, 1200);
            } else {
              $box.find('.pp-success').hide();
              $box.find('.pp-buttons').show();
              $box.find('.pp-error').show().text((res && res.msg) || 'Capture failed, please contact support.');
            }
          }, function (xhr) {
            $box.find('.pp-success').hide();
            $box.find('.pp-buttons').show();
            $box.find('.pp-error').show().text('Network error during capture. If the amount was deducted, please contact support with order ID: ' + outTradeNo);
          });
        },

        onCancel: function () {
          $box.find('.pp-error').hide();
        },

        onError: function (err) {
          $box.find('.pp-buttons').show();
          $box.find('.pp-error').show().text((err && err.message) || 'PayPal error.');
        }
      }).render($box.find('.pp-buttons')[0]);

      $box.attr('data-rendered', '1');
    }).catch(function (err) {
      $box.find('.pp-loading').remove();
      $box.find('.pp-error').show().text(err.message || String(err));
      $box.attr('data-rendered', 'failed');
    });
  }

  // ---------- 弹窗打开监听 ----------
  function waitJQuery(cb) {
    if (window.jQuery) cb(window.jQuery);
    else setTimeout(function () { waitJQuery(cb); }, 80);
  }
  waitJQuery(function ($) {
    // 监听 .tc-layout.on 出现 → 渲染 PayPal
    // header.php 用 $modal.addClass('on') 打开,我们用 MutationObserver 监听
    if (!isEnLang()) return; // 中文版直接返回,什么都不做

    function tryRenderActive() {
      $('.tc-payment.on, .tc-payment2.on, .tc-payment3.on, .tc-payment-lifetime.on, #tc-payment-biz.on, #tc-payment-zhibo.on, #tc-payment-pro.on').each(function () {
        renderButtons($(this));
      });
    }

    // 1) 首次扫一遍
    tryRenderActive();

    // 2) 监听 class 变化
    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        if (t && t.classList && t.classList.contains('on') &&
            /tc-payment/.test(t.className)) {
          renderButtons($(t));
        }
      }
    });
    document.querySelectorAll('.tc-payment, .tc-payment2, .tc-payment3, .tc-payment-lifetime').forEach(function (el) {
      obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    });

    // 3) 兜底:用户点了"立即加入"等按钮触发的弹窗打开,延迟再扫
    $(document).on('click', '[data-pay-type], .show_vip, .openzhibo-tc, #openzhibo-tc, #openzhibo-tc2, .openzhibo-tc-three', function () {
      setTimeout(tryRenderActive, 300);
      setTimeout(tryRenderActive, 800);
    });
  });
})();
