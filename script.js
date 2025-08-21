document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const timeInput = document.getElementById('time-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const exampleBtns = document.querySelectorAll('.example-btn');
    const swapBtn = document.getElementById('swap-btn');

    // --- UI Text Elements ---
    const fromFormat = document.getElementById('from-format');
    const toFormat = document.getElementById('to-format');
    const subHeadingFrom = document.querySelector('.from-format-text');
    const subHeadingTo = document.querySelector('.to-format-text');

    // --- State ---
    let is24to12 = true;

    // --- Constants ---
    const COPY_MESSAGE_DURATION = 2000;
    const ICONS = {
        copy: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>'
    };

    // --- UI Update Logic ---
    function updateUI() {
        clearAll();
        if (is24to12) {
            fromFormat.textContent = '24-Hour';
            toFormat.textContent = '12-Hour';
            subHeadingFrom.textContent = '24-hour time';
            subHeadingTo.textContent = '12-hour AM/PM format';
            timeInput.placeholder = 'e.g., 18:30 or 1830';
            timeInput.maxLength = 5;
            updateExamples(['00:00', '12:00', '18:30', '23:59']);
        } else {
            fromFormat.textContent = '12-Hour';
            toFormat.textContent = '24-Hour';
            subHeadingFrom.textContent = '12-hour AM/PM time';
            subHeadingTo.textContent = '24-hour format';
            timeInput.placeholder = 'e.g., 6:30 PM or 0630pm';
            timeInput.maxLength = 10; // e.g., "12:00 AM"
            updateExamples(['12:00 AM', '12:00 PM', '6:30 PM', '11:59 PM']);
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
        timeInput.value = '';
        resultText.textContent = '';
        copyBtn.classList.add('hidden');
        errorMessage.textContent = '';
    }

    // --- Input Handling ---
    function handleInput(e) {
        const value = timeInput.value.toLowerCase();
        if (is24to12) {
            handle24hInput(e);
        } else {
            // Auto-convert when a valid-looking 12h time is entered
            if (value.length >= 4 && (value.includes('am') || value.includes('pm'))) {
                 handleConversion();
            }
        }
    }

    function handle24hInput(e) {
        const input = e.target;
        let value = input.value;
        const oldCursor = input.selectionStart;
        let targetCursor = oldCursor;

        // 1. Get raw digits
        const rawDigits = value.replace(/[^0-9]/g, '');
        const h = rawDigits.substring(0, 2);
        const m = rawDigits.substring(2, 4);

        let formattedValue = '';

        if (rawDigits.length > 0) {
            // Format Hours
            let hours = h;
            if (parseInt(h, 10) > 23) {
                hours = '23';
            }
            formattedValue += hours;

            // Add colon intelligently
            if (rawDigits.length > 2 || (rawDigits.length === 2 && oldCursor > 1)) {
                formattedValue += ':';
            }

            // Format Minutes
            if (rawDigits.length > 2) {
                let minutes = m;
                if (parseInt(m, 10) > 59) {
                    minutes = '59';
                }
                formattedValue += minutes;
            }
        }

        // 2. Update the input value and cursor position
        input.value = formattedValue;

        // Recalculate cursor position
        if (oldCursor === 2 && value.length < formattedValue.length) {
            // When colon is auto-added
            targetCursor = 3;
        } else if (oldCursor === 3 && value.length > formattedValue.length && value.charAt(2) === ':') {
            // When deleting the colon
            targetCursor = 2;
        } else {
            targetCursor = oldCursor + (formattedValue.length - value.length);
        }

        input.setSelectionRange(targetCursor, targetCursor);

        // 3. Trigger conversion if complete
        if (formattedValue.length === 5) {
            handleConversion();
        } else {
            displayResult('');
            clearError();
        }
    }


    // --- Core Conversion Logic ---
    function handleConversion() {
        const input = timeInput.value.trim();
        if (!input) return;

        const result = is24to12 ? convert24to12(input) : convert12to24(input);
        
        if (result.error) {
            showError(result.error);
            displayResult('');
        } else {
            clearError();
            displayResult(result.time);
        }
    }

    function convert24to12(time24) {
        const cleanedTime = time24.replace(/[^0-9]/g, '');
        let hours, minutes;

        if (cleanedTime.length <= 2) { // e.g., 18
            hours = parseInt(cleanedTime, 10);
            minutes = 0;
        } else { // e.g., 1830
            hours = parseInt(cleanedTime.slice(0, -2), 10);
            minutes = parseInt(cleanedTime.slice(-2), 10);
        }
        
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return { error: 'Invalid time. Use HH:MM format.' };
        }

        const period = hours >= 12 ? 'PM' : 'AM';
        let h12 = hours % 12;
        if (h12 === 0) h12 = 12;

        const minutesStr = String(minutes).padStart(2, '0');
        return { time: `${h12}:${minutesStr} ${period}` };
    }

    function convert12to24(time12) {
        const originalInput = time12.toLowerCase().replace(/\s+/g, '');
        const periodMatch = originalInput.match(/(am|pm)/);
        if (!periodMatch) return { error: 'Invalid time. Must include AM or PM.' };
        
        const period = periodMatch[0];
        let timePart = originalInput.replace(period, '');
        
        let hours, minutes;

        if (timePart.includes(':')) {
            [hours, minutes] = timePart.split(':');
        } else {
            if (timePart.length <= 2) { // e.g., 6pm
                hours = timePart;
                minutes = '0';
            } else { // e.g., 0630pm or 630pm
                hours = timePart.slice(0, -2);
                minutes = timePart.slice(-2);
            }
        }

        let h = parseInt(hours, 10);
        let m = minutes ? parseInt(minutes, 10) : 0;

        if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) {
            return { error: 'Invalid time. Check hours (1-12) and minutes (0-59).' };
        }

        if (period === 'am' && h === 12) { // Midnight case (12:xx AM -> 00:xx)
            h = 0;
        } else if (period === 'pm' && h < 12) { // Afternoon case (1:xx PM -> 13:xx)
            h += 12;
        }
        
        const hoursStr = String(h).padStart(2, '0');
        const minutesStr = String(m).padStart(2, '0');

        return { time: `${hoursStr}:${minutesStr}` };
    }

    function displayResult(text) {
        if (text) {
            resultText.textContent = text;
            copyBtn.classList.remove('hidden');
        } else {
            resultText.textContent = '';
            copyBtn.classList.add('hidden');
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    // --- Event Listeners ---
    swapBtn.addEventListener('click', () => {
        is24to12 = !is24to12;
        updateUI();
    });

    convertBtn.addEventListener('click', handleConversion);
    timeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleConversion();
        if (e.key === 'Escape') clearAll();
    });
    timeInput.addEventListener('input', handleInput);

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeInput.value = btn.dataset.time;
            handleConversion();
            timeInput.focus();
        });
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent).then(() => {
            copyBtn.innerHTML = `${ICONS.check} <span>Copied!</span>`;
            setTimeout(() => {
                copyBtn.innerHTML = `${ICONS.copy} <span>Copy</span>`;
            }, COPY_MESSAGE_DURATION);
        });
    });

    // --- Initial Load ---
    updateUI();

    // --- Print Button Logic ---
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});