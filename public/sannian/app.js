const pages = Array.from({ length: 6 }, (_, index) => ` + 1}.mp4`);

const book = document.querySelector("#book");
const turningPage = document.querySelector(".page--turning");
const frontVideo = turningPage.querySelector("video");
const underVideo = document.querySelector(".page--under video");
const progress = document.querySelector("#progress");
const startButton = document.querySelector("#startButton");
const soundButton = document.querySelector("#soundButton");
const invitationButton = document.querySelector("#invitationButton");
const endingActions = document.querySelector("#endingActions");
const restartButton = document.querySelector("#restartButton");
const homeButton = document.querySelector("#homeButton");
const populationBubble = document.querySelector("#populationBubble");
const populationNumber = document.querySelector("#populationNumber");
const hint = document.querySelector("#hint");
const music = document.querySelector("#music");
const ticketMusic = document.querySelector("#ticketMusic");
const ticketOverlay = document.querySelector("#ticketOverlay");
const curlCanvas = document.querySelector("#curlCanvas");
const curlCtx = curlCanvas.getContext("2d");

let currentIndex = 0;
let targetIndex = 1;
let turnProgress = 0;
let turnDirection = 1;
let gestureProgress = 0;
let turnPrepared = false;
let isAnimating = false;
let isDragging = false;
let dragStartX = 0;
let dragLastX = 0;
let dragDirection = 1;
let started = false;
let pageCompleted = false;
let endingActionsTimer;
let activeMusic = music;
const populationTarget = Math.floor(Math.random() * 51) + 250;
let populationAnimationStarted = false;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const INTERACTIVE_SELECTOR = ".invitation, .sound, .ending-actions, .ending-action, .progress, .book__hint";
const reducedMotionQuery = typeof matchMedia === "function"
  ? matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false, addEventListener: () => {} };
let prefersReducedMotion = reducedMotionQuery.matches;
const handleReducedMotionChange = (e) => {
  prefersReducedMotion = e.matches;
};
if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
} else if (typeof reducedMotionQuery.addListener === "function") {
  reducedMotionQuery.addListener(handleReducedMotionChange);
}

function createProgress() {
  pages.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "progress__dot";
    dot.setAttribute("aria-label", `第 ${index + 1} 页`);
    progress.append(dot);
  });
}

function updateProgress() {
  [...progress.children].forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });
}

function syncPopulationBubble(pageIndex) {
  if (pageIndex !== 1) {
    populationBubble.classList.remove("is-visible");
  }
}

function animatePopulationNumber() {
  if (populationAnimationStarted) return;
  populationAnimationStarted = true;

  const duration = 2400;
  const start = performance.now();

  function update(now) {
    const progressValue = clamp((now - start) / duration);
    const eased = 1 - Math.pow(1 - progressValue, 4);
    populationNumber.textContent = String(Math.round(populationTarget * eased));

    if (progressValue < 1) {
      requestAnimationFrame(update);
    } else {
      populationNumber.textContent = String(populationTarget);
    }
  }

  requestAnimationFrame(update);
}

function setTurn(value) {
  turnProgress = clamp(value);
  book.style.setProperty("--turn", turnProgress.toFixed(4));
  book.style.setProperty("--fold-x", `${100 - turnProgress * 78}%`);
  book.style.setProperty("--fold-tilt", "-1.5deg");
  renderCurl();
}

