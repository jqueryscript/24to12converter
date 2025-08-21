document.addEventListener('DOMContentLoaded', () => {
    const timeInput = document.getElementById('time-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const exampleBtns = document.querySelectorAll('.example-btn');

    const MAX_INPUT_LENGTH = 5;
    const COPY_MESSAGE_DURATION = 2000;

    const icons = {
        copy: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>'
    };

    // --- Robust Input Masking v9 --- 

    function handleKeydown(e) {
        const input = e.target;
        const key = e.key;
        const hasSelection = input.selectionStart !== input.selectionEnd;

        // Allow control keys (e.g., Arrow keys, Backspace, Tab, Enter) and selection-based replacement
        if (key.length > 1 || hasSelection) {
            if (key === 'Enter') {
                handleConversion();
            }
            return;
        }

        // Allow digits
        if (/[0-9]/.test(key)) {
            return;
        }

        // Allow a single colon if not already present
        if (key === ':' && !input.value.includes(':')) {
            return;
        }

        // Prevent everything else
        e.preventDefault();
    }

    function handleInput(e) {
        const input = e.target;
        let value = input.value;
        let oldCursorPosition = input.selectionStart;

        // 1. Clean the input: keep only digits
        let digits = value.replace(/[^0-9]/g, '');

        let formattedValue = '';
        let newCursorPosition = oldCursorPosition;

        // 2. Format based on number of digits
        if (digits.length > 0) {
            // Hours
            formattedValue += digits.substring(0, 2);
            if (parseInt(formattedValue, 10) > 23) {
                formattedValue = '23';
            }

            // Auto-insert colon if 2 hours digits are typed
            if (digits.length >= 2) {
                formattedValue += ':';
                // Adjust cursor position if colon is inserted
                if (oldCursorPosition === 2 && value.length === 2) {
                    newCursorPosition++;
                }
            }

            // Minutes
            if (digits.length > 2) {
                let minutes = digits.substring(2, 4);
                if (parseInt(minutes, 10) > 59) {
                    minutes = '59';
                }
                formattedValue += minutes;
            }
        }

        // 3. Limit total length
        if (formattedValue.length > MAX_INPUT_LENGTH) {
            formattedValue = formattedValue.slice(0, MAX_INPUT_LENGTH);
        }

        input.value = formattedValue;

        // Restore cursor position
        if (input.setSelectionRange) {
            // Adjust cursor position for deletions
            if (value.length > formattedValue.length && oldCursorPosition > formattedValue.length) {
                newCursorPosition = formattedValue.length;
            } else if (value.length > formattedValue.length && oldCursorPosition <= formattedValue.length) {
                // Cursor was before the deleted character, keep it there
                newCursorPosition = oldCursorPosition;
            } else if (value.length < formattedValue.length && oldCursorPosition === value.length) {
                // Character added at end, move cursor to end
                newCursorPosition = formattedValue.length;
            } else if (value.length < formattedValue.length && oldCursorPosition < value.length) {
                // Character added in middle, move cursor past it
                newCursorPosition = oldCursorPosition + (formattedValue.length - value.length);
            } else {
                newCursorPosition = oldCursorPosition;
            }

            // Ensure cursor position is not out of bounds
            newCursorPosition = Math.min(newCursorPosition, formattedValue.length);
            newCursorPosition = Math.max(0, newCursorPosition);

            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }

        // Trigger conversion if complete
        if (formattedValue.length === MAX_INPUT_LENGTH) {
            handleConversion();
        } else {
            displayResult(''); // Clear result if input is incomplete
            clearError();
        }
    }

    timeInput.addEventListener('keydown', handleKeydown);
    timeInput.addEventListener('input', handleInput);

    // Shortcut: Clear input with Escape key
    timeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            timeInput.value = '';
            resultText.textContent = '';
            copyBtn.classList.add('hidden');
            errorMessage.textContent = ''; // Also clear any error messages
        }
    });

    // --- Core Conversion Logic ---
    function convertTime(time24) {
        const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!regex.test(time24)) {
            showError('Invalid time. Use HH:MM format.');
            return null;
        }

        clearError();
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours, 10);
        const period = h >= 12 ? 'PM' : 'AM';
        let h12 = h % 12;
        if (h12 === 0) {
            h12 = 12;
        }

        return `${h12}:${minutes} ${period}`;
    }

    function displayResult(time12) {
        if (time12) {
            resultText.textContent = time12;
            copyBtn.classList.remove('hidden');
        } else {
            resultText.textContent = '';
            copyBtn.classList.add('hidden');
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        resultText.textContent = '';
        copyBtn.classList.add('hidden');
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    function handleConversion() {
        const time12 = convertTime(timeInput.value);
        displayResult(time12);
    }

    // --- Event Listeners ---
    convertBtn.addEventListener('click', handleConversion);

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time24 = btn.dataset.time;
            timeInput.value = time24;
            handleConversion();
            timeInput.focus();
        });
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent).then(() => {
            copyBtn.innerHTML = `${icons.check} <span>Copied!</span>`;
            setTimeout(() => {
                copyBtn.innerHTML = `${icons.copy} <span>Copy</span>`;
            }, COPY_MESSAGE_DURATION);
        });
    });

    // --- Initial Load ---
    timeInput.focus();
});