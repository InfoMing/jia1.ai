$(function () {
  // 双模式切换
  $('.plat-mode-btn').click(function () {
    var mode = $(this).data('mode');
    $('.plat-mode-btn').removeClass('active');
    $(this).addClass('active');
    if (mode === 'order') {
      $('#plat-content-order').show();
      $('#plat-content-find').hide();
      $('#plat-mode-label').text('接单模式 (AI视觉规划师端)');
    } else {
      $('#plat-content-order').hide();
      $('#plat-content-find').show();
      $('#plat-mode-label').text('找人模式 (企业/需求方端)');
    }
    localStorage.setItem('plat_mode', mode);
  });

  // 恢复上次模式
  var savedMode = localStorage.getItem('plat_mode');
  if (savedMode) {
    $('.plat-mode-btn[data-mode="' + savedMode + '"]').click();
  }

  // Tag 多选
  $('body').on('click', '.plat-tag', function () {
    var $tag = $(this);
    var $tags = $tag.closest('.plat-tags');
    var max = parseInt($tags.data('max')) || 0;
    var willSelect = !$tag.hasClass('selected');
    if (willSelect && max > 0) {
      var current = $tags.find('.plat-tag.selected').length;
      if (current >= max) {
        if (window.lightTips) window.lightTips('最多选 ' + max + ' 项');
        return;
      }
    }
    $tag.toggleClass('selected');
    if ($tags.find('.plat-tag.selected').length > 0) {
      $tags.css('outline', '');
    }
  });

  // Radio 单选
  $('body').on('click', '.plat-radio', function () {
    $(this).siblings('.plat-radio').removeClass('selected');
    $(this).addClass('selected');
  });

  // 筛选条
  $('body').on('click', '.plat-filter-chip', function () {
    if (!$(this).text().includes('▼')) {
      $(this).siblings('.plat-filter-chip').removeClass('active');
      $(this).addClass('active');
    }
  });

  // 联系方式弹窗
  $('body').on('click', '.plat-contact-popup .popup-bg, .plat-contact-popup .popup-close', function () {
    $(this).closest('.plat-contact-popup').removeClass('on');
  });

  // 入驻表单步骤控制
  var currentStep = 0;

  function validateCurrentStep() {
    var $step = $('.plat-step-content').eq(currentStep);
    var valid = true;
    var firstBad = null;

    $step.find('input.plat-form-input[required], textarea.plat-form-input[required]').each(function () {
      var $el = $(this);
      if ($el.prop('disabled')) return;
      if (!$.trim($el.val())) {
        valid = false;
        $el.css('border-color', '#E74E46');
        if (!firstBad) firstBad = $el;
      } else {
        $el.css('border-color', '');
      }
    });

    if (typeof tinymce !== 'undefined') {
      $step.find('textarea[id]').each(function () {
        var editorId = $(this).attr('id');
        var editor = tinymce.get(editorId);
        if (editor) {
          var content = editor.getContent({ format: 'text' }).replace(/\s+/g, '');
          if (!content) {
            if (window._resumeParsing) {
              if (window.lightTips) window.lightTips('简历正在后台解析中，您可以先继续下一步');
            } else {
              valid = false;
              $(editor.getContainer()).css('border', '1px solid #E74E46');
              if (!firstBad) firstBad = $(this);
              if (window.lightTips) window.lightTips('请填写个人介绍及履历');
            }
          } else {
            $(editor.getContainer()).css('border', '');
          }
        }
      });
    }

    $step.find('.plat-tags[data-required]').each(function () {
      if ($(this).attr('data-required') !== 'true') return;
      if ($(this).find('.plat-tag.selected').length === 0) {
        valid = false;
        $(this).css({ 'outline': '1px solid #E74E46', 'border-radius': '8px' });
        if (!firstBad) firstBad = $(this);
      } else {
        $(this).css('outline', '');
      }
    });

    $step.find('.plat-upload[data-required]').each(function () {
      var targetInput = $(this).siblings('input[type="hidden"]');
      var val = targetInput.val();
      if (!val || val === '[]' || val === '') {
        valid = false;
        $(this).css('border-color', '#E74E46');
        if (!firstBad) firstBad = $(this);
      } else {
        $(this).css('border-color', '');
      }
    });

    var $worksGroup = $step.find('#worksGroup');
    var $workflowGroup = $step.find('#workflowGroup');
    if ($worksGroup.length && $workflowGroup.length) {
      var worksVal = $('#worksInput').val();
      var worksCount = 0;
      try { worksCount = JSON.parse(worksVal || '[]').length; } catch(e){}
      var wfVal = $('#workflowUrlsInput').val();
      var hasWorkflow = false;
      try { hasWorkflow = JSON.parse(wfVal || '[]').length > 0; } catch(e){}
      if (worksCount < 2) {
        valid = false;
        $worksGroup.find('#addWorkBtn').css('border-color', '#E74E46');
        if (!firstBad) firstBad = $worksGroup.find('#addWorkBtn');
        if (window.lightTips) window.lightTips('请至少上传2个作品，建议多上传几个作品以获得更多的曝光和咨询');
      } else {
        $worksGroup.find('#addWorkBtn').css('border-color', '');
      }
    }

    if (!valid && firstBad) {
      firstBad.focus();
      if (!$step.find('#worksGroup').length && window.lightTips) {
        window.lightTips('请填写完整信息后再继续');
      }
    }
    return valid;
  }

  $('body').on('input change', '.plat-form-input', function () {
    if ($.trim($(this).val())) $(this).css('border-color', '');
  });

  $('body').on('click', '.plat-step-next', function () {
    if (!validateCurrentStep()) return;
    var $btn = $(this);
    if (currentStep === 3) {
      var phone = $.trim($('input[name="phone"]').val());
      var code = $.trim($('input[name="sms_code"]').val());
      $btn.prop('disabled', true).text('验证中...');
      $.post('/common/platform-check-sms.php', { phone: phone, sms_code: code }, function (res) {
        $btn.prop('disabled', false).text('下一步');
        if (res.code === 200) {
          currentStep++;
          updateSteps();
        } else {
          $('input[name="sms_code"]').css('border-color', '#E74E46');
          if (window.lightTips) window.lightTips(res.msg || '验证码错误');
        }
      }, 'json').fail(function () {
        $btn.prop('disabled', false).text('下一步');
        if (window.lightTips) window.lightTips('验证请求失败，请重试');
      });
      return;
    }
    currentStep++;
    updateSteps();
  });
  $('body').on('click', '.plat-step-prev', function () {
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    }
  });

  function updateSteps() {
    $('.plat-step-content').hide().eq(currentStep).show();
    $('.plat-step-item').removeClass('active done');
    $('.plat-step-item').each(function (i) {
      if (i < currentStep) $(this).addClass('done');
      if (i === currentStep) $(this).addClass('active');
    });
    if (currentStep === 4 && $('#confirmSummary').length) {
      buildConfirmSummary();
    }
    $('html, body').animate({ scrollTop: $('.plat-steps').offset().top - 100 }, 300);
  }

  function buildConfirmSummary() {
    var nickname = $.trim($('input[name="nickname"]').val()) || '未设置';
    var intro = $.trim($('textarea[name="intro"]').val()) || '未填写';
    var skills = [];
    $('#skillTags .plat-tag.selected').each(function () { skills.push($(this).data('val')); });
    var worksJson = [];
    try { worksJson = JSON.parse($('#worksInput').val() || '[]'); } catch (e) {}
    var workflowJson = [];
    try { workflowJson = JSON.parse($('#workflowUrlsInput').val() || '[]'); } catch (e) {}
    var workTypeVal = $('#workTypeInput').val();
    var workTypeText = workTypeVal == '1' ? '全职接单' : '兼职接单';
    var workTimeRange = $.trim($('#workTimeInput').val()) || '';
    var price = $.trim($('#priceInput').val()) || $.trim($('#priceSlider').val()) + '元/天';
    var jobSeeking = $('#jobSeekingInput').val() == '1' ? '是' : '否';
    var phone = $.trim($('input[name="phone"]').val()) || '未填写';
    var email = $.trim($('input[name="email"]').val()) || '未填写';

    var html = '<table style="width:100%;border-collapse:collapse;">';
    function row(label, val, isHtml) {
      html += '<tr style="border-bottom:1px solid #EFEFEF;">'
        + '<td style="padding:0.521vw 0.625vw;white-space:nowrap;color:#696969;vertical-align:top;width:7.292vw;">' + label + '</td>'
        + '<td style="padding:0.521vw 0.625vw;color:#333;">' + (isHtml ? val : $('<span>').text(val).html()) + '</td>'
        + '</tr>';
    }

    row('昵称', nickname);
    var introPreview = intro;
    var introPlain = $('<div>').html(intro).text();
    if (introPlain.length > 200) {
      introPreview = '<div style="max-height:6.25vw;overflow:hidden;line-height:1.8;font-size:0.729vw;">' + intro + '</div><div style="color:#999;font-size:0.573vw;margin-top:0.208vw;">...内容较长已折叠</div>';
    } else {
      introPreview = '<div style="line-height:1.8;font-size:0.729vw;">' + intro + '</div>';
    }
    row('个人介绍及履历', introPreview, true);
    row('擅长领域', skills.length ? skills.map(function (s) {
      return '<span style="display:inline-block;padding:0.156vw 0.521vw;background:#F3FBE8;color:#2D7A0F;border-radius:0.208vw;margin:0.104vw 0.208vw 0.104vw 0;font-size:0.625vw;">' + s + '</span>';
    }).join('') : '<span style="color:#999;">未选择</span>', true);

    var worksHtml = '';
    if (worksJson.length) {
      worksJson.forEach(function (w) {
        if (w.type === 'video') {
          worksHtml += '<div style="display:inline-block;margin:0.208vw;padding:0.312vw 0.625vw;background:#EFEFEF;border-radius:0.208vw;font-size:0.625vw;">🎬 ' + (w.title || '视频') + '</div>';
        } else {
          worksHtml += '<img src="' + w.url + '" style="width:4.167vw;height:4.167vw;object-fit:cover;border-radius:0.312vw;margin:0.208vw;">';
        }
      });
    } else {
      worksHtml = '<span style="color:#999;">未上传</span>';
    }
    row('作品', worksHtml, true);

    var wfHtml = '';
    if (workflowJson.length) {
      workflowJson.forEach(function (u) {
        wfHtml += '<div style="margin:0.104vw 0;"><a href="' + u + '" target="_blank" style="color:#2D7A0F;word-break:break-all;font-size:0.625vw;">' + u + '</a></div>';
      });
    } else {
      wfHtml = '<span style="color:#999;">未添加</span>';
    }
    row('工作流链接', wfHtml, true);
    row('接单类型', workTypeText);
    if (workTypeVal == '2' && workTimeRange) {
      row('可接单时间段', workTimeRange);
    }
    row('日报价', price);
    row('正在找工作', jobSeeking === '是'
      ? '<span style="color:#2D7A0F;">✅ 是</span>'
      : '<span style="color:#999;">⏸️ 否</span>', true);
    row('手机号', phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
    row('邮箱', email);

    html += '</table>';
    html += '<div style="margin-top:0.625vw;padding:0.521vw;background:#FFF8E1;border:1px solid #FFE082;border-radius:0.312vw;font-size:0.625vw;color:#795548;">';
    html += '⚠️ 如需修改，请点击"上一步"返回对应步骤进行修改';
    html += '</div>';
    $('#confirmSummary').html(html);
  }

});