function resizeCurlCanvas() {
  const rect = book.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  curlCanvas.width = Math.max(1, Math.round(rect.width * dpr));
  curlCanvas.height = Math.max(1, Math.round(rect.height * dpr));
  curlCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function getSourceMetrics() {
  const srcEl = frontVideo;
  const srcW = srcEl.videoWidth || 0;
  const srcH = srcEl.videoHeight || 0;
  if (!srcW || !srcH) return null;

  const w = curlCanvas.clientWidth || book.clientWidth;
  const h = curlCanvas.clientHeight || book.clientHeight;
  const targetAspect = w / h;
  const srcAspect = srcW / srcH;
  let drawSrcW, drawSrcH, srcOffsetX, srcOffsetY;
  if (srcAspect > targetAspect) {
    drawSrcH = srcH;
    drawSrcW = srcH * targetAspect;
    srcOffsetX = (srcW - drawSrcW) / 2;
    srcOffsetY = 0;
  } else {
    drawSrcW = srcW;
    drawSrcH = srcW / targetAspect;
    srcOffsetX = 0;
    srcOffsetY = (srcH - drawSrcH) / 2;
  }
  return { srcEl, srcOffsetX, srcOffsetY, drawSrcW, drawSrcH, w, h };
}

function renderCurl() {
  if (!book.classList.contains("is-curling")) return;

  const m = getSourceMetrics();
  if (!m) return;

  const { srcEl, srcOffsetX, srcOffsetY, drawSrcW, drawSrcH, w, h } = m;
  curlCtx.clearRect(0, 0, w, h);

  if (turnProgress <= 0.0005) return;

  const forward = turnDirection >= 0;
  const t = forward ? turnProgress : 1 - turnProgress;
  const foldX = forward ? w * (1 - t) : w * t;

  if (forward) {
    if (foldX > 0.5) {
      const sw = (foldX / w) * drawSrcW;
      curlCtx.drawImage(
        srcEl,
        srcOffsetX, srcOffsetY,
        sw, drawSrcH,
        0, 0,
        foldX, h
      );
    }
  } else {
    if (foldX < w - 0.5) {
      const sx = srcOffsetX + (foldX / w) * drawSrcW;
      const sw = drawSrcW - (foldX / w) * drawSrcW;
      curlCtx.drawImage(
        srcEl,
        sx, srcOffsetY,
        sw, drawSrcH,
        foldX, 0,
        w - foldX, h
      );
    }
  }

  const flapW = forward ? w - foldX : foldX;
  if (flapW <= 0.5) {
    drawFoldShadow(foldX, w, h, forward);
    return;
  }

  const radius = Math.max(8, flapW / Math.PI);

  const sliceCount = 32;
  for (let i = 0; i < sliceCount; i++) {
    const u0 = i / sliceCount;
    const u1 = (i + 1) / sliceCount;
    const uMid = (u0 + u1) / 2;

    const angle = uMid * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const sliceSrcWPage = flapW / sliceCount;
    let sliceSrcX0;
    if (forward) {
      sliceSrcX0 = foldX + u0 * flapW;
    } else {
      sliceSrcX0 = foldX - (u0 + 1 / sliceCount) * flapW;
    }
    const sliceSrcX1 = sliceSrcX0 + sliceSrcWPage;

    const arcLenFromFold = uMid * flapW;
    let destXCenter;
    if (forward) {
      destXCenter = foldX - radius * sin;
    } else {
      destXCenter = foldX + radius * sin;
    }
    void arcLenFromFold;

    const scaleX = Math.max(0.02, Math.abs(cos));
    const destW = sliceSrcWPage * scaleX;
    const destX = destXCenter - destW / 2;

    const realSx = srcOffsetX + (sliceSrcX0 / w) * drawSrcW;
    const realSw = ((sliceSrcX1 - sliceSrcX0) / w) * drawSrcW;

    curlCtx.save();
    try {
      curlCtx.drawImage(
        srcEl,
        realSx, srcOffsetY,
        realSw, drawSrcH,
        destX, 0,
        destW, h
      );
    } catch {
      // ignore source not ready
    }

    const shadeAmount = Math.max(0, 0.55 - 0.55 * cos);
    if (shadeAmount > 0.01) {
      curlCtx.fillStyle = `rgba(0,0,0,${shadeAmount})`;
      curlCtx.fillRect(destX, 0, destW, h);
    }

    if (cos > 0) {
      const hl = Math.pow(cos, 3) * 0.32;
      curlCtx.fillStyle = `rgba(255,255,255,${hl})`;
      curlCtx.fillRect(destX, 0, destW, h);
    }
    curlCtx.restore();
  }

  drawFoldShadow(foldX, w, h, forward);
}

function drawFoldShadow(foldX, w, h, forward) {
  const shadowWidth = Math.min(70, w * 0.16);
  if (shadowWidth <= 0) return;
  let startX, endX;
  if (forward) {
    startX = foldX - shadowWidth;
    endX = foldX;
  } else {
    startX = foldX;
    endX = foldX + shadowWidth;
  }
  const grad = curlCtx.createLinearGradient(startX, 0, endX, 0);
  if (forward) {
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.42)");
  } else {
    grad.addColorStop(0, "rgba(0,0,0,0.42)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
  }
  curlCtx.fillStyle = grad;
  curlCtx.fillRect(Math.min(startX, endX), 0, shadowWidth, h);
}

let curlRafId;
function startCurlLoop() {
  if (curlRafId) return;
  const tick = () => {
    if (!book.classList.contains("is-curling")) {
      curlRafId = undefined;
      return;
    }
    renderCurl();
    curlRafId = requestAnimationFrame(tick);
  };
  curlRafId = requestAnimationFrame(tick);
}

function enterCurl() {
  resizeCurlCanvas();
  book.classList.add("is-curling");
  startCurlLoop();
}

function exitCurl() {
  book.classList.remove("is-curling");
  if (curlRafId) {
    cancelAnimationFrame(curlRafId);
    curlRafId = undefined;
  }
  curlCtx.clearRect(0, 0, curlCanvas.width, curlCanvas.height);
}

function setVideoSource(video, index) {
  if (index < 0 || index >= pages.length) {
    video.removeAttribute("src");
    video.load();
    return;
  }

  if (!video.src.endsWith(encodeURI(pages[index].replace("./", "")))) {
    video.src = pages[index];
    video.load();
  }
}

function showFirstFrame(video) {
  if (!video.getAttribute("src")) return;

  const seek = () => {
    try {
      if (video.paused) {
        video.currentTime = 0;
      }
    } catch {
      // currentTime may be unavailable until metadata is ready.
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    seek();
  } else {
    video.addEventListener("loadedmetadata", seek, { once: true });
  }
}

async function playVideo(video) {
  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 1800);
      video.addEventListener("loadedmetadata", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  }

  if (Number.isFinite(video.duration)) {
    video.currentTime = 0;
  }

  try {
    await video.play();
  } catch {
    // The initial start button provides the user gesture needed on mobile.
  }
}

async function waitForDrawableFrame(video) {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 1800);
      video.addEventListener("loadeddata", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  }

  if ("requestVideoFrameCallback" in video) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 500);
      video.requestVideoFrameCallback(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  } else {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }
}

