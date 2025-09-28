
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
        const input = timeInput;
        const originalValue = input.value;

        // Only allow digits
        let digits = originalValue.replace(/[^0-9]/g, '');

        // Limit to 4 digits
        if (digits.length > 4) {
            digits = digits.substring(0, 4);
        }

        // Validate hours if we have at least 2 digits
        if (digits.length >= 2) {
            let hours = parseInt(digits.substring(0, 2), 10);
            if (hours > 23) {
                digits = '23' + digits.substring(2);
            }
        }

        // Validate minutes if we have exactly 4 digits
        if (digits.length === 4) {
            let minutes = parseInt(digits.substring(2, 4), 10);
            if (minutes > 59) {
                digits = digits.substring(0, 2) + '59';
            }
        }

        input.value = digits;

        // Auto-convert when we have exactly 4 digits
        if (digits.length === 4) {
            setTimeout(() => {
                handleConversion();
            }, 100); // Small delay to ensure the input value is updated
        }
    }

    function handleMilitaryTimeKeyDown(e) {
        const key = e.key;
        const isDigit = /[0-9]/.test(key);
        const isAllowedControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key);
        const isPaste = (e.ctrlKey || e.metaKey) && key === 'v';

        if (!isDigit && !isAllowedControlKey && !isPaste) {
            e.preventDefault();
        }

        // Allow replacement if text is selected
        const selection = window.getSelection();
        const selectedText = selection.toString();
        const hasSelection = selectedText.length > 0;

        // Prevent input if we already have 4 digits and no text is selected
        if (timeInput.value.length >= 4 && isDigit && !hasSelection) {
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
            if (fromFormat) fromFormat.textContent = '24-Hour';
            if (toFormat) toFormat.textContent = '12-Hour';
            if (subHeadingFrom) subHeadingFrom.textContent = '24-hour time';
            if (subHeadingTo) subHeadingTo.textContent = '12-hour AM/PM format';
            timeInput.placeholder = 'e.g., 18:30 or 1830';
            timeInput.maxLength = 5;
            if (exampleBtns.length > 0) updateExamples(['00:00', '12:00', '18:30', '23:59']);
            // Add listeners for 24h mode
            timeInput.addEventListener('keydown', handle24hKeyDown);
            timeInput.addEventListener('input', handle24hInputFormat);
        } else {
            if (fromFormat) fromFormat.textContent = '12-Hour';
            if (toFormat) toFormat.textContent = '24-Hour';
            if (subHeadingFrom) subHeadingFrom.textContent = '12-hour AM/PM time';
            if (subHeadingTo) subHeadingTo.textContent = '24-hour format';
            timeInput.placeholder = 'e.g., 6:30 PM or 0630pm';
            timeInput.maxLength = 10;
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
        timeInput.value = '';
        resultText.textContent = '';
        copyBtn.classList.add('hidden');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // --- Input Handling: The Robust Solution ---

    // 1. Keydown Listener: Acts as a guard, only allowing valid characters.
    function handle24hKeyDown(e) {
        const key = e.key;
        const isDigit = /[0-9]/.test(key);
        const isAllowedControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key);
        const isPaste = (e.ctrlKey || e.metaKey) && key === 'v';

        if (isDigit || isAllowedControlKey || isPaste) {
            return; // Allow the event
        }
        
        e.preventDefault(); // Block all other keys
    }

    // 2. Input Listener: Formats the input value AFTER the browser has handled the keypress.
    function handle24hInputFormat() {
        const input = timeInput;
        const originalValue = input.value;
        const originalCursor = input.selectionStart;

        let digits = originalValue.replace(/[^0-9]/g, '');

        if (digits.length > 4) {
            digits = digits.substring(0, 4);
        }

        // Only validate and format when we have complete or nearly complete input
        if (digits.length >= 2) {
            let hours = parseInt(digits.substring(0, 2), 10);
            if (hours > 23) {
                digits = '23' + digits.substring(2);
            }
        }

        // Only validate and format when we have exactly 4 digits (complete time)
        if (digits.length === 4) {
            let hours = parseInt(digits.substring(0, 2), 10);
            let minutes = parseInt(digits.substring(2), 10);
            
            // Validate hours (00-23)
            if (hours > 23) {
                hours = 23;
            }
            
            // Validate minutes (00-59)
            if (minutes > 59) {
                minutes = 59;
            }
            
            // Format with leading zeros
            const hoursStr = String(hours).padStart(2, '0');
            const minutesStr = String(minutes).padStart(2, '0');
            
            digits = hoursStr + minutesStr;
        }

        let formattedValue = digits;
        // Only add colon when we have exactly 4 digits (complete time)
        if (digits.length === 4) {
            formattedValue = `${digits.substring(0, 2)}:${digits.substring(2)}`;
        }

        if (originalValue !== formattedValue) {
            input.value = formattedValue;
            // Adjust cursor position if a colon was added or removed
            const newCursor = originalCursor + (formattedValue.length - originalValue.length);
            input.setSelectionRange(newCursor, newCursor);
        }

        if (input.value.length === 5) {
            handleConversion();
        } else {
            displayResult('');
            clearError();
        }
    }

    function handle12hInput() {
        const value = timeInput.value.toLowerCase();
        if (value.length >= 4 && (value.includes('am') || value.includes('pm'))) {
            handleConversion();
        }
    }

    // --- Core Conversion Logic ---
    function handleConversion() {
        const input = timeInput.value.trim();
        if (!input) return;

        let result;
        if (isMilitaryTimeConverter) {
            // Military Time Converter always converts 24h to 12h
            result = convert24to12(input);
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
        }
    }

    function convert24to12(time24) {
        const cleanedTime = time24.replace(/[^0-9]/g, '');
        let hours, minutes;

        if (cleanedTime.length <= 2) {
            hours = parseInt(cleanedTime, 10);
            minutes = 0;
        } else {
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
            if (timePart.length <= 2) {
                hours = timePart;
                minutes = '0';
            } else {
                hours = timePart.slice(0, -2);
                minutes = timePart.slice(-2);
            }
        }

        let h = parseInt(hours, 10);
        let m = minutes ? parseInt(minutes, 10) : 0;

        if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) {
            return { error: 'Invalid time. Check hours (1-12) and minutes (0-59).' };
        }

        if (period === 'am' && h === 12) { 
            h = 0;
        } else if (period === 'pm' && h < 12) { 
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

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (resultText) {
                navigator.clipboard.writeText(resultText.textContent).then(() => {
                    copyBtn.innerHTML = `${ICONS.check} <span>Copied!</span>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = `${ICONS.copy} <span>Copy</span>`;
                    }, COPY_MESSAGE_DURATION);
                });
            }
        });
    }

    // --- Initial Load ---
    if (isMilitaryTimeConverter) {
        // Military Time Converter: Set up specific listeners for 4-digit military time input
        if (timeInput) {
            timeInput.addEventListener('keydown', handleMilitaryTimeKeyDown);
            timeInput.addEventListener('input', handleMilitaryTimeInput);
            timeInput.placeholder = 'e.g., 1830';
            timeInput.maxLength = 4;
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
