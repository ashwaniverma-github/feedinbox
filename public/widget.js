(function () {
    'use strict';

    // Prevent the real script from initializing twice. Note: window.feedinbox may
    // already exist as the stub queue function from the embed snippet, so we guard
    // on a dedicated flag instead of the presence of window.feedinbox.
    if (window.__feedinboxLoaded) return;
    window.__feedinboxLoaded = true;

    // Icon SVG paths
    var TRIGGER_ICONS = {
        chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
        feedback: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>',
        question: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
        lightbulb: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8a6 6 0 1 0-12 0 4.65 4.65 0 0 0 1.5 3.5c.76.76 1.23 1.52 1.41 2.5"></path>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>'
    };

    // Shared state for the exit-intent feature (set during init)
    var _apiUrl = '';
    var _projectKey = '';
    var _intentSettings = null;        // resolved intentWidget config, or null if unavailable
    var _intentPrimary = '#171717';
    var _intentPosition = 'bottom-right';
    var _settingsLoaded = false;
    var _pendingEvents = [];           // events received before settings finished loading
    var MAX_PENDING_EVENTS = 20;       // cap the queue in case init() never resolves
    var _intentTimer = null;           // fallback "show anyway" timer
    var _intentEventName = '';
    var _intentContext = {};
    var _intentKeyHandler = null;      // Escape-to-dismiss handler for the intent card
    var _intentArmedAt = 0;            // when high_intent armed the triggers (0 = not armed)
    var _intentMouseOutHandler = null; // desktop exit signal: pointer leaves viewport top
    var _intentVisibilityHandler = null; // tab-hidden exit signal
    var EXIT_SIGNAL_FLOOR_MS = 3000;   // ignore automatic exit signals right after arming

    function detectApiUrl() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('widget.js') !== -1) {
                return scripts[i].src.replace('/widget.js', '');
            }
        }
        return window.location.origin;
    }

    function init(config) {
        if (!config || !config.projectKey) {
            console.error('Feedinbox: Missing projectKey in configuration');
            return;
        }

        // Prevent duplicate widget
        if (document.getElementById('feedinbox-widget')) return;

        var API_URL = detectApiUrl();
        _apiUrl = API_URL;
        _projectKey = config.projectKey;

        // Fetch project settings first, then render widget
        fetch(API_URL + '/api/widget/project?key=' + encodeURIComponent(config.projectKey))
            .then(function (response) { return response.json(); })
            .then(function (data) {
                var widgetSettings = data.widget || {};

                // Apply settings from server (Pro users get custom, free users get default)
                var settings = {
                    enabled: widgetSettings.enabled !== false,
                    primaryColor: widgetSettings.primaryColor || config.primaryColor || '#171717',
                    position: widgetSettings.position || config.position || 'bottom-right',
                    triggerIcon: widgetSettings.triggerIcon || 'chat',
                    borderRadius: widgetSettings.borderRadius || 16,
                    showEmail: widgetSettings.showEmail !== false,
                    headerText: widgetSettings.headerText || 'Send Feedback',
                    hideBranding: data.hideBranding || false
                };

                _intentSettings = (data.intentWidget && data.intentWidget.enabled) ? data.intentWidget : null;
                _intentPrimary = settings.primaryColor;
                _intentPosition = settings.position;

                // Only render the feedback button if it's enabled. Why-Not-Buy still
                // works independently via the event handler.
                if (settings.enabled) renderWidget(API_URL, config, settings);
                finishSettingsLoad();
            })
            .catch(function (error) {
                console.warn('Feedinbox: Could not fetch project info, using defaults', error);
                _intentSettings = null;
                // Render with defaults on error
                renderWidget(API_URL, config, {
                    primaryColor: config.primaryColor || '#171717',
                    position: config.position || 'bottom-right',
                    triggerIcon: 'chat',
                    borderRadius: 16,
                    showEmail: true,
                    headerText: 'Send Feedback',
                    hideBranding: false
                });
                finishSettingsLoad();
            });
    }

    function finishSettingsLoad() {
        _settingsLoaded = true;
        var pending = _pendingEvents;
        _pendingEvents = [];
        for (var i = 0; i < pending.length; i++) {
            handleEvent(pending[i][0], pending[i][1]);
        }
    }

    // Public event dispatch: window.feedinbox('event', name, context)
    function handleEvent(name, context) {
        if (!name) return;
        // Queue until project settings (incl. intent config) have loaded (capped
        // so a queue can't grow unbounded if init() never resolves)
        if (!_settingsLoaded) {
            if (_pendingEvents.length < MAX_PENDING_EVENTS) {
                _pendingEvents.push([name, context]);
            }
            return;
        }
        if (!_intentSettings) return; // feature disabled or unavailable

        if (name === _intentSettings.conversionEvent) {
            disarmIntentTriggers();
            // Converting counts as "done" for this session, so no later high_intent
            // event re-asks a visitor who already bought.
            markIntentAnswered();
            dismissIntentCard(); // hide the prompt if it's already on screen
            return;
        }

        if (name === _intentSettings.abandonEvent) {
            // Host-driven abandonment (e.g. pricing modal closed without buying):
            // the strongest signal, so it shows immediately with no dwell floor.
            // Works standalone too: if high_intent never fired, this call arms
            // the card with its own name/context.
            if (intentClosedThisSession()) return;
            if (document.getElementById('feedinbox-intent')) return; // already showing
            if (!_intentArmedAt) {
                _intentEventName = name;
                _intentContext = (context && typeof context === 'object') ? context : {};
            }
            triggerIntentCard();
            return;
        }

        if (name === _intentSettings.highIntentEvent) {
            if (intentClosedThisSession()) return;
            if (document.getElementById('feedinbox-intent')) return; // already showing
            armIntentTriggers(name, context);
        }
    }

    // high_intent arms three ways for the card to appear; the first one to fire
    // wins and disarms the rest:
    //   1. the host's abandon event (handled in handleEvent above),
    //   2. an automatic exit signal (pointer out the top, or tab hidden),
    //   3. the fallback timer (delaySeconds), so a silent walk-away still asks.
    // Automatic signals are ignored for EXIT_SIGNAL_FLOOR_MS after arming so a
    // stray mouse flick right after opening pricing can't trigger the card.
    function armIntentTriggers(name, context) {
        disarmIntentTriggers(); // reset any previous arming
        _intentEventName = name;
        _intentContext = (context && typeof context === 'object') ? context : {};
        _intentArmedAt = Date.now();

        // Fallback: show anyway after the configured delay (explicit 0 = immediately).
        // Can be switched off entirely, in which case the card waits for a real
        // exit signal and a visitor who is still reading is never interrupted.
        if (_intentSettings.fallbackEnabled !== false) {
            var delaySeconds = typeof _intentSettings.delaySeconds === 'number' ? _intentSettings.delaySeconds : 30;
            _intentTimer = setTimeout(triggerIntentCard, Math.max(0, delaySeconds * 1000));
        }

        // Desktop exit signal: pointer leaves through the top of the viewport
        // (heading for the tab bar / close button).
        _intentMouseOutHandler = function (e) {
            if (e.relatedTarget || e.clientY > 0) return;
            if (Date.now() - _intentArmedAt < EXIT_SIGNAL_FLOOR_MS) return;
            triggerIntentCard();
        };
        document.addEventListener('mouseout', _intentMouseOutHandler);

        // Tab hidden (works on mobile, where there is no mouse-out): render the
        // card while hidden so it greets the visitor when they come back.
        _intentVisibilityHandler = function () {
            if (!document.hidden) return;
            if (Date.now() - _intentArmedAt < EXIT_SIGNAL_FLOOR_MS) return;
            triggerIntentCard();
        };
        document.addEventListener('visibilitychange', _intentVisibilityHandler);
    }

    function disarmIntentTriggers() {
        if (_intentTimer) { clearTimeout(_intentTimer); _intentTimer = null; }
        if (_intentMouseOutHandler) {
            document.removeEventListener('mouseout', _intentMouseOutHandler);
            _intentMouseOutHandler = null;
        }
        if (_intentVisibilityHandler) {
            document.removeEventListener('visibilitychange', _intentVisibilityHandler);
            _intentVisibilityHandler = null;
        }
        _intentArmedAt = 0;
    }

    // Shared gate: whichever signal fires first lands here; disarm the others,
    // re-check the session guards, and show the card.
    function triggerIntentCard() {
        disarmIntentTriggers();
        if (intentClosedThisSession()) return;
        renderIntentCard();
    }

    function intentSessionId() {
        var key = 'feedinbox_sid_' + _projectKey;
        try {
            var sid = sessionStorage.getItem(key);
            if (!sid) {
                sid = 'fs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
                sessionStorage.setItem(key, sid);
            }
            return sid;
        } catch (e) {
            return 'fs_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        }
    }

    function intentAlreadyAnswered() {
        try {
            return sessionStorage.getItem('feedinbox_intent_done_' + _projectKey) === '1';
        } catch (e) {
            return false;
        }
    }

    function markIntentAnswered() {
        try {
            sessionStorage.setItem('feedinbox_intent_done_' + _projectKey, '1');
        } catch (e) { /* ignore */ }
    }

    // Dismissing the card (close button / Escape) suppresses it for the rest of
    // the session, tracked separately from "answered" so the semantics stay clear.
    function intentDismissedThisSession() {
        try {
            return sessionStorage.getItem('feedinbox_intent_dismissed_' + _projectKey) === '1';
        } catch (e) {
            return false;
        }
    }

    function markIntentDismissed() {
        try {
            sessionStorage.setItem('feedinbox_intent_dismissed_' + _projectKey, '1');
        } catch (e) { /* ignore */ }
    }

    // A visitor who answered, converted, or dismissed is done for this session.
    function intentClosedThisSession() {
        return intentAlreadyAnswered() || intentDismissedThisSession();
    }

    // Removes the intent card (if present) plus its styles and Escape listener.
    // Safe to call whether or not the card is showing.
    function dismissIntentCard() {
        if (_intentKeyHandler) {
            document.removeEventListener('keydown', _intentKeyHandler);
            _intentKeyHandler = null;
        }
        var card = document.getElementById('feedinbox-intent');
        var styleEl = document.getElementById('feedinbox-intent-style');
        if (card) {
            card.classList.remove('open');
            setTimeout(function () {
                if (card.parentNode) card.parentNode.removeChild(card);
                if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
            }, 300);
        } else if (styleEl && styleEl.parentNode) {
            styleEl.parentNode.removeChild(styleEl);
        }
    }

    function renderIntentCard() {
        if (document.getElementById('feedinbox-intent')) return;
        if (!_intentSettings) return;

        var posRight = _intentPosition.indexOf('right') !== -1;
        var posBottom = _intentPosition.indexOf('bottom') !== -1;
        var PRIMARY = _intentPrimary;

        var styles = '#feedinbox-intent{position:fixed;' + (posRight ? 'right:20px;' : 'left:20px;') + (posBottom ? 'bottom:20px;' : 'top:20px;') + 'width:320px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,0.18),0 4px 12px rgba(0,0,0,0.08);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:18px 18px 14px;box-sizing:border-box;transform:translateY(16px);opacity:0;visibility:hidden;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .28s,visibility .28s;z-index:1000001}#feedinbox-intent.open{transform:translateY(0);opacity:1;visibility:visible}.feedinbox-intent-close{position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;color:#a3a3a3;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center}.feedinbox-intent-close:hover{background:#f5f5f5;color:#171717}.feedinbox-intent-q{font-size:15px;font-weight:600;color:#171717;margin:0 24px 14px 0;line-height:1.4}.feedinbox-intent-opts{display:flex;flex-direction:column;gap:8px}.feedinbox-intent-opt{width:100%;text-align:left;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;font-size:14px;color:#171717;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s;box-shadow:0 1px 2px rgba(0,0,0,0.04)}.feedinbox-intent-opt:hover{border-color:' + PRIMARY + '}.feedinbox-intent-opt.selected{border-color:' + PRIMARY + ';background:' + PRIMARY + '0d;font-weight:500}.feedinbox-intent-text{width:100%;margin-top:10px;padding:9px 11px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;font-family:inherit;box-sizing:border-box;resize:none;color:#171717}.feedinbox-intent-text:focus{outline:none;border-color:' + PRIMARY + '}.feedinbox-intent-submit{width:100%;margin-top:10px;padding:10px;background:' + PRIMARY + ';color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;transition:opacity .2s}.feedinbox-intent-submit:disabled{opacity:.45;cursor:not-allowed}.feedinbox-intent-footer{margin-top:10px;text-align:center}.feedinbox-intent-footer a{font-size:11px;color:#a3a3a3;text-decoration:none}.feedinbox-intent-footer a:hover{color:#171717}.feedinbox-intent-thanks{text-align:center;padding:18px 8px}.feedinbox-intent-thanks-title{font-size:16px;font-weight:600;color:#171717;margin:0 0 4px}.feedinbox-intent-thanks-text{font-size:13px;color:#737373;margin:0}@media(prefers-color-scheme:dark){#feedinbox-intent{background:#171717}.feedinbox-intent-close{color:#a3a3a3}.feedinbox-intent-close:hover{background:#262626;color:#fafafa}.feedinbox-intent-q{color:#fafafa}.feedinbox-intent-opt{background:#1f1f1f;border-color:#404040;color:#fafafa}.feedinbox-intent-text{background:#262626;border-color:#404040;color:#fafafa}.feedinbox-intent-thanks-title{color:#fafafa}.feedinbox-intent-footer a:hover{color:#fafafa}}html.dark #feedinbox-intent{background:#171717}html.dark .feedinbox-intent-q{color:#fafafa}html.dark .feedinbox-intent-opt{background:#1f1f1f;border-color:#404040;color:#fafafa}html.dark .feedinbox-intent-text{background:#262626;border-color:#404040;color:#fafafa}html.dark .feedinbox-intent-thanks-title{color:#fafafa}';

        var styleEl = document.createElement('style');
        styleEl.id = 'feedinbox-intent-style';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        var opts = _intentSettings.options || [];
        var optsHTML = '';
        for (var i = 0; i < opts.length; i++) {
            optsHTML += '<button type="button" class="feedinbox-intent-opt" data-oid="' + escapeAttr(opts[i].id) + '" data-olabel="' + escapeAttr(opts[i].label) + '">' + escapeHtml(opts[i].label) + '</button>';
        }
        var footerHTML = _intentSettings.hideBranding ? '' : '<div class="feedinbox-intent-footer"><a href="https://feedinbox.com" target="_blank" rel="noopener">Powered by Feedinbox</a></div>';

        var card = document.createElement('div');
        card.id = 'feedinbox-intent';
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-label', 'Quick question');
        card.innerHTML =
            '<button class="feedinbox-intent-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>' +
            '<p class="feedinbox-intent-q">' + escapeHtml(_intentSettings.question || 'What stopped you?') + '</p>' +
            '<div class="feedinbox-intent-opts">' + optsHTML + '</div>' +
            '<input type="text" class="feedinbox-intent-text" placeholder="Anything else? (optional)" maxlength="2000" />' +
            '<button type="button" class="feedinbox-intent-submit" disabled>Send</button>' +
            footerHTML;
        document.body.appendChild(card);

        // Trigger slide-in
        requestAnimationFrame(function () { card.classList.add('open'); });

        var selectedId = null;
        var selectedLabel = null;
        var optButtons = card.querySelectorAll('.feedinbox-intent-opt');
        var textInput = card.querySelector('.feedinbox-intent-text');
        var submitBtn = card.querySelector('.feedinbox-intent-submit');
        var closeBtn = card.querySelector('.feedinbox-intent-close');

        function refreshSubmit() {
            // Enable Send once they've picked an option OR typed a custom answer
            submitBtn.disabled = !(selectedId || (textInput.value && textInput.value.trim()));
        }

        for (var j = 0; j < optButtons.length; j++) {
            optButtons[j].addEventListener('click', function () {
                for (var k = 0; k < optButtons.length; k++) optButtons[k].classList.remove('selected');
                this.classList.add('selected');
                selectedId = this.getAttribute('data-oid');
                selectedLabel = this.getAttribute('data-olabel');
                refreshSubmit();
            });
        }

        textInput.addEventListener('input', refreshSubmit);

        closeBtn.addEventListener('click', function () {
            markIntentDismissed();
            dismissIntentCard();
        });

        // Escape-to-dismiss (listener removed inside dismissIntentCard)
        _intentKeyHandler = function (e) {
            if (e.key === 'Escape') {
                markIntentDismissed();
                dismissIntentCard();
            }
        };
        document.addEventListener('keydown', _intentKeyHandler);

        // Move focus into the dialog for keyboard users
        requestAnimationFrame(function () { (optButtons[0] || textInput).focus(); });

        submitBtn.addEventListener('click', function () {
            if (!selectedId && !(textInput.value && textInput.value.trim())) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            fetch(_apiUrl + '/api/widget/intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectKey: _projectKey,
                    sessionId: intentSessionId(),
                    eventName: _intentEventName,
                    optionId: selectedId || undefined,
                    optionLabel: selectedLabel || undefined,
                    text: textInput.value || undefined,
                    context: _intentContext,
                    pageUrl: window.location.href
                })
            }).then(function (response) {
                if (!response.ok) throw new Error('Failed to submit');
                markIntentAnswered();
                showIntentThanks(card);
                setTimeout(dismissIntentCard, 1600);
            }).catch(function (error) {
                console.error('Feedinbox: Failed to submit intent response', error);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send';
            });
        });
    }

    function showIntentThanks(card) {
        card.innerHTML = '<div class="feedinbox-intent-thanks"><h3 class="feedinbox-intent-thanks-title">Thanks for the feedback</h3><p class="feedinbox-intent-thanks-text">It helps us improve.</p></div>';
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function escapeAttr(str) {
        return escapeHtml(str);
    }

    function renderWidget(API_URL, config, settings) {
        var PRIMARY_COLOR = settings.primaryColor;
        var POSITION = settings.position;
        var BORDER_RADIUS = settings.borderRadius;
        var HEADER_TEXT = settings.headerText;
        var SHOW_EMAIL = settings.showEmail;
        var TRIGGER_ICON = settings.triggerIcon;
        var HIDE_BRANDING = settings.hideBranding;

        // Position calculations
        var posRight = POSITION.indexOf('right') !== -1;
        var posBottom = POSITION.indexOf('bottom') !== -1;

        // Generate styles
        var styles = '.feedinbox-trigger{position:fixed;' + (posRight ? 'right:20px;' : 'left:20px;') + (posBottom ? 'bottom:20px;' : 'top:20px;') + 'width:48px;height:48px;border-radius:50%;background:' + PRIMARY_COLOR + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,0.12);transition:transform 0.2s,box-shadow 0.2s;z-index:999998}.feedinbox-trigger:hover{transform:scale(1.05);box-shadow:0 6px 16px rgba(0,0,0,0.2)}.feedinbox-trigger svg{width:20px;height:20px;stroke:white;fill:none}.feedinbox-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999999;opacity:0;visibility:hidden;transition:opacity 0.2s,visibility 0.2s}.feedinbox-overlay.open{opacity:1;visibility:visible}.feedinbox-modal{position:fixed;' + (posRight ? 'right:20px;' : 'left:20px;') + (posBottom ? 'bottom:90px;' : 'top:90px;') + 'width:360px;max-width:calc(100vw - 40px);background:white;border-radius:' + BORDER_RADIUS + 'px;box-shadow:0 12px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);transform:translateY(10px);opacity:0;visibility:hidden;transition:transform 0.2s,opacity 0.2s,visibility 0.2s;z-index:1000000;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.feedinbox-modal.open{transform:translateY(0);opacity:1;visibility:visible}.feedinbox-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e5e5e5}.feedinbox-title{font-size:16px;font-weight:600;color:#171717;margin:0}.feedinbox-close{background:none;border:none;cursor:pointer;padding:4px;color:#737373;display:flex;align-items:center;justify-content:center;border-radius:4px}.feedinbox-close:hover{background:#f5f5f5;color:#171717}.feedinbox-body{padding:20px}.feedinbox-form{display:flex;flex-direction:column;gap:16px}.feedinbox-field{display:flex;flex-direction:column;gap:6px}.feedinbox-label{font-size:14px;font-weight:500;color:#171717}.feedinbox-textarea{width:100%;min-height:100px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:' + Math.min(BORDER_RADIUS, 12) + 'px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,0.05)}.feedinbox-textarea:focus{outline:none;border-color:' + PRIMARY_COLOR + '}.feedinbox-select,.feedinbox-input{width:100%;padding:10px 12px;border:1px solid #e2e8f0;border-radius:' + Math.min(BORDER_RADIUS, 12) + 'px;font-size:14px;font-family:inherit;background:white;box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,0.05)}.feedinbox-select:focus,.feedinbox-input:focus{outline:none;border-color:' + PRIMARY_COLOR + '}.feedinbox-submit{width:100%;padding:12px;background:' + PRIMARY_COLOR + ';color:white;border:none;border-radius:' + Math.min(BORDER_RADIUS, 12) + 'px;font-size:14px;font-weight:500;cursor:pointer;transition:opacity 0.2s}.feedinbox-submit:hover{opacity:0.9}.feedinbox-submit:disabled{opacity:0.5;cursor:not-allowed}.feedinbox-footer{padding:12px 20px;border-top:1px solid #e5e5e5;text-align:center}.feedinbox-footer a{font-size:12px;color:#737373;text-decoration:none}.feedinbox-footer a:hover{color:#171717}.feedinbox-success{text-align:center;padding:40px 20px}.feedinbox-success-icon{width:48px;height:48px;background:#22c55e;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}.feedinbox-success-icon svg{width:24px;height:24px;stroke:white;fill:none}.feedinbox-success-title{font-size:18px;font-weight:600;color:#171717;margin:0 0 8px}.feedinbox-success-text{font-size:14px;color:#737373;margin:0}@media(prefers-color-scheme:dark){.feedinbox-modal{background:#171717}.feedinbox-header{border-color:#333}.feedinbox-title{color:#fafafa}.feedinbox-close{color:#a3a3a3}.feedinbox-close:hover{background:#262626;color:#fafafa}.feedinbox-label{color:#fafafa}.feedinbox-textarea,.feedinbox-select,.feedinbox-input{background:#262626;border-color:#404040;color:#fafafa}.feedinbox-footer{border-color:#333}.feedinbox-success-title{color:#fafafa}.feedinbox-footer a:hover{color:#fafafa}}html.dark .feedinbox-modal,html.dark .feedinbox-modal *{color-scheme:dark}html.dark .feedinbox-modal{background:#171717}html.dark .feedinbox-header{border-color:#333}html.dark .feedinbox-title{color:#fafafa}html.dark .feedinbox-close{color:#a3a3a3}html.dark .feedinbox-close:hover{background:#262626;color:#fafafa}html.dark .feedinbox-label{color:#fafafa}html.dark .feedinbox-textarea,html.dark .feedinbox-select,html.dark .feedinbox-input{background:#262626;border-color:#404040;color:#fafafa}html.dark .feedinbox-footer{border-color:#333}html.dark .feedinbox-success-title{color:#fafafa}html.dark .feedinbox-footer a:hover{color:#fafafa}html:not(.dark) .feedinbox-modal{background:white}html:not(.dark) .feedinbox-header{border-color:#e5e5e5}html:not(.dark) .feedinbox-title{color:#171717}html:not(.dark) .feedinbox-close{color:#737373}html:not(.dark) .feedinbox-close:hover{background:#f5f5f5;color:#171717}html:not(.dark) .feedinbox-label{color:#171717}html:not(.dark) .feedinbox-textarea,html:not(.dark) .feedinbox-select,html:not(.dark) .feedinbox-input{background:white;border-color:#e2e8f0;color:#171717}html:not(.dark) .feedinbox-footer{border-color:#e5e5e5}html:not(.dark) .feedinbox-success-title{color:#171717}html:not(.dark) .feedinbox-footer a:hover{color:#171717}';

        // Inject styles
        var styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        // Generate email field HTML
        var emailFieldHTML = SHOW_EMAIL ? '<div class="feedinbox-field"><label class="feedinbox-label" for="feedinbox-email">Email (optional)</label><input type="email" class="feedinbox-input" id="feedinbox-email" placeholder="your@email.com"></div>' : '';

        // Generate footer HTML
        var footerHTML = HIDE_BRANDING ? '' : '<div class="feedinbox-footer"><a href="https://feedinbox.com" target="_blank" rel="noopener">Powered by Feedinbox</a></div>';

        // Create widget container
        var container = document.createElement('div');
        container.id = 'feedinbox-widget';
        container.innerHTML = '<button class="feedinbox-trigger" aria-label="Send feedback"><svg viewBox="0 0 24 24" stroke-width="2">' + (TRIGGER_ICONS[TRIGGER_ICON] || TRIGGER_ICONS.chat) + '</svg></button><div class="feedinbox-overlay"></div><div class="feedinbox-modal" role="dialog" aria-modal="true"><div class="feedinbox-header"><h2 class="feedinbox-title">' + HEADER_TEXT + '</h2><button class="feedinbox-close" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div><div class="feedinbox-body"><form class="feedinbox-form" id="feedinbox-form"><div class="feedinbox-field"><label class="feedinbox-label" for="feedinbox-message">What\'s on your mind?</label><textarea class="feedinbox-textarea" id="feedinbox-message" placeholder="Share your feedback..." required></textarea></div><div class="feedinbox-field"><label class="feedinbox-label" for="feedinbox-category">Category</label><select class="feedinbox-select" id="feedinbox-category"><option value="general">General</option><option value="bug">Bug Report</option><option value="feature">Feature Request</option><option value="question">Question</option></select></div>' + emailFieldHTML + '<button type="submit" class="feedinbox-submit">Send Feedback</button></form></div>' + footerHTML + '</div>';
        document.body.appendChild(container);

        // Elements
        var trigger = container.querySelector('.feedinbox-trigger');
        var overlay = container.querySelector('.feedinbox-overlay');
        var modal = container.querySelector('.feedinbox-modal');
        var closeBtn = container.querySelector('.feedinbox-close');
        var body = container.querySelector('.feedinbox-body');

        var isOpen = false;

        function toggleModal(open) {
            isOpen = open;
            overlay.classList.toggle('open', open);
            modal.classList.toggle('open', open);
            if (open) {
                container.querySelector('#feedinbox-message').focus();
            }
        }

        trigger.addEventListener('click', function () { toggleModal(!isOpen); });
        overlay.addEventListener('click', function () { toggleModal(false); });
        closeBtn.addEventListener('click', function () { toggleModal(false); });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                toggleModal(false);
            }
        });

        function showSuccess() {
            body.innerHTML = '<div class="feedinbox-success"><div class="feedinbox-success-icon"><svg viewBox="0 0 24 24" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg></div><h3 class="feedinbox-success-title">Thank you!</h3><p class="feedinbox-success-text">Your feedback has been submitted.</p></div>';
        }

        function resetForm() {
            body.innerHTML = '<form class="feedinbox-form" id="feedinbox-form"><div class="feedinbox-field"><label class="feedinbox-label" for="feedinbox-message">What\'s on your mind?</label><textarea class="feedinbox-textarea" id="feedinbox-message" placeholder="Share your feedback..." required></textarea></div><div class="feedinbox-field"><label class="feedinbox-label" for="feedinbox-category">Category</label><select class="feedinbox-select" id="feedinbox-category"><option value="general">General</option><option value="bug">Bug Report</option><option value="feature">Feature Request</option><option value="question">Question</option></select></div>' + emailFieldHTML + '<button type="submit" class="feedinbox-submit">Send Feedback</button></form>';
            attachFormListener();
        }

        function attachFormListener() {
            var currentForm = container.querySelector('#feedinbox-form');
            if (currentForm) {
                currentForm.addEventListener('submit', handleSubmit);
            }
        }

        function handleSubmit(e) {
            e.preventDefault();
            var submitBtn = container.querySelector('.feedinbox-submit');
            var originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            var message = document.getElementById('feedinbox-message').value;
            var category = document.getElementById('feedinbox-category').value;
            var emailEl = document.getElementById('feedinbox-email');
            var email = emailEl ? emailEl.value : '';

            fetch(API_URL + '/api/widget/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectKey: config.projectKey,
                    message: message,
                    category: category,
                    userEmail: email || undefined,
                    pageUrl: window.location.href
                })
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Failed to submit');
                    showSuccess();
                    setTimeout(function () {
                        toggleModal(false);
                        setTimeout(resetForm, 300);
                    }, 2000);
                })
                .catch(function (error) {
                    console.error('Feedinbox: Failed to submit feedback', error);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    alert('Failed to submit feedback. Please try again.');
                });
        }

        attachFormListener();
    }

    // Capture any calls queued by the stub snippet before this script loaded
    var queued = (window.feedinbox && window.feedinbox.q) || [];

    // Public API: callable dispatcher, e.g. window.feedinbox('event', 'high_intent', {plan:'pro'})
    function feedinbox(command) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (command === 'event') {
            handleEvent(args[0], args[1]);
        } else if (command === 'init') {
            init(args[0]);
        }
    }
    feedinbox.init = init; // backward-compatible: window.feedinbox.init({...})
    window.feedinbox = feedinbox;

    // Replay queued calls (events fired before load are queued again until settings load)
    for (var qi = 0; qi < queued.length; qi++) {
        feedinbox.apply(null, queued[qi]);
    }

    // Auto-init: check for data-project-key on the script tag first (single-tag mode)
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('widget.js') !== -1) {
            var projectKey = scripts[i].getAttribute('data-project-key');
            if (projectKey) {
                init({ projectKey: projectKey });
                return;
            }
            break;
        }
    }

    // Fallback: auto-init from window.feedinboxConfig (two-tag mode, backward compatible)
    var autoConfig = window.feedinboxConfig;
    if (autoConfig) {
        init(autoConfig);
    }
})();