function loadPage(index, { play = true } = {}) {
  currentIndex = clamp(index, 0, pages.length - 1);
  targetIndex = currentIndex + 1;
  turnDirection = 1;
  turnPrepared = false;
  gestureProgress = 0;
  book.classList.add("is-forward");
  book.classList.remove("is-backward");
  setVideoSource(frontVideo, currentIndex);
  setVideoSource(underVideo, targetIndex);
  showFirstFrame(underVideo);
  setTurn(0);
  updateProgress();
  syncPopulationBubble(currentIndex);
  pageCompleted = false;
  hint.classList.remove("is-visible");
  invitationButton.classList.remove("is-visible", "is-clicked");
  endingActions.classList.remove("is-visible");
  clearTimeout(endingActionsTimer);
  endingActionsTimer = undefined;
  closeTicket();

  if (play) {
    playVideo(frontVideo);
  }
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function prepareTurn(direction) {
  turnDirection = direction;
  targetIndex = currentIndex + direction;
  turnPrepared = true;
  gestureProgress = 0;
  book.classList.add("is-forward");
  book.classList.remove("is-backward");

  if (direction > 0) {
    syncPopulationBubble(currentIndex);
    setVideoSource(frontVideo, currentIndex);
    setVideoSource(underVideo, targetIndex);
    showFirstFrame(underVideo);
    setTurn(0);
  } else {
    const currentTime = frontVideo.currentTime;
    setVideoSource(underVideo, currentIndex);
    underVideo.addEventListener("loadedmetadata", () => {
      underVideo.currentTime = Math.min(currentTime, underVideo.duration || currentTime);
    }, { once: true });
    setVideoSource(frontVideo, targetIndex);
    syncPopulationBubble(targetIndex);
    setTurn(1);
  }

  enterCurl();
}

function animateTurn(target, { commit = false } = {}) {
  if (isAnimating) return;
  isAnimating = true;
  book.classList.add("is-turning");

  const from = turnProgress;
  const distance = Math.abs(target - from);
  const duration = prefersReducedMotion ? 80 : 460 + distance * 260;
  const start = performance.now();
  let completed = false;

  if (turnDirection > 0 && targetIndex >= 0 && targetIndex < pages.length) {
    underVideo.currentTime = 0;
    underVideo.play().catch(() => {});
  }

  async function finish() {
    if (completed) return;
    completed = true;
    setTurn(target);

    if (commit) {
      if (turnDirection > 0) {
        book.classList.add("is-settling");
        currentIndex = targetIndex;
        updateProgress();
        const handoffTime = underVideo.currentTime;
        setVideoSource(frontVideo, currentIndex);
        if (frontVideo.readyState < HTMLMediaElement.HAVE_METADATA) {
          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, 1800);
            frontVideo.addEventListener("loadedmetadata", () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });
          });
        }
        frontVideo.currentTime = Math.min(handoffTime, frontVideo.duration || handoffTime);
        await frontVideo.play().catch(() => {});
        await waitForDrawableFrame(frontVideo);
        setTurn(0);
        book.classList.remove("is-settling");
        setVideoSource(underVideo, currentIndex + 1);
        pageCompleted = false;
        syncPopulationBubble(currentIndex);
        invitationButton.classList.remove("is-visible", "is-clicked");
        endingActions.classList.remove("is-visible");
        clearTimeout(endingActionsTimer);
        endingActionsTimer = undefined;
      } else {
        loadPage(targetIndex);
      }

      isAnimating = false;
      book.classList.remove("is-turning");
      exitCurl();
      return;
    }

    loadPage(currentIndex);
    isAnimating = false;
    book.classList.remove("is-turning");
    exitCurl();
  }

  function frame(now) {
    if (completed) return;
    const elapsed = clamp((now - start) / duration);
    setTurn(from + (target - from) * easeInOutCubic(elapsed));

    if (elapsed < 1) {
      requestAnimationFrame(frame);
      return;
    }

    finish();
  }

  requestAnimationFrame(frame);
  setTimeout(finish, duration + 180);
}

