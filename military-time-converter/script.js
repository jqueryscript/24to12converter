document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const timeInput = document.getElementById('time-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const swapBtn = document.getElementById('swap-btn');

    // --- State ---
    let isMilitaryToStandard = true;

    // --- Constants ---
    const COPY_MESSAGE_DURATION = 2000;
    const ICONS = {
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
    };

    // --- UI Update Logic ---
    function updateUI() {
        clearAll();
        
        if (isMilitaryToStandard) {
            timeInput.placeholder = 'e.g., 1830 or 1830hrs';
            timeInput.maxLength = 6;
        } else {
            timeInput.placeholder = 'e.g., 6:30 PM or 6:30pm';
            timeInput.maxLength = 10;
        }
        timeInput.focus();
    }

    function clearAll() {
        timeInput.value = '';
        resultText.textContent = '';
        copyBtn.classList.add('hidden');
    }

    // --- Input Handling ---
    function handleMilitaryInput() {
        const value = timeInput.value.toUpperCase();
        // Allow only digits and optional 'HRS' at the end
        const cleanedValue = value.replace(/[^0-9HRS]/gi, '');
        
        if (cleanedValue !== value) {
            timeInput.value = cleanedValue;
        }
        
        // Auto-convert when we have 4 digits
        if (cleanedValue.replace(/[^0-9]/g, '').length === 4) {
            handleConversion();
        }
    }

    function handleStandardInput() {
        const value = timeInput.value.toLowerCase();
        if (value.length >= 4 && (value.includes('am') || value.includes('pm'))) {
            handleConversion();
        }
    }

    // --- Core Conversion Logic ---
    function handleConversion() {
        const input = timeInput.value.trim();
        if (!input) return;

        const result = isMilitaryToStandard ? convertMilitaryToStandard(input) : convertStandardToMilitary(input);
        
        if (result.error) {
            displayResult('');
        } else {
            displayResult(result.time);
        }
    }

    function convertMilitaryToStandard(militaryTime) {
        // Remove 'HRS' if present and extract digits
        const digits = militaryTime.replace(/[^0-9]/g, '');
        
        if (digits.length !== 4) {
            return { error: 'Military time must be 4 digits (e.g., 1830)' };
        }

        const hours = parseInt(digits.substring(0, 2), 10);
        const minutes = parseInt(digits.substring(2), 10);
        
        if (hours > 23 || minutes > 59) {
            return { error: 'Invalid military time' };
        }

        const period = hours >= 12 ? 'PM' : 'AM';
        let h12 = hours % 12;
        if (h12 === 0) h12 = 12;

        const minutesStr = String(minutes).padStart(2, '0');
        return { time: `${h12}:${minutesStr} ${period}` };
    }

    function convertStandardToMilitary(standardTime) {
        const originalInput = standardTime.toLowerCase().replace(/\s+/g, '');
        const periodMatch = originalInput.match(/(am|pm)/);
        if (!periodMatch) return { error: 'Must include AM or PM' };
        
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
            return { error: 'Invalid time format' };
        }

        if (period === 'am' && h === 12) { 
            h = 0;
        } else if (period === 'pm' && h < 12) { 
            h += 12;
        }
        
        const hoursStr = String(h).padStart(2, '0');
        const minutesStr = String(m).padStart(2, '0');

        return { time: `${hoursStr}${minutesStr}` };
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

    // --- Event Listeners ---
    swapBtn.addEventListener('click', () => {
        isMilitaryToStandard = !isMilitaryToStandard;
        updateUI();
    });

    convertBtn.addEventListener('click', handleConversion);
    
    timeInput.addEventListener('input', () => {
        if (isMilitaryToStandard) {
            handleMilitaryInput();
        } else {
            handleStandardInput();
        }
    });

    timeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConversion();
        }
        if (e.key === 'Escape') clearAll();
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent).then(() => {
            copyBtn.innerHTML = `${ICONS.check} <span>Copied!</span>`;
            setTimeout(() => {
                copyBtn.innerHTML = `${ICONS.copy} <span>Copy</span>`;
            }, COPY_MESSAGE_DURATION);
        });
    });

    // --- Print Chart Functionality ---
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            
            // Get the chart table
            const chartTable = document.querySelector('#chart table');
            
            if (chartTable) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Military Time Conversion Chart</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                padding: 20px; 
                                color: #1e293b;
                            }
                            h1 { 
                                text-align: center; 
                                margin-bottom: 30px; 
                                color: #1e293b;
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                                margin: 0 auto;
                            }
                            th, td { 
                                border: 1px solid #cbd5e1; 
                                padding: 12px; 
                                text-align: left; 
                            }
                            th { 
                                background-color: #f1f5f9; 
                                font-weight: bold; 
                                text-transform: uppercase;
                                font-size: 12px;
                            }
                            td { 
                                font-size: 14px; 
                            }
                            tr:nth-child(even) { 
                                background-color: #f8fafc; 
                            }
                            .font-medium { 
                                font-weight: 500; 
                                color: #1e293b; 
                            }
                            @media print {
                                body { margin: 0; }
                                table { page-break-inside: auto; }
                                tr { page-break-inside: avoid; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Military Time Conversion Chart</h1>
                        ${chartTable.outerHTML}
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                printWindow.focus();
                
                // Wait for content to load then print
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            }
        });
    }

    // --- Initial Load ---
    updateUI();

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});