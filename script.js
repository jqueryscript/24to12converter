
document.addEventListener('DOMContentLoaded', () => {
    // --- Page Type Detection ---
    const isMilitaryTimeConverter = window.location.pathname.includes('/military-time-converter/');
    const isTimeChart = window.location.pathname.includes('/time-chart/');

    // --- DOM Elements ---
    const timeInput = document.getElementById('time-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const swapBtn = document.getElementById('swap-btn');

    // --- UI Text Elements (may not exist on all pages) ---
    const fromFormat = document.getElementById('from-format');
    const toFormat = document.getElementById('to-format');
    const subHeadingFrom = document.querySelector('.from-format-text');
    const subHeadingTo = document.querySelector('.to-format-text');
    const exampleBtns = document.querySelectorAll('.example-btn');

    // Dynamic text follows the page language; unsupported locales use English.
    const UI_TEXT = {
        "en": {
            "f24": "24-Hour",
            "f12": "12-Hour",
            "sub24": "24-hour time",
            "sub12": "12-hour AM/PM time",
            "format12": "12-hour AM/PM format",
            "format24": "24-hour format",
            "example24": "e.g., 18:30 or 1830",
            "example12": "e.g., 6:30 PM or 0630pm",
            "militaryExample": "e.g., 1830 or 6:30 PM",
            "error24": "Invalid time. Use HH:MM format.",
            "errorAMPM": "Invalid time. Must include AM or PM.",
            "error12": "Invalid time. Check hours (1-12) and minutes (0-59).",
            "copy": "Copy",
            "copied": "Copied!",
            "copyFailed": "Could not copy. Select and copy the result manually."
        },
        "de": {
            "f24": "24-Stunden",
            "f12": "12-Stunden",
            "sub24": "24-Stunden-Zeit",
            "sub12": "12-Stunden-Zeit mit AM/PM",
            "format12": "12-Stunden-AM/PM-Format",
            "format24": "24-Stunden-Format",
            "example24": "z. B. 18:30 oder 1830",
            "example12": "z. B. 6:30 PM oder 0630pm",
            "militaryExample": "z. B. 1830 oder 6:30 PM",
            "error24": "Ungültige Uhrzeit. Verwenden Sie das Format HH:MM.",
            "errorAMPM": "Ungültige Uhrzeit. Geben Sie AM oder PM an.",
            "error12": "Ungültige Uhrzeit. Prüfen Sie Stunden (1-12) und Minuten (0-59).",
            "copy": "Kopieren",
            "copied": "Kopiert!",
            "copyFailed": "Kopieren nicht möglich. Markieren und kopieren Sie das Ergebnis manuell."
        },
        "es": {
            "f24": "24 Horas",
            "f12": "12 Horas",
            "sub24": "24 horas",
            "sub12": "12 horas con AM/PM",
            "format12": "12 horas AM/PM",
            "format24": "24 horas",
            "example24": "p. ej., 18:30 o 1830",
            "example12": "p. ej., 6:30 PM o 0630pm",
            "militaryExample": "p. ej., 1830 o 6:30 PM",
            "error24": "Hora no válida. Usa el formato HH:MM.",
            "errorAMPM": "Hora no válida. Incluye AM o PM.",
            "error12": "Hora no válida. Comprueba las horas (1-12) y los minutos (0-59).",
            "copy": "Copiar",
            "copied": "¡Copiado!",
            "copyFailed": "No se pudo copiar. Selecciona y copia el resultado manualmente."
        },
        "fr": {
            "f24": "24H",
            "f12": "12H",
            "sub24": "l’heure 24h",
            "sub12": "l’heure 12h avec AM/PM",
            "format12": "12h AM/PM",
            "format24": "24h",
            "example24": "p. ex., 18:30 ou 1830",
            "example12": "p. ex., 6:30 PM ou 0630pm",
            "militaryExample": "p. ex., 1830 ou 6:30 PM",
            "error24": "Heure non valide. Utilisez le format HH:MM.",
            "errorAMPM": "Heure non valide. Indiquez AM ou PM.",
            "error12": "Heure non valide. Vérifiez les heures (1-12) et les minutes (0-59).",
            "copy": "Copier",
            "copied": "Copié !",
            "copyFailed": "La copie a échoué. Sélectionnez et copiez le résultat manuellement."
        },
        "pt": {
            "f24": "24 Horas",
            "f12": "12 Horas",
            "sub24": "hora de 24 horas",
            "sub12": "hora de 12 horas com AM/PM",
            "format12": "formato AM/PM de 12 horas",
            "format24": "formato de 24 horas",
            "example24": "ex.: 18:30 ou 1830",
            "example12": "ex.: 6:30 PM ou 0630pm",
            "militaryExample": "ex.: 1830 ou 6:30 PM",
            "error24": "Horário inválido. Use o formato HH:MM.",
            "errorAMPM": "Horário inválido. Inclua AM ou PM.",
            "error12": "Horário inválido. Confira as horas (1-12) e os minutos (0-59).",
            "copy": "Copiar",
            "copied": "Copiado!",
            "copyFailed": "Não foi possível copiar. Selecione e copie o resultado manualmente."
        },
        "it": {
            "f24": "24 Ore",
            "f12": "12 Ore",
            "sub24": "24 ore",
            "sub12": "12 ore con AM/PM",
            "format12": "12 ore AM/PM",
            "format24": "24 ore",
            "example24": "es. 18:30 o 1830",
            "example12": "es. 6:30 PM o 0630pm",
            "militaryExample": "es. 1830 o 6:30 PM",
            "error24": "Orario non valido. Usa il formato HH:MM.",
            "errorAMPM": "Orario non valido. Includi AM o PM.",
            "error12": "Orario non valido. Controlla le ore (1-12) e i minuti (0-59).",
            "copy": "Copia",
            "copied": "Copiato!",
            "copyFailed": "Copia non riuscita. Seleziona e copia il risultato manualmente."
        },
        "ja": {
            "f24": "24時間",
            "f12": "12時間",
            "sub24": "24時間形式",
            "sub12": "AM/PM付きの12時間形式",
            "format12": "12時間AM/PM形式",
            "format24": "24時間形式",
            "example24": "例: 18:30 または 1830",
            "example12": "例: 6:30 PM または 0630pm",
            "militaryExample": "例: 1830 または 6:30 PM",
            "error24": "時刻が正しくありません。HH:MM形式で入力してください。",
            "errorAMPM": "時刻が正しくありません。AMまたはPMを付けてください。",
            "error12": "時刻が正しくありません。時は1～12、分は0～59で入力してください。",
            "copy": "コピー",
            "copied": "コピーしました",
            "copyFailed": "コピーできませんでした。結果を選択して手動でコピーしてください。"
        },
        "ko": {
            "f24": "24시간",
            "f12": "12시간",
            "sub24": "24시간 형식",
            "sub12": "AM/PM이 있는 12시간 형식",
            "format12": "12시간 AM/PM 형식",
            "format24": "24시간 형식",
            "example24": "예: 18:30 또는 1830",
            "example12": "예: 6:30 PM 또는 0630pm",
            "militaryExample": "예: 1830 또는 6:30 PM",
            "error24": "올바른 시간이 아닙니다. HH:MM 형식으로 입력하세요.",
            "errorAMPM": "올바른 시간이 아닙니다. AM 또는 PM을 포함하세요.",
            "error12": "올바른 시간이 아닙니다. 시간(1~12)과 분(0~59)을 확인하세요.",
            "copy": "복사",
            "copied": "복사됨",
            "copyFailed": "복사하지 못했습니다. 결과를 선택하여 직접 복사하세요."
        },
        "zh-tw": {
            "f24": "24小時制",
            "f12": "12小時制",
            "sub24": "24小時制時間",
            "sub12": "含AM/PM的12小時制時間",
            "format12": "12小時制上午/下午格式",
            "format24": "24小時制格式",
            "example24": "例如：18:30 或 1830",
            "example12": "例如：6:30 PM 或 0630pm",
            "militaryExample": "例如：1830 或 6:30 PM",
            "error24": "時間無效，請使用 HH:MM 格式。",
            "errorAMPM": "時間無效，請加上 AM 或 PM。",
            "error12": "時間無效，請確認小時為 1 至 12、分鐘為 0 至 59。",
            "copy": "複製",
            "copied": "已複製",
            "copyFailed": "無法複製，請選取結果後手動複製。"
        }
    };
    const pageLanguage = (document.documentElement.lang || 'en').toLowerCase();
    const language = pageLanguage === 'zh-tw' || pageLanguage === 'zh-hant'
        ? 'zh-tw' : pageLanguage.split('-')[0];
    const ui = Object.prototype.hasOwnProperty.call(UI_TEXT, language) ? UI_TEXT[language] : UI_TEXT.en;
    let copyFeedbackTimer;
    let copyRequestId = 0;

    // Count user actions only; analytics failures must never affect the tool.
    let userConversion = false;
    let lastConversion = '';
    let copiedResult = '';
    function trackAction(name) {
        try {
            if (typeof window.gtag === 'function') window.gtag('event', name, {
                tool: 'time_converter', language: language
            });
        } catch (_) { /* The converter also works without analytics. */ }
    }
    if (timeInput) {
        ['input', 'paste', 'keydown'].forEach(name => timeInput.addEventListener(name, event => {
            if (event.isTrusted) userConversion = true;
        }, true));
    }
    [convertBtn, ...exampleBtns].filter(Boolean).forEach(button => {
        button.addEventListener('click', event => { if (event.isTrusted) userConversion = true; }, true);
    });

    // --- State ---
    let is24to12 = true;

    // --- Constants ---
    const COPY_MESSAGE_DURATION = 2000;
    const ICONS = {
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`
    };

    // --- Military Time Converter Specific Logic ---
    function handleMilitaryTimeInput() {
        const value = timeInput.value.trim();
        if (!value) { displayResult(''); clearError(); return; }
        if (/^\d{4}$/.test(value) || /^\d{1,2}\s*:\s*\d{2}$/.test(value) || /(am|pm)$/i.test(value)) {
            handleConversion();
        } else if (/^\d{1,4}\s*[ap]?$/i.test(value) || /^\d{1,2}\s*:\s*\d{0,2}\s*[ap]?$/i.test(value)) {
            displayResult('');
            clearError();
        } else {
            displayResult('');
            showError(ui.error24);
        }
    }

    function handleMilitaryTimeKeyDown(e) {
        const key = e.key;
        const isAllowedCharacter = key.length === 1 && /[0-9apmAPM:\s]/.test(key);
        const isAllowedControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab', 'Enter'].includes(key);
        const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key.toLowerCase());

        if (!isAllowedCharacter && !isAllowedControlKey && !isShortcut) {
            e.preventDefault();
        }

    }

    // --- UI Update Logic ---
    function updateUI() {
        clearAll();
        // Remove all previous input listeners
        timeInput.removeEventListener('keydown', handle24hKeyDown);
        timeInput.removeEventListener('input', handle24hInputFormat);
        timeInput.removeEventListener('input', handle12hInput);

        if (is24to12) {
            if (fromFormat) fromFormat.textContent = ui.f24;
            if (toFormat) toFormat.textContent = ui.f12;
            if (subHeadingFrom) subHeadingFrom.textContent = ui.sub24;
            if (subHeadingTo) subHeadingTo.textContent = ui.format12;
            timeInput.placeholder = ui.example24;
            timeInput.maxLength = 32;
            if (exampleBtns.length > 0) updateExamples(['00:00', '12:00', '18:30', '23:59']);
            // Add listeners for 24h mode
            timeInput.addEventListener('keydown', handle24hKeyDown);
            timeInput.addEventListener('input', handle24hInputFormat);
        } else {
            if (fromFormat) fromFormat.textContent = ui.f12;
            if (toFormat) toFormat.textContent = ui.f24;
            if (subHeadingFrom) subHeadingFrom.textContent = ui.sub12;
            if (subHeadingTo) subHeadingTo.textContent = ui.format24;
            timeInput.placeholder = ui.example12;
            timeInput.maxLength = 32;
            if (exampleBtns.length > 0) updateExamples(['12:00 AM', '12:00 PM', '6:30 PM', '11:59 PM']);
            // Add listener for 12h mode
            timeInput.addEventListener('input', handle12hInput);
        }
        timeInput.focus();
    }

    function updateExamples(times) {
        exampleBtns.forEach((btn, index) => {
            if (times[index]) {
                btn.textContent = times[index];
                btn.dataset.time = times[index];
            }
        });
    }

    function clearAll() {
        lastConversion = '';
        copiedResult = '';
        userConversion = false;
        copyRequestId++;
        resetCopyButton();
        timeInput.value = '';
        resultText.textContent = '';
        copyBtn.classList.add('hidden');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // --- Input Handling ---
    function handle24hKeyDown(e) {
        const key = e.key;
        const isDigit = /[0-9]/.test(key);
        const isColon = key === ':' || (key.length === 1 && /\s/.test(key));
        const isAllowedControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab', 'Enter'].includes(key);
        const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key.toLowerCase());

        if (isDigit || isColon || isAllowedControlKey || isShortcut) {
            return; // Allow the event
        }
        
        e.preventDefault(); // Block all other keys
    }

    // Format complete valid shapes; retain invalid text so validation can reject it.
    function handle24hInputFormat() {
        const input = timeInput;
        const value = input.value.trim();
        if (!value) { displayResult(''); clearError(); return; }
        const complete = value.match(/^(\d{1,2})\s*:\s*(\d{2})$/);
        if (/^\d{4}$/.test(value)) {
            input.value = `${value.slice(0, 2)}:${value.slice(2)}`;
            handleConversion();
        } else if (complete) {
            input.value = `${complete[1]}:${complete[2]}`;
            handleConversion();
        } else if (/^\d{1,3}$/.test(value) || /^\d{1,2}\s*:\s*\d{0,1}$/.test(value)) {
            displayResult('');
            clearError();
        } else {
            displayResult('');
            showError(ui.error24);
        }
    }

    function handle12hInput() {
        const value = timeInput.value.trim();
        if (!value) { displayResult(''); clearError(); return; }
        if (/(am|pm)/i.test(value)) {
            handleConversion();
        } else {
            displayResult('');
            clearError();
        }
    }

    // --- Core Conversion Logic ---
    function handleConversion() {
        const input = timeInput.value.trim();
        if (!input) { displayResult(''); clearError(); return; }

        let result;
        if (isMilitaryTimeConverter) {
            // Military page detects direction from the input.
            const lowerInput = input.toLowerCase();
            result = lowerInput.includes('am') || lowerInput.includes('pm')
                ? convert12to24(input)
                : convert24to12(input);
        } else {
            // Main converter can swap between modes
            result = is24to12 ? convert24to12(input) : convert12to24(input);
        }

        if (result.error) {
            showError(result.error);
            displayResult('');
        } else {
            clearError();
            displayResult(result.time);
            const signature = `${is24to12}:${result.time}`;
            if (userConversion && signature !== lastConversion) {
                trackAction('conversion_success');
                lastConversion = signature;
            }
            userConversion = false;
        }
    }

    function parseClockParts(value) {
        const colon = value.match(/^(\d{1,2})\s*:\s*(\d{2})$/);
        if (colon) return [Number(colon[1]), Number(colon[2])];
        if (!/^\d{1,4}$/.test(value)) return null;
        return value.length <= 2 ? [Number(value), 0]
            : [Number(value.slice(0, -2)), Number(value.slice(-2))];
    }

    function convert24to12(time24) {
        const parts = parseClockParts(time24.trim());
        if (!parts || parts[0] > 23 || parts[1] > 59) return { error: ui.error24 };
        const [hours, minutes] = parts;
        const period = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        return { time: `${h12}:${String(minutes).padStart(2, '0')} ${period}` };
    }

    function convert12to24(time12) {
        const value = time12.trim();
        const periodMatch = value.match(/(am|pm)$/i);
        if (!periodMatch) return { error: /(am|pm)/i.test(value) ? ui.error12 : ui.errorAMPM };
        const parts = parseClockParts(value.slice(0, periodMatch.index).trim());
        if (!parts || parts[0] < 1 || parts[0] > 12 || parts[1] > 59) return { error: ui.error12 };
        let [hours, minutes] = parts;
        const period = periodMatch[1].toLowerCase();
        if (period === 'am' && hours === 12) hours = 0;
        else if (period === 'pm' && hours < 12) hours += 12;
        return { time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` };
    }

    function displayResult(text) {
        if (resultText && resultText.textContent !== text) copiedResult = '';
        if (!text) lastConversion = '';
        copyRequestId++;
        resetCopyButton();
        if (text) {
            resultText.textContent = text;
            copyBtn.classList.remove('hidden');
        } else {
            resultText.textContent = '';
            copyBtn.classList.add('hidden');
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function clearError() {
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // --- Event Listeners ---
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            is24to12 = !is24to12;
            updateUI();
        });
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', handleConversion);
    }
    if (timeInput) {
        timeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleConversion();
            }
            if (e.key === 'Escape') clearAll();
        });
    }

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (timeInput) {
                timeInput.value = btn.dataset.time;
                handleConversion();
                timeInput.focus();
            }
        });
    });

    function resetCopyButton() {
        clearTimeout(copyFeedbackTimer);
        if (copyBtn) copyBtn.innerHTML = `${ICONS.copy} <span>${ui.copy}</span>`;
    }

    resetCopyButton();
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!resultText || !resultText.textContent) return;
            resetCopyButton();
            const requestId = ++copyRequestId;
            const text = resultText.textContent;
            Promise.resolve().then(() => navigator.clipboard.writeText(text)).then(() => {
                if (requestId !== copyRequestId) return;
                if (copiedResult !== text) { trackAction('copy_result'); copiedResult = text; }
                clearError();
                copyBtn.innerHTML = `${ICONS.check} <span>${ui.copied}</span>`;
                copyFeedbackTimer = setTimeout(resetCopyButton, COPY_MESSAGE_DURATION);
            }).catch(() => {
                if (requestId !== copyRequestId) return;
                resetCopyButton();
                showError(ui.copyFailed);
            });
        });
    }

    if (timeInput) {
        timeInput.addEventListener('paste', (event) => {
            const text = event.clipboardData && event.clipboardData.getData('text');
            if (!text) return;
            event.preventDefault();
            const start = timeInput.selectionStart ?? timeInput.value.length;
            const end = timeInput.selectionEnd ?? start;
            timeInput.value = timeInput.value.slice(0, start) + text + timeInput.value.slice(end);
            if (isMilitaryTimeConverter) handleMilitaryTimeInput();
            else if (is24to12) handle24hInputFormat();
            else handle12hInput();
        });
    }

    // --- Initial Load ---
    if (isMilitaryTimeConverter) {
        // Military Time Converter: Set up specific listeners for 4-digit military time input
        if (timeInput) {
            timeInput.addEventListener('keydown', handleMilitaryTimeKeyDown);
            timeInput.addEventListener('input', handleMilitaryTimeInput);
            timeInput.placeholder = ui.militaryExample;
            timeInput.maxLength = 32;
        }
    } else if (fromFormat || toFormat || subHeadingFrom || subHeadingTo) {
        // Main converter page: Full UI with swap functionality
        updateUI(); // This will set up the initial listeners
    } else if (timeInput) {
        // Other pages with basic time input
        timeInput.addEventListener('keydown', handle24hKeyDown);
        timeInput.addEventListener('input', handle24hInputFormat);
    }

    // --- Print Button Logic ---
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