function goNext() {
  if (currentIndex >= pages.length - 1 || isAnimating) return;
  hint.classList.remove("is-visible");
  frontVideo.pause();
  prepareTurn(1);
  animateTurn(1, { commit: true });
}

function goPrevious() {
  if (currentIndex <= 0 || isAnimating) return;
  hint.classList.remove("is-visible");
  frontVideo.pause();
  prepareTurn(-1);
  animateTurn(0, { commit: true });
}

function handlePointerDown(event) {
  if (!started || isAnimating || event.button > 0) return;
  if (event.target.closest(INTERACTIVE_SELECTOR)) return;
  isDragging = true;
  dragStartX = event.clientX;
  dragLastX = event.clientX;
  dragDirection = 1;
  gestureProgress = 0;
  turnPrepared = false;
  try {
    book.setPointerCapture?.(event.pointerId);
  } catch {
    // pointer capture may fail on some older browsers; we still receive
    // pointer events via the document fallback below.
  }
  // 不在按下瞬间暂停视频，避免单击/轻点导致视频停掉。
  // 真正暂停延迟到 handlePointerMove 判定为"翻页手势"时再执行。
}

function handlePointerMove(event) {
  if (!isDragging) return;
  dragLastX = event.clientX;
  const delta = dragStartX - dragLastX;

  if (Math.abs(delta) < 12) {
    return;
  }

  dragDirection = delta >= 0 ? 1 : -1;

  const canTurn = dragDirection > 0
    ? currentIndex < pages.length - 1
    : currentIndex > 0;

  if (!canTurn) {
    setTurn(0);
    return;
  }

  if (!turnPrepared || turnDirection !== dragDirection) {
    prepareTurn(dragDirection);
    // 第一次确认为翻页手势时再暂停当前视频，避免单击误暂停。
    if (!frontVideo.paused) frontVideo.pause();
  }

  gestureProgress = clamp(Math.abs(delta) / (book.clientWidth * 0.72));
  setTurn(dragDirection > 0 ? gestureProgress : 1 - gestureProgress);
}

