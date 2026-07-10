(function() {
    'use strict';

    var LANG_MAP = {
        zh:    { api: 'Chinese',              label: '中文' },
        zh_tw: { api: 'Traditional Chinese',  label: '繁體中文' },
        en:    { api: 'English',              label: 'English' },
        ja:    { api: 'Japanese',             label: '日本語' },
        ko:    { api: 'Korean',               label: '한국어' },
        fr:    { api: 'French',               label: 'Français' },
        es:    { api: 'Spanish',              label: 'Español' },
        de:    { api: 'German',               label: 'Deutsch' },
        ru:    { api: 'Russian',              label: 'Русский' },
        pt:    { api: 'Portuguese',           label: 'Português' },
        it:    { api: 'Italian',              label: 'Italiano' },
        ar:    { api: 'Arabic',               label: 'العربية' },
        hi:    { api: 'Hindi',                label: 'हिन्दी' },
        th:    { api: 'Thai',                 label: 'ไทย' },
        vi:    { api: 'Vietnamese',           label: 'Tiếng Việt' },
        id:    { api: 'Indonesian',           label: 'Bahasa Indonesia' },
        ms:    { api: 'Malay',                label: 'Bahasa Melayu' },
        nl:    { api: 'Dutch',                label: 'Nederlands' },
        pl:    { api: 'Polish',               label: 'Polski' },
        tr:    { api: 'Turkish',              label: 'Türkçe' },
        ro:    { api: 'Romanian',             label: 'Română' },
        el:    { api: 'Greek',                label: 'Ελληνικά' },
        cs:    { api: 'Czech',                label: 'Čeština' },
        sv:    { api: 'Swedish',              label: 'Svenska' },
        hu:    { api: 'Hungarian',            label: 'Magyar' },
        da:    { api: 'Danish',               label: 'Dansk' },
        fi:    { api: 'Finnish',              label: 'Suomi' },
        uk:    { api: 'Ukrainian',            label: 'Українська' },
        bg:    { api: 'Bulgarian',            label: 'Български' },
        sr:    { api: 'Serbian',              label: 'Српски' },
        hr:    { api: 'Croatian',             label: 'Hrvatski' },
        sk:    { api: 'Slovak',               label: 'Slovenčina' },
        sl:    { api: 'Slovenian',            label: 'Slovenščina' },
        et:    { api: 'Estonian',             label: 'Eesti' },
        lv:    { api: 'Latvian',              label: 'Latviešu' },
        lt:    { api: 'Lithuanian',           label: 'Lietuvių' },
        he:    { api: 'Hebrew',               label: 'עברית' },
        fa:    { api: 'Western Persian',      label: 'فارسی' },
        ur:    { api: 'Urdu',                 label: 'اردو' },
        bn:    { api: 'Bengali',              label: 'বাংলা' },
        ta:    { api: 'Tamil',                label: 'தமிழ்' },
        te:    { api: 'Telugu',               label: 'తెలుగు' },
        kn:    { api: 'Kannada',              label: 'ಕನ್ನಡ' },
        mr:    { api: 'Marathi',              label: 'मराठी' },
        gu:    { api: 'Gujarati',             label: 'ગુજરાતી' },
        or:    { api: 'Odia',                 label: 'ଓଡ଼ିଆ' },
        ne:    { api: 'Nepali',               label: 'नेपाली' },
        si:    { api: 'Sinhala',              label: 'සිංහල' },
        my:    { api: 'Burmese',              label: 'မြန်မာ' },
        km:    { api: 'Khmer',                label: 'ខ្មែរ' },
        lo:    { api: 'Lao',                  label: 'ລາວ' },
        yue:   { api: 'Cantonese',            label: '粤语' },
        tl:    { api: 'Tagalog',              label: 'Tagalog' },
        sw:    { api: 'Swahili',              label: 'Kiswahili' },
        af:    { api: 'Afrikaans',            label: 'Afrikaans' },
        nb:    { api: 'Norwegian Bokmål',     label: 'Norsk Bokmål' },
        nn:    { api: 'Norwegian Nynorsk',    label: 'Nynorsk' },
        is:    { api: 'Icelandic',            label: 'Íslenska' },
        mt:    { api: 'Maltese',              label: 'Malti' },
        lb:    { api: 'Luxembourgish',        label: 'Lëtzebuergesch' },
        cy:    { api: 'Welsh',                label: 'Cymraeg' },
        ca:    { api: 'Catalan',              label: 'Català' },
        gl:    { api: 'Galician',             label: 'Galego' },
        eu:    { api: 'Basque',               label: 'Euskara' },
        oc:    { api: 'Occitan',              label: 'Occitan' },
        ast:   { api: 'Asturian',             label: 'Asturianu' },
        hy:    { api: 'Armenian',             label: 'Հայերեն' },
        ka:    { api: 'Georgian',             label: 'ქართული' },
        az:    { api: 'North Azerbaijani',    label: 'Azərbaycan' },
        kk:    { api: 'Kazakh',               label: 'Қазақ' },
        uz:    { api: 'Northern Uzbek',       label: 'Oʻzbek' },
        mk:    { api: 'Macedonian',           label: 'Македонски' },
        bs:    { api: 'Bosnian',              label: 'Bosanski' },
        sq:    { api: 'Tosk Albanian',        label: 'Shqip' },
        be:    { api: 'Belarusian',           label: 'Беларуская' },
        sd:    { api: 'Sindhi',               label: 'سنڌي' },
        as:    { api: 'Assamese',             label: 'অসমীয়া' },
        jv:    { api: 'Javanese',             label: 'Basa Jawa' },
        ceb:   { api: 'Cebuano',              label: 'Cebuano' },
        mai:   { api: 'Maithili',             label: 'मैथिली' },
        pag:   { api: 'Pangasinan',           label: 'Pangasinan' },
        war:   { api: 'Waray',                label: 'Waray' },
        scn:   { api: 'Sicilian',             label: 'Sicilianu' },
        vec:   { api: 'Venetian',             label: 'Vèneto' },
        arz:   { api: 'Egyptian Arabic',      label: 'مصري' },
        ary:   { api: 'Moroccan Arabic',      label: 'الدارجة المغربية' },
        ars:   { api: 'Najdi Arabic',         label: 'نجدي' },
        apc:   { api: 'North Levantine Arabic', label: 'شامي' },
        ajp:   { api: 'South Levantine Arabic', label: 'لهجة جنوبية' },
        acm:   { api: 'Mesopotamian Arabic',  label: 'عراقي' },
        aeb:   { api: 'Tunisian Arabic',      label: 'تونسي' },
        acq:   { api: "Ta'izzi-Adeni Arabic", label: 'يمني' }
    };

    var SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'CANVAS', 'VIDEO', 'AUDIO', 'IMG', 'INPUT', 'TEXTAREA', 'CODE', 'PRE']);
    var SKIP_CLASSES = ['lang-switcher', 'lang-dropdown', 'lang-option', 'lang-flag', 'lang-current', 'lang-check', 'lang-translating-indicator',
        'node-content', 'node-title', 'node-id-tag', 'node-prompt-input', 'fullscreen-editor-textarea',
        'publish-editor-content', 'publish-expand-content', 'publish-summary-input',
        'agent-chat-messages', 'agent-user-input',
        'card-title', 'community-card-title',
        'history-card-prompt'];

    function getCookieLang() {
        var m = document.cookie.match(/(?:^|;\s*)site_lang=([^;]*)/);
        if (!m || !m[1]) return '';
        try { return decodeURIComponent(m[1]).trim(); } catch (e) { return m[1].trim(); }
    }

    /** localStorage 优先；无则读 Cookie（跨页跳转保持语言）；再无才用浏览器语言 */
    function getStoredSiteLang() {
        var stored = localStorage.getItem('site-lang');
        if (stored && LANG_MAP[stored]) return stored;
        var cookieLang = getCookieLang();
        if (cookieLang && LANG_MAP[cookieLang]) {
            localStorage.setItem('site-lang', cookieLang);
            return cookieLang;
        }
        return detectBrowserLang();
    }

    var currentLang = getStoredSiteLang();

    function detectBrowserLang() {
        var nav = navigator.language || navigator.userLanguage || '';
        var full = nav.toLowerCase().replace('-', '_');
        if (full === 'zh_cn' || full === 'zh') return 'zh';
        if (full === 'zh_tw' || full === 'zh_hk') return 'zh_tw';
        if (LANG_MAP[full]) return full;
        var base = full.split('_')[0];
        if (LANG_MAP[base]) return base;
        return 'zh';
    }
    var originalTexts = new Map();
    var localCache = {};
    var translating = false;
    var indicator = null;

    var SKIP_TRANSLATE_PATHS = [
        '/sensitive_words_admin.html',
        '/translation_terms_admin.html',
        '/comments_admin.html',
        '/banner_admin.html',
        '/history_admin.html',
        '/admin_recharge.html',
        '/community_admin.html',
        '/notification_admin.html',
        '/withdraw_admin.html',
        '/admin_enterprise.html'
    ];

    var SKIP_TRANSLATE_PREFIXES = [
        '/workflow-agent/'
    ];

    function shouldSkipPage() {
        var path = location.pathname;
        for (var i = 0; i < SKIP_TRANSLATE_PATHS.length; i++) {
            if (path === SKIP_TRANSLATE_PATHS[i]) return true;
        }
        for (var j = 0; j < SKIP_TRANSLATE_PREFIXES.length; j++) {
            if (path.indexOf(SKIP_TRANSLATE_PREFIXES[j]) === 0) return true;
        }
        return false;
    }

    function syncLangOnlyVisibility() {
        var lang = currentLang || 'zh';
        document.documentElement.setAttribute('data-site-lang', lang);
        var zhOnly = document.querySelectorAll('.lang-zh-only');
        for (var i = 0; i < zhOnly.length; i++) {
            zhOnly[i].style.display = (lang === 'zh') ? '' : 'none';
        }
    }

    function init() {
        syncCookie();
        syncLangOnlyVisibility();
        if (shouldSkipPage()) return;
        createIndicator();
        restoreSelection();
        bindSwitcher();

        if (currentLang !== 'zh') {
            translatePage(currentLang);
            observeDom();
        }
    }

    function syncCookie() {
        localStorage.setItem('site-lang', currentLang);
        var cookieLang = getCookieLang();
        if (cookieLang !== currentLang) {
            document.cookie = 'site_lang=' + currentLang + ';path=/;max-age=' + (365*24*3600) + ';SameSite=Lax';
        }
    }

    function createIndicator() {
        indicator = document.createElement('div');
        indicator.className = 'lang-translating-indicator';
        indicator.innerHTML = '<div class="spinner"></div><span>翻译中...</span>';
        document.body.appendChild(indicator);
    }

    function showIndicator() {
        if (indicator) indicator.classList.add('show');
    }

    function hideIndicator() {
        if (indicator) indicator.classList.remove('show');
    }

    function restoreSelection() {
        var label = document.getElementById('langCurrentLabel');
        if (label && LANG_MAP[currentLang]) {
            label.textContent = LANG_MAP[currentLang].label;
        }
        var options = document.querySelectorAll('.lang-option');
        options.forEach(function(opt) {
            opt.classList.toggle('selected', opt.getAttribute('data-lang') === currentLang);
        });
    }

    function bindSwitcher() {
        var btn = document.getElementById('langSwitcherBtn');
        var switcher = document.getElementById('langSwitcher');
        var dropdown = document.getElementById('langDropdown');
        var searchInput = document.getElementById('langSearchInput');
        if (!btn || !switcher) return;

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var opening = !switcher.classList.contains('active');
            switcher.classList.toggle('active');
            if (opening && searchInput) {
                searchInput.value = '';
                filterLangOptions('');
                setTimeout(function() { searchInput.focus(); }, 50);
            }
        });

        document.addEventListener('click', function(e) {
            if (!switcher.contains(e.target)) {
                switcher.classList.remove('active');
            }
        });

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterLangOptions(this.value.trim().toLowerCase());
            });
            searchInput.addEventListener('click', function(e) { e.stopPropagation(); });
        }

        var options = document.querySelectorAll('.lang-option');
        options.forEach(function(opt) {
            opt.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                if (lang === currentLang) {
                    switcher.classList.remove('active');
                    return;
                }
                localStorage.setItem('site-lang', lang);
                document.cookie = 'site_lang=' + lang + ';path=/;max-age=' + (365*24*3600) + ';SameSite=Lax';
                location.reload();
            });
        });
    }

    function filterLangOptions(query) {
        var options = document.querySelectorAll('.lang-option');
        options.forEach(function(opt) {
            if (!query) {
                opt.style.display = '';
                return;
            }
            var label = (opt.getAttribute('data-label') || '').toLowerCase();
            var lang = (opt.getAttribute('data-lang') || '').toLowerCase();
            var text = (opt.textContent || '').toLowerCase();
            opt.style.display = (label.indexOf(query) !== -1 || lang.indexOf(query) !== -1 || text.indexOf(query) !== -1) ? '' : 'none';
        });
    }

    function shouldSkip(node) {
        if (!node || !node.parentElement) return true;
        var el = node.parentElement;
        while (el) {
            if (SKIP_TAGS.has(el.tagName)) return true;
            if (el.classList) {
                for (var i = 0; i < SKIP_CLASSES.length; i++) {
                    if (el.classList.contains(SKIP_CLASSES[i])) return true;
                }
            }
            if (el.hasAttribute && el.hasAttribute('data-no-translate')) return true;
            el = el.parentElement;
        }
        return false;
    }

    function collectTextNodes(root) {
        var nodes = [];
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        return nodes;
    }

    function collectAttrNodes(root) {
        var items = [];
        var els = root.querySelectorAll('[placeholder], [title], [alt], [data-tooltip]');
        els.forEach(function(el) {
            if (shouldSkip(el)) return;
            ['placeholder', 'title', 'alt', 'data-tooltip'].forEach(function(attr) {
                var val = el.getAttribute(attr);
                if (val && val.trim()) {
                    items.push({ el: el, attr: attr, text: val.trim() });
                }
            });
        });
        return items;
    }

    function saveOriginal(key, text) {
        if (!originalTexts.has(key)) {
            originalTexts.set(key, text);
        }
    }

    function restoreOriginal() {
        originalTexts.forEach(function(original, key) {
            if (typeof key === 'object' && key.nodeType === 3) {
                key.textContent = original;
            } else if (typeof key === 'string') {
                var parts = key.split('|||');
                if (parts.length === 2) {
                    try {
                        var els = document.querySelectorAll('[data-translate-id="' + parts[0] + '"]');
                        els.forEach(function(el) {
                            el.setAttribute(parts[1], original);
                        });
                    } catch(e) {}
                }
            }
        });
    }

    function getCacheKey(text, lang) {
        return lang + '|' + text;
    }

    function translatePage(lang) {
        if (translating) return;
        translating = true;
        showIndicator();

        restoreOriginal();

        var langInfo = LANG_MAP[lang];
        if (!langInfo) { translating = false; hideIndicator(); return; }

        var textNodes = collectTextNodes(document.body);
        var attrItems = collectAttrNodes(document.body);

        var allTexts = [];
        var allMeta = [];

        textNodes.forEach(function(node) {
            var t = node.textContent.trim();
            if (!t || !/[\u4e00-\u9fff]/.test(t)) return;
            saveOriginal(node, node.textContent);
            allTexts.push(t);
            allMeta.push({ type: 'text', node: node });
        });

        var attrCounter = 0;
        attrItems.forEach(function(item) {
            if (!/[\u4e00-\u9fff]/.test(item.text)) return;
            var id = 'attr_' + (attrCounter++);
            item.el.setAttribute('data-translate-id', id);
            saveOriginal(id + '|||' + item.attr, item.text);
            allTexts.push(item.text);
            allMeta.push({ type: 'attr', el: item.el, attr: item.attr, id: id });
        });

        if (allTexts.length === 0) {
            translating = false;
            hideIndicator();
            return;
        }

        var cached = [];
        var uncached = [];
        var uncachedIdx = [];

        allTexts.forEach(function(t, i) {
            var ck = getCacheKey(t, lang);
            if (localCache[ck]) {
                cached.push({ idx: i, translated: localCache[ck] });
            } else {
                uncached.push(t);
                uncachedIdx.push(i);
            }
        });

        cached.forEach(function(c) {
            applyTranslation(allMeta[c.idx], c.translated);
        });

        if (uncached.length === 0) {
            translating = false;
            hideIndicator();
            return;
        }

        var unique = [];
        var uniqueMap = {};
        uncached.forEach(function(t) {
            if (!(t in uniqueMap)) {
                uniqueMap[t] = unique.length;
                unique.push(t);
            }
        });

        var batchSize = 200;
        var batches = [];
        for (var i = 0; i < unique.length; i += batchSize) {
            batches.push(unique.slice(i, i + batchSize));
        }

        var batchResults = new Array(unique.length);
        var completed = 0;
        var maxConcurrent = 5;
        var nextBatch = 0;

        function applyAllResults() {
            unique.forEach(function(t, k) {
                localCache[getCacheKey(t, lang)] = batchResults[k] || t;
            });
            uncached.forEach(function(t, k) {
                var ui = uniqueMap[t];
                var realIdx = uncachedIdx[k];
                applyTranslation(allMeta[realIdx], batchResults[ui] || t);
            });
            translating = false;
            hideIndicator();
        }

        function runBatch(bi) {
            if (bi >= batches.length) return;
            var batch = batches[bi];
            var startIdx = bi * batchSize;
            fetchTranslation(batch, langInfo.api, function(translations) {
                translations.forEach(function(t, j) {
                    batchResults[startIdx + j] = t;
                    var globalKey = getCacheKey(unique[startIdx + j], lang);
                    localCache[globalKey] = t;
                });
                uncached.forEach(function(t, k) {
                    var ui = uniqueMap[t];
                    if (ui >= startIdx && ui < startIdx + batch.length && batchResults[ui]) {
                        applyTranslation(allMeta[uncachedIdx[k]], batchResults[ui]);
                    }
                });
                completed++;
                if (completed === batches.length) {
                    applyAllResults();
                } else {
                    runBatch(nextBatch++);
                }
            }, function() {
                completed++;
                if (completed === batches.length) {
                    applyAllResults();
                } else {
                    runBatch(nextBatch++);
                }
            });
        }

        var initialCount = Math.min(maxConcurrent, batches.length);
        nextBatch = initialCount;
        for (var b = 0; b < initialCount; b++) {
            runBatch(b);
        }
    }

    function applyTranslation(meta, translated) {
        if (!translated) return;
        if (meta.type === 'text') {
            var orig = meta.node.textContent;
            var trimmed = orig.trim();
            var prefix = orig.substring(0, orig.indexOf(trimmed));
            var suffix = orig.substring(orig.indexOf(trimmed) + trimmed.length);
            meta.node.textContent = prefix + translated + suffix;
        } else if (meta.type === 'attr') {
            meta.el.setAttribute(meta.attr, translated);
        }
    }

    function fetchTranslation(texts, targetLang, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/translate.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 60000;
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success && data.translations) {
                        onSuccess(data.translations);
                    } else {
                        onError();
                    }
                } catch(e) {
                    onError();
                }
            } else {
                onError();
            }
        };
        xhr.onerror = onError;
        xhr.ontimeout = onError;
        xhr.send(JSON.stringify({
            texts: texts,
            target_lang: targetLang,
            source_lang: 'Chinese'
        }));
    }

    var mutationTimer = null;
    var pendingMutationNodes = [];

    function observeDom() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && !shouldSkipEl(node)) {
                        pendingMutationNodes.push(node);
                    }
                });
            });
            if (pendingMutationNodes.length > 0) {
                clearTimeout(mutationTimer);
                mutationTimer = setTimeout(processMutations, 150);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function shouldSkipEl(el) {
        if (SKIP_TAGS.has(el.tagName)) return true;
        if (el.classList) {
            for (var i = 0; i < SKIP_CLASSES.length; i++) {
                if (el.classList.contains(SKIP_CLASSES[i])) return true;
            }
        }
        if (el.hasAttribute && el.hasAttribute('data-no-translate')) return true;
        return false;
    }

    function processMutations() {
        if (translating) {
            mutationTimer = setTimeout(processMutations, 300);
            return;
        }
        var nodes = pendingMutationNodes.splice(0);
        if (nodes.length === 0) return;

        var langInfo = LANG_MAP[currentLang];
        if (!langInfo) return;

        var allTexts = [];
        var allMeta = [];

        nodes.forEach(function(root) {
            var textNodes = collectTextNodes(root);
            textNodes.forEach(function(node) {
                var txt = node.textContent.trim();
                if (!txt || !/[\u4e00-\u9fff]/.test(txt)) return;
                allTexts.push(txt);
                allMeta.push({ type: 'text', node: node });
            });
            var attrItems = collectAttrNodes(root);
            attrItems.forEach(function(item) {
                if (!/[\u4e00-\u9fff]/.test(item.text)) return;
                allTexts.push(item.text);
                allMeta.push({ type: 'attr', el: item.el, attr: item.attr });
            });
        });

        if (allTexts.length === 0) return;

        var toFetch = [];
        var toFetchIdx = [];

        allTexts.forEach(function(txt, i) {
            var ck = getCacheKey(txt, currentLang);
            if (localCache[ck]) {
                applyTranslation(allMeta[i], localCache[ck]);
            } else {
                toFetch.push(txt);
                toFetchIdx.push(i);
            }
        });

        if (toFetch.length === 0) return;

        var unique = [];
        var umap = {};
        toFetch.forEach(function(t) {
            if (!(t in umap)) { umap[t] = unique.length; unique.push(t); }
        });

        var batchSize = 200;
        var batches = [];
        for (var i = 0; i < unique.length; i += batchSize) {
            batches.push(unique.slice(i, i + batchSize));
        }

        var done = 0;
        batches.forEach(function(batch, bi) {
            var startIdx = bi * batchSize;
            fetchTranslation(batch, langInfo.api, function(translations) {
                translations.forEach(function(t, j) {
                    var key = unique[startIdx + j];
                    localCache[getCacheKey(key, currentLang)] = t;
                });
                toFetch.forEach(function(t, k) {
                    var ui = umap[t];
                    if (ui >= startIdx && ui < startIdx + batch.length) {
                        var cached = localCache[getCacheKey(t, currentLang)];
                        if (cached) applyTranslation(allMeta[toFetchIdx[k]], cached);
                    }
                });
                done++;
            }, function() { done++; });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.FlowPixTranslate = {
        switchLang: function(lang) {
            if (lang === currentLang) return;
            localStorage.setItem('site-lang', lang);
            document.cookie = 'site_lang=' + lang + ';path=/;max-age=' + (365*24*3600) + ';SameSite=Lax';
            location.reload();
        },
        getCurrentLang: function() { return currentLang; },
        retranslate: function() {
            if (currentLang !== 'zh') translatePage(currentLang);
        }
    };
})();
