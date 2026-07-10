/**
 * 「我的习惯」前端逻辑
 *
 * 功能:
 *   - 进入 tool.html 时:GET /common/user-pref-get.php 判断是否已设置
 *   - 已设置 → 自动启用个性化排序(toollist 请求带 personalize=1),按钮显示 ✓
 *   - 点击按钮:
 *       已设置 → 弹"摘要面板"(重置/重新对话/关闭)
 *       未设置 → 弹"对话框"
 *   - 对话:循环调 /common/user-pref-chat.php,直到 AI 返回 done=true
 *   - done 后:调 /common/user-pref-save.php → 进入"排序中"状态 → 轮询 user-pref-get,
 *             直到 ranked_at 有值 → 关闭弹窗 + 重新 toollist(1)
 *
 * 依赖:
 *   - jQuery(全站通用)
 *   - 全局函数 toollist(page) 由 tool.php 中定义,用于刷新列表
 */
(function () {
  var $ = window.jQuery;
  if (!$) return;

  // 全局状态
  var state = {
    enabled: false,        // 是否启用个性化排序(=有 sorted_ids)
    hasPref: false,        // 是否有偏好记录(可能仍在排序中)
    job: '',
    industry: '',
    interests: [],
    aiTags: [],
    rankedCount: 0,
    rankedAt: '',
    chatHistory: [],       // [{role,content},...] 当次对话
    polling: false,
  };

  // 暴露给 toollist 用,让它在请求里带上参数
  window.userPrefEnabled = function () { return !!state.enabled; };

  // 当「推荐你看」按钮被当前激活作为筛选 tab 时返回 true
  // tool.php 的 toollist 据此决定是否只显示 AI 推荐的文章
  window.userPrefAsFilter = function () { return $('.user-pref-trigger').hasClass('on'); };

  // 激活「推荐你看」作为筛选 tab(替代当前的任何 tab 选中)
  function activateAsFilter() {
    // 清掉当前所有 tab 的 .on
    $('.tab-group-box.on .tab').removeClass('on');
    // 给「推荐你看」按钮加 .on
    $('.user-pref-trigger').addClass('on');
    // 刷新列表
    if (typeof window.toollist === 'function') window.toollist(1);
  }
  // 暴露给 tool.php 用(它的 tab 点击事件需要识别这个特殊 tab)
  window.userPrefActivateAsFilter = activateAsFilter;

  // ready Promise:tool.php 的初次列表加载会等这个 resolve
  // 这样首次进入页面就能直接用个性化排序,不必再点一次"全部"
  var _readyResolve;
  window.userPrefReady = new Promise(function (resolve) { _readyResolve = resolve; });
  // 安全网:即使接口挂了,2 秒后强制 resolve,避免列表永远不出来
  setTimeout(function () { if (_readyResolve) { _readyResolve(); _readyResolve = null; } }, 2000);

  // ===========================================================
  // 工具
  // ===========================================================
  function $btn()         { return $('.user-pref-trigger'); }
  function $modal()       { return $('#userPrefModal'); }
  function $stageChat()   { return $('#upmStageChat'); }
  function $stageRank()   { return $('#upmStageRanking'); }
  function $stageSum()    { return $('#upmStageSummary'); }

  function openModal(stage) {
    $modal().addClass('on');
    setStage(stage || 'chat');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $modal().removeClass('on');
    document.body.style.overflow = '';
  }
  function setStage(s) {
    $stageChat().toggle(s === 'chat');
    $stageRank().toggle(s === 'rank');
    $stageSum().toggle(s === 'sum');
    // 聊天阶段强制大尺寸,其它(rank/summary)自适应内容
    var $box = $modal().find('.upm-box');
    if (s === 'chat') $box.addClass('is-chat');
    else $box.removeClass('is-chat');
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  }); }

  // ===========================================================
  // 拉取当前偏好
  // ===========================================================
  function fetchPref() {
    return $.ajax({
      url: '/common/user-pref-get.php',
      type: 'GET',
      dataType: 'json',
    }).then(function (r) {
      if (!r || r.code !== 200) {
        // 401 等也按"未设置"处理,但不报错
        state.hasPref = false;
        state.enabled = false;
        renderButton();
        if (_readyResolve) { _readyResolve(); _readyResolve = null; }
        return r;
      }
      var d = r.data || {};
      state.hasPref     = !!d.has_preference;
      state.job         = d.job || '';
      state.industry    = d.industry || '';
      state.interests   = d.interests || [];
      state.aiTags      = d.ai_tags || [];
      state.rankedCount = d.ranked_count || 0;
      state.rankedAt    = d.ranked_at || '';
      // 有 sorted_ids 且 ranked_at 不空 → 启用个性化
      state.enabled     = state.hasPref && state.rankedCount > 0 && !!state.rankedAt;
      renderButton();
      if (_readyResolve) { _readyResolve(); _readyResolve = null; }
      return r;
    }, function () {
      // 网络/接口失败也要 resolve,不阻塞列表
      if (_readyResolve) { _readyResolve(); _readyResolve = null; }
    });
  }

  function renderButton() {
    var $b = $btn();
    var $s = $('.user-pref-trigger .user-pref-status');
    var $gear = $('#userPrefGear');
    if (state.enabled) {
      // 已启用:显示 ✓ + 显示设置齿轮 + 加 .has-pref 类(淡黄底色)
      $s.show();
      $gear.show();
      $b.addClass('has-pref');
    } else {
      $s.hide();
      $gear.hide();
      $b.removeClass('has-pref');
    }
    // .on(绿色激活)由 tab 切换逻辑控制,不在这里
  }

  // ===========================================================
  // 对话渲染
  // ===========================================================
  function appendChatBubble(role, text) {
    var cls = role === 'user' ? 'upm-bubble-user' : 'upm-bubble-ai';
    var html = '<div class="upm-bubble ' + cls + '"><div class="upm-bubble-text">' + esc(text).replace(/\n/g, '<br>') + '</div></div>';
    $('#upmChatList').append(html);
    var $list = $('#upmChatList');
    $list.scrollTop($list[0].scrollHeight);
  }

  function startChat() {
    // 清空
    state.chatHistory = [];
    $('#upmChatList').empty();
    $('#upmChatInput').val('').prop('disabled', false);
    $('#upmChatSend').prop('disabled', false).text('发送');
    // 拉开场白(messages=[])
    aiTurn();
  }

  // 调一次 chat 接口,把 AI 返回 push 到对话
  function aiTurn() {
    $('#upmChatSend').prop('disabled', true).text('AI 思考中...');
    $.ajax({
      url: '/common/user-pref-chat.php',
      type: 'POST',
      data: { messages: JSON.stringify(state.chatHistory) },
      dataType: 'json',
      timeout: 35000,
    }).done(function (r) {
      if (!r || r.code !== 200) {
        appendChatBubble('ai', '⚠ ' + ((r && r.msg) || 'AI 暂时不可用,请稍后再试'));
        $('#upmChatSend').prop('disabled', false).text('发送');
        return;
      }
      var d = r.data || {};
      appendChatBubble('ai', d.message || '');
      state.chatHistory.push({ role: 'assistant', content: d.message || '' });
      if (d.done && d.profile) {
        // 收集完毕 → 切到 ranking 状态
        savePref(d.profile);
      } else {
        $('#upmChatSend').prop('disabled', false).text('发送');
        $('#upmChatInput').focus();
      }
    }).fail(function () {
      appendChatBubble('ai', '⚠ 网络异常,请重试');
      $('#upmChatSend').prop('disabled', false).text('发送');
    });
  }

  function userSay() {
    var v = ($('#upmChatInput').val() || '').trim();
    if (!v) return;
    appendChatBubble('user', v);
    state.chatHistory.push({ role: 'user', content: v });
    $('#upmChatInput').val('');
    aiTurn();
  }

  // ===========================================================
  // 保存偏好 + 进入 ranking + 轮询
  // ===========================================================
  function savePref(profile) {
    setStage('rank');
    $('#upmRankTitle').text('正在为你精挑细选...');
    $('#upmRankStep').text('正在提取关键词...');

    $.ajax({
      url: '/common/user-pref-save.php',
      type: 'POST',
      data: {
        job:       profile.job || '',
        industry:  profile.industry || '',
        interests: JSON.stringify(profile.interests || []),
        raw_chat:  JSON.stringify(state.chatHistory),
      },
      dataType: 'json',
      timeout: 60000,
    }).done(function (r) {
      if (!r || r.code !== 200) {
        alert((r && r.msg) || '保存失败');
        setStage('chat');
        return;
      }
      // 后端已经异步触发排序了,前端轮询等结果
      $('#upmRankStep').text('AI 正在分析所有教程,请稍候...');
      pollRanking();
    }).fail(function () {
      alert('保存失败,请重试');
      setStage('chat');
    });
  }

  function pollRanking() {
    if (state.polling) return;
    state.polling = true;
    var startTs = Date.now();
    var maxWait = 60 * 1000; // 最长等 60 秒

    function step() {
      $.ajax({
        url: '/common/user-pref-get.php',
        type: 'GET',
        dataType: 'json',
      }).done(function (r) {
        if (r && r.code === 200 && r.data && r.data.ranked_count > 0 && r.data.ranked_at) {
          // 排序完成
          state.polling = false;
          state.hasPref     = true;
          state.enabled     = true;
          state.job         = r.data.job || '';
          state.industry    = r.data.industry || '';
          state.interests   = r.data.interests || [];
          state.aiTags      = r.data.ai_tags || [];
          state.rankedCount = r.data.ranked_count || 0;
          state.rankedAt    = r.data.ranked_at || '';
          renderButton();
          // 更新进度文案,稍后关闭弹窗并刷新列表
          $('#upmRankTitle').text('✅ 已为你精选 ' + state.rankedCount + ' 篇教程');
          $('#upmRankStep').text('正在为你切换到推荐列表...');
          setTimeout(function () {
            closeModal();
            // 排序完成后直接激活「推荐你看」筛选,而不是停留在「全部」
            if (typeof window.userPrefActivateAsFilter === 'function') {
              window.userPrefActivateAsFilter();
            } else if (typeof window.toollist === 'function') {
              window.toollist(1);
            }
          }, 1000);
          return;
        }
        // 还没好,继续轮询
        var elapsed = (Date.now() - startTs) / 1000;
        var stepMsg;
        if (elapsed < 5)       stepMsg = '正在提取关键词...';
        else if (elapsed < 12) stepMsg = '分批分析教程内容(' + Math.min(99, Math.floor(elapsed * 6)) + '%)...';
        else if (elapsed < 25) stepMsg = '合并相关度分数...';
        else                   stepMsg = '即将完成,请稍候...';
        $('#upmRankStep').text(stepMsg);

        if (Date.now() - startTs > maxWait) {
          state.polling = false;
          alert('排序超时,你可以稍后再来「我的习惯」面板看看是否已完成');
          closeModal();
          return;
        }
        setTimeout(step, 2000);
      }).fail(function () {
        setTimeout(step, 3000);
      });
    }
    step();
  }

  // ===========================================================
  // 摘要面板渲染
  // ===========================================================
  function renderSummary() {
    setStage('sum');
    var jobStr = '';
    if (state.job)      jobStr += state.job;
    if (state.industry) jobStr += (jobStr ? ' · ' : '') + state.industry;
    if (!jobStr)        jobStr = '（未填写）';
    $('#upmSumJob').text(jobStr);

    function renderTags($box, arr) {
      $box.empty();
      if (!arr || !arr.length) {
        $box.append('<span class="upm-sum-empty">（无）</span>');
        return;
      }
      arr.forEach(function (t) {
        $box.append('<span class="upm-tag">' + esc(t) + '</span>');
      });
    }
    renderTags($('#upmSumInterests'), state.interests);
    renderTags($('#upmSumAiTags'),    state.aiTags);
    $('#upmSumRankedCount').text(state.rankedCount);
  }

  // ===========================================================
  // 重置
  // ===========================================================
  function resetPref() {
    if (!confirm('确定要清空你的偏好吗?\n清空后将恢复默认排序。')) return;
    $.ajax({
      url: '/common/user-pref-reset.php',
      type: 'POST',
      dataType: 'json',
    }).done(function (r) {
      if (r && r.code === 200) {
        state.hasPref = false;
        state.enabled = false;
        state.job = ''; state.industry = ''; state.interests = []; state.aiTags = [];
        state.rankedCount = 0; state.rankedAt = '';
        renderButton();
        closeModal();
        // 取消「推荐你看」激活态,激活「全部」(第一个可见 tab),回到默认列表
        $('.user-pref-trigger').removeClass('on');
        $('.tab-group-box.on .tab').removeClass('on');
        $('.tab-group-box.on .tab:visible').first().addClass('on');
        if (typeof window.toollist === 'function') window.toollist(1);
      } else {
        alert((r && r.msg) || '重置失败');
      }
    }).fail(function () {
      alert('重置失败,请重试');
    });
  }

  // ===========================================================
  // 事件绑定
  // ===========================================================
  $(function () {
    // 「推荐你看」按钮:
    //   未登录 → 弹登录浮层
    //   已设置偏好且排序就绪 → 当作筛选 tab(切换 .on,刷新列表只显示 AI 推荐)
    //   未设置过 → 弹聊天弹窗
    //   设置中(已写偏好但排序未完成)→ 弹 ranking 轮询窗
    $(document).on('click', '.user-pref-trigger', function (e) {
      e.stopPropagation();
      // 1) 未登录 → 引导登录
      if (typeof window.__is_login !== 'undefined' && window.__is_login === false) {
        if (typeof window.EAlert === 'function') {
          window.EAlert({
            title:   '请先登录后再设置偏好',
            desc:    '<div style="padding:0 20px;line-height:1.7;text-align:center;">此功能为会员专享功能，<br>会根据您的行业、职业、兴趣<br>按先后顺序给您推荐课程。</div>',
            btnText: '去登录',
          }, function (closed) {
            $('.mask1').addClass('on'); $('.tc-login').addClass('on'); closed();
          });
          return;
        }
      }
      // 2) 非会员 → 弹"会员专享"提示,引导开通
      var isVip = (typeof window.__is_vip !== 'undefined' && window.__is_vip === true)
               || (typeof window.__is_lifetime !== 'undefined' && window.__is_lifetime === true);
      if (!isVip) {
        if (typeof window.EAlert === 'function') {
          window.EAlert({
            title: '此功能为会员专享',
            desc:  '<div style="padding:0 20px;line-height:1.7;text-align:center;">会根据您的行业、职业、兴趣<br>按先后顺序给您推荐课程。</div>',
            btnText: '立即开通',
          }, function (closed) {
            closed();
            // 复用站点已有的"开通会员"弹层(joinPro-user 类绑定了打开会员浮层的事件)
            if ($('.joinPro-user').length) {
              $('.joinPro-user').first().trigger('click');
            } else {
              // 兜底:直接跳会员页
              window.location.href = '/member.html';
            }
          });
        } else {
          alert('此功能为会员专享\n会根据您的行业、职业、兴趣按先后顺序给您推荐课程');
        }
        return;
      }
      fetchPref().done(function () {
        if (state.hasPref && state.enabled) {
          // 已就绪 → 当 tab 用,切换激活态,刷新列表为"仅推荐"
          activateAsFilter();
        } else if (state.hasPref && !state.enabled) {
          openModal('rank');
          $('#upmRankTitle').text('AI 正在为你排序...');
          pollRanking();
        } else {
          openModal('chat');
          startChat();
        }
      });
    });

    // ⚙ 齿轮设置按钮:任何时候都弹设置面板(摘要 + 重置/重新对话/重排)
    $(document).on('click', '#userPrefGear', function (e) {
      e.stopPropagation();
      if (typeof window.__is_login !== 'undefined' && window.__is_login === false) return;
      // 非会员同样拦截(防止会员到期后还能用)
      var isVip = (typeof window.__is_vip !== 'undefined' && window.__is_vip === true)
               || (typeof window.__is_lifetime !== 'undefined' && window.__is_lifetime === true);
      if (!isVip) {
        if (typeof window.EAlert === 'function') {
          window.EAlert({
            title: '此功能为会员专享',
            desc:  '<div style="padding:0 20px;line-height:1.7;text-align:center;">会根据您的行业、职业、兴趣<br>按先后顺序给您推荐课程。</div>',
            btnText: '立即开通',
          }, function (closed) {
            closed();
            if ($('.joinPro-user').length) {
              $('.joinPro-user').first().trigger('click');
            } else {
              window.location.href = '/member.html';
            }
          });
        }
        return;
      }
      fetchPref().done(function () {
        if (state.hasPref) {
          renderSummary();
          openModal('sum');
        } else {
          openModal('chat');
          startChat();
        }
      });
    });

    // 关闭(蒙层 / × / 关闭按钮)
    $(document).on('click', '[data-close]', function () { closeModal(); });

    // 发送
    $(document).on('click', '#upmChatSend', userSay);
    $(document).on('keydown', '#upmChatInput', function (e) {
      // Enter 发送, Shift+Enter 换行
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        userSay();
      }
    });

    // 摘要面板的按钮
    $(document).on('click', '#upmBtnReset', resetPref);
    $(document).on('click', '#upmBtnEdit', function () {
      openModal('chat');
      startChat();
    });
    // 「重新精排」:不改用户偏好,直接重跑 AI 排序(把新文章纳入)
    $(document).on('click', '#upmBtnRerank', function () {
      if (!confirm('将重新让 AI 给所有教程打分排序,把新发布的文章纳入。\n大约需要 5-15 秒,确定吗?')) return;
      setStage('rank');
      $('#upmRankTitle').text('AI 正在重新精排...');
      $('#upmRankStep').text('包含最新发布的教程,请稍候');
      // 先清空 DB 里的 ranked_at,让轮询能正确识别"排序进行中"
      $.ajax({
        url: '/common/user-pref-rerank-start.php',
        type: 'POST',
        dataType: 'json',
      }).always(function () {
        // 然后异步触发 rank.php(不等待返回,直接进轮询)
        $.ajax({
          url: '/common/user-pref-rank.php',
          type: 'GET',
          timeout: 60000,
          dataType: 'json',
        });
        // 立即开始轮询
        pollRanking();
      });
    });

    // 初始加载
    fetchPref();
  });
})();