function handlePointerUp(event) {
  if (!isDragging) return;
  isDragging = false;
  try {
    book.releasePointerCapture?.(event.pointerId);
  } catch {
    // ignore
  }
  const delta = dragStartX - dragLastX;

  if (!turnPrepared || Math.abs(delta) < 12) {
    turnPrepared = false;
    gestureProgress = 0;
    // 单击/无效手势：若视频被暂停（极端情况下），恢复播放
    if (started && !pageCompleted && frontVideo.paused && frontVideo.readyState >= 2) {
      frontVideo.play().catch(() => {});
    }
    return;
  }

  const canTurn = dragDirection > 0
    ? currentIndex < pages.length - 1
    : currentIndex > 0;

  if (!canTurn) {
    setTurn(0);
    frontVideo.play().catch(() => {});
  } else if (gestureProgress > 0.24 || Math.abs(delta) > 42) {
    if (dragDirection > 0) {
      animateTurn(1, { commit: true });
    } else {
      animateTurn(0, { commit: true });
    }
  } else {
    animateTurn(dragDirection > 0 ? 0 : 1);
  }
}

function handleVideoEnded() {
  pageCompleted = true;

  if (currentIndex === pages.length - 1) {
    invitationButton.classList.add("is-visible");
    scheduleEndingActions();
  } else {
    hint.classList.add("is-visible");
  }
}

function handleVideoTimeUpdate() {
  if (!Number.isFinite(frontVideo.duration)) {
    return;
  }

  const remaining = frontVideo.duration - frontVideo.currentTime;

  if (!frontVideo.ended && remaining > 0.7) {
    hint.classList.remove("is-visible");
  }

  if (
    currentIndex < pages.length - 1
    && remaining <= 0.7
  ) {
    hint.classList.add("is-visible");
  }

  if (
    currentIndex === 1
    && remaining <= 1.8
  ) {
    populationBubble.classList.add("is-visible");
    animatePopulationNumber();
  }

  if (currentIndex === pages.length - 1 && remaining <= 5) {
    invitationButton.classList.add("is-visible");
    scheduleEndingActions();
  }
}

async function startExperience() {
  if (started) return;
  started = true;

  if (music.paused) {
    try {
      music.volume = 0.48;
      await music.play();
    } catch {
      soundButton.classList.add("is-muted");
      soundButton.setAttribute("aria-label", "开启背景音乐");
    }
  }

  syncSoundButton();
  setTimeout(syncSoundButton, 180);
  startButton.classList.add("is-hidden");

  // 首屏视差云雾背景：进入漫画后渐隐并停止渲染（省电）
  const smokeBg = document.getElementById("smokeBackground");
  if (smokeBg) smokeBg.classList.add("is-hidden");
  if (window.__sannianSmokeBg && typeof window.__sannianSmokeBg.fadeOut === "function") {
    window.__sannianSmokeBg.fadeOut(700);
  }

  loadPage(0);
}

async function tryAutoplayMusic() {
  music.volume = 0.48;

  try {
    await music.play();
    soundButton.classList.remove("is-muted");
    soundButton.setAttribute("aria-label", "关闭背景音乐");
  } catch {
    soundButton.classList.add("is-muted");
    soundButton.setAttribute("aria-label", "开启背景音乐");
  }
}

function syncSoundButton() {
  const isPlaying = !activeMusic.paused && !activeMusic.muted && activeMusic.volume > 0;
  soundButton.classList.toggle("is-muted", !isPlaying);
  soundButton.setAttribute(
    "aria-label",
    isPlaying ? "关闭背景音乐" : "开启背景音乐"
  );
}

async function toggleSound() {
  if (activeMusic.paused) {
    try {
      await activeMusic.play();
    } catch {
      return;
    }
  } else {
    activeMusic.pause();
  }

  syncSoundButton();
}

function redirectToHomeForVip() {
  try {
    sessionStorage.setItem("letter_postLogin", "tcPro");
  } catch {
    // ignore
  }
  window.location.href = "/";
}

async function showTicketCelebration() {
  invitationButton.classList.remove("is-clicked");
  void invitationButton.offsetWidth;
  invitationButton.classList.add("is-clicked");
  book.classList.add("has-ticket");
  ticketOverlay.classList.add("is-visible");
  ticketOverlay.setAttribute("aria-hidden", "false");

  music.pause();
  ticketMusic.currentTime = 0;
  ticketMusic.volume = 0.58;
  activeMusic = ticketMusic;

  try {
    await ticketMusic.play();
  } finally {
    syncSoundButton();
  }

  window.dispatchEvent(new CustomEvent("threeYearInvitationAccepted", {
    detail: { page: currentIndex + 1 }
  }));
}

/* ===== 轻量 Toast 提示 ===== */
let __sannianToastEl = null;
let __sannianToastTimer = null;
function showToast(message, type = "default", duration = 2600) {
  if (!message) return;
  if (!__sannianToastEl) {
    __sannianToastEl = document.createElement("div");
    __sannianToastEl.className = "sy-toast";
    document.body.appendChild(__sannianToastEl);
  }
  const el = __sannianToastEl;
  el.className = "sy-toast" + (type === "warn" ? " sy-toast--warn" : type === "info" ? " sy-toast--info" : "");
  el.textContent = message;
  void el.offsetWidth;
  el.classList.add("is-visible");
  clearTimeout(__sannianToastTimer);
  __sannianToastTimer = setTimeout(() => {
    el.classList.remove("is-visible");
  }, duration);
}

async function acceptInvitation() {
  console.log("[sannian] acceptInvitation() 被触发，disabled =", invitationButton.disabled);
  showToast("正在领取门票...", "info", 1200);
  if (invitationButton.disabled) {
    console.warn("[sannian] 按钮处于 disabled 状态，请求被拦截");
    return;
  }
  invitationButton.disabled = true;

  try {
    console.log("[sannian] 开始请求 /api/sannian-ticket-accept.php");
    const response = await fetch("/api/sannian-ticket-accept.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "action=accept"
    });
    console.log("[sannian] 收到响应 status =", response.status, "ok =", response.ok);

    let result = null;
    let rawText = "";
    try {
      rawText = await response.text();
      console.log("[sannian] 响应原始内容:", rawText.slice(0, 500));
      result = JSON.parse(rawText);
      console.log("[sannian] 解析后 result =", result);
    } catch (parseErr) {
      console.error("[sannian] JSON 解析失败:", parseErr, "原始内容:", rawText.slice(0, 500));
      showToast("接口响应异常: " + rawText.slice(0, 80), "warn");
      invitationButton.disabled = false;
      return;
    }

    if (result.code === 401) {
      showToast(result.msg || "请先登录后再领取门票", "warn");
      setTimeout(() => { redirectToHomeForVip(); }, 1200);
      return;
    }

    if (result.code === 403) {
      showToast(result.msg || "开通会员后即可领取三年之约门票", "warn");
      setTimeout(() => { redirectToHomeForVip(); }, 1600);
      return;
    }

    if (result.code !== 200) {
      showToast(result.msg || "领取失败，请稍后再试", "warn");
      invitationButton.disabled = false;
      return;
    }

    if (result.data && result.data.already) {
      showToast("您已成功领取过三年之约门票", "info", 2000);
    } else {
      showToast("领取成功，欢迎加入三年之约", "info", 2000);
    }

    await showTicketCelebration();
    invitationButton.disabled = false; // 成功后恢复，允许再次点击查看

    const targetUrl = invitationButton.dataset.url?.trim();
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  } catch (err) {
    console.error("[sannian] fetch 异常:", err);
    showToast("网络异常: " + (err && err.message ? err.message : err), "warn");
    invitationButton.disabled = false;
  }
}

/* 兜底：阻止事件冒泡到 book（避免 book 的 pointer capture 拦截 click），
   同时在 pointerup 兜底触发，保证即使 click 没产生也能进入领取流程。 */
invitationButton.addEventListener("pointerdown", (e) => {
  console.log("[sannian] invitation 按钮 pointerdown 触发");
  e.stopPropagation();
});
let __invFiredAt = 0;
invitationButton.addEventListener("pointerup", (e) => {
  console.log("[sannian] invitation 按钮 pointerup 触发");
  e.stopPropagation();
  // pointerup 兜底：若 100ms 内 click 没触发 acceptInvitation，主动调用
  const fired = __invFiredAt;
  setTimeout(() => {
    if (__invFiredAt === fired) {
      console.warn("[sannian] click 未触发，pointerup 兜底调用 acceptInvitation");
      acceptInvitation();
    }
  }, 100);
});
invitationButton.addEventListener("click", () => {
  __invFiredAt = Date.now();
}, true);

function closeTicket() {
  book.classList.remove("has-ticket");
  ticketOverlay.classList.remove("is-visible");
  ticketOverlay.setAttribute("aria-hidden", "true");
  ticketMusic.pause();
  ticketMusic.currentTime = 0;
  activeMusic = music;
  invitationButton.disabled = false;
  syncSoundButton();
}

function scheduleEndingActions() {
  if (endingActions.classList.contains("is-visible") || endingActionsTimer) {
    return;
  }

  endingActionsTimer = setTimeout(() => {
    endingActions.classList.add("is-visible");
    endingActionsTimer = undefined;
  }, 500);
}

function restartExperience() {
  invitationButton.classList.remove("is-visible", "is-clicked");
  invitationButton.disabled = false;
  endingActions.classList.remove("is-visible");
  clearTimeout(endingActionsTimer);
  endingActionsTimer = undefined;
  populationAnimationStarted = false;
  populationNumber.textContent = "0";
  closeTicket();
  loadPage(0);
}

function returnHome() {
  const configuredHome = homeButton.dataset.url?.trim();
  if (configuredHome) {
    window.location.href = configuredHome;
    return;
  }

  window.location.href = window.location.protocol === "file:"
    ? "./"
    : `${window.location.origin}/`;
}

createProgress();
loadPage(0, { play: false });
book.classList.add("is-forward");
tryAutoplayMusic();

[music, ticketMusic].forEach((audio) => {
  audio.addEventListener("play", syncSoundButton);
  audio.addEventListener("playing", syncSoundButton);
  audio.addEventListener("pause", syncSoundButton);
  audio.addEventListener("volumechange", syncSoundButton);
  audio.addEventListener("timeupdate", syncSoundButton);
});

startButton.addEventListener("click", startExperience);
soundButton.addEventListener("click", toggleSound);
invitationButton.addEventListener("click", acceptInvitation);
restartButton.addEventListener("click", restartExperience);
homeButton.addEventListener("click", returnHome);
frontVideo.addEventListener("ended", handleVideoEnded);
frontVideo.addEventListener("timeupdate", handleVideoTimeUpdate);
book.addEventListener("pointerdown", handlePointerDown);
book.addEventListener("pointermove", handlePointerMove);
book.addEventListener("pointerup", handlePointerUp);
book.addEventListener("pointercancel", handlePointerUp);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") goNext();
  if (event.key === "ArrowLeft") goPrevious();
});

const handleViewportChange = () => {
  resizeCurlCanvas();
  if (book.classList.contains("is-curling")) {
    renderCurl();
  }
};

window.addEventListener("resize", handleViewportChange);
window.addEventListener("orientationchange", () => {
  setTimeout(handleViewportChange, 120);
});

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", handleViewportChange);
}

if (typeof ResizeObserver !== "undefined") {
  const ro = new ResizeObserver(handleViewportChange);
  ro.observe(book);
}

resizeCurlCanvas();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    frontVideo.pause();
    activeMusic.pause();
  } else if (started) {
    frontVideo.play().catch(() => {});
    if (!soundButton.classList.contains("is-muted")) {
      activeMusic.play().catch(() => {});
    }
  }
});
