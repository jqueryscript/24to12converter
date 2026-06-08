const fs = require('fs');
const path = require('path');


const template = fs.readFileSync('index.html', 'utf8');


const baseUrl = 'https://www.24to12converter.com';
const outputDir = path.join(__dirname, 'time');


if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}


function convertTime(hour, minute) {
    let period = 'AM';
    let displayHour = hour;

    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            displayHour = hour - 12;
        }
    }
    if (hour === 0) {
        displayHour = 12;
    }


    const minuteStr = minute.toString().padStart(2, '0');
    const time24 = `${hour.toString().padStart(2, '0')}:${minuteStr}`;
    const time12 = `${displayHour}:${minuteStr} ${period}`;

    return {
        hour24: hour,
        minute: minuteStr,
        time24: time24,
        hour12: displayHour,
        period: period,
        time12: time12
    };
}


function getExplanation(timeData) {
    const { hour24, time24, time12, hour12, period } = timeData;

    if (hour24 === 0) {
        return `<strong>${time24}</strong> is the start of the day in military time. To convert to standard time, we replace 00 with 12 and add AM. Therefore, ${time24} equals <strong>${time12}</strong> (Midnight).`;
    } else if (hour24 < 12) {
        return `Since <strong>${hour24}</strong> is less than 12, the hour remains the same in standard time, we just add AM. Therefore, <strong>${time24}</strong> is simply <strong>${time12}</strong>.`;
    } else if (hour24 === 12) {
        return `<strong>${time24}</strong> is the middle of the day. In standard 12-hour time, 12:00 converts to <strong>12:00 PM</strong> (Noon). The hour stays the same, but it marks the switch from AM to PM.`;
    } else {
        return `Since <strong>${hour24}</strong> is greater than 12, we subtract 12 from the hour to convert to standard time.<br><br>Calculation: <strong>${hour24} - 12 = ${hour12}</strong>.<br><br>So, <strong>${time24}</strong> in military time is <strong>${time12}</strong>.`;
    }
}


console.log('Starting page generation for 15-minute intervals...');

const intervals = [0, 15, 30, 45];
const allTimePoints = [];

for (let h = 0; h < 24; h++) {
    for (let m of intervals) {
        allTimePoints.push({ h, m });
    }
}

allTimePoints.forEach((point, index) => {
    const { h, m } = point;
    const timeData = convertTime(h, m);
    const { time24, time12 } = timeData;


    const dirName = time24.replace(':', '-');
    const pageDir = path.join(outputDir, dirName);

    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir);
    }


    const prevIndex = index === 0 ? allTimePoints.length - 1 : index - 1;
    const nextIndex = index === allTimePoints.length - 1 ? 0 : index + 1;

    const prevPoint = allTimePoints[prevIndex];
    const nextPoint = allTimePoints[nextIndex];

    const prevTime = convertTime(prevPoint.h, prevPoint.m);
    const nextTime = convertTime(nextPoint.h, nextPoint.m);

    const prevLink = `/time/${prevTime.time24.replace(':', '-')}/`;
    const nextLink = `/time/${nextTime.time24.replace(':', '-')}/`;


    let pageContent = template;


    const pageTitle = `What is ${time24} Military Time? Convert to ${time12}`;
    const pageDesc = `Instant conversion: ${time24} military time is exactly ${time12}. See the calculation, math, and full time chart explanation here.`;

    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${pageTitle}</title>`);
    pageContent = pageContent.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${pageDesc}">`);
    pageContent = pageContent.replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${baseUrl}/time/${dirName}/"`);

    // OG Tags
    pageContent = pageContent.replace(/property="og:url" content=".*?"/, `property="og:url" content="${baseUrl}/time/${dirName}/"`);
    pageContent = pageContent.replace(/property="og:title" content=".*?"/, `property="og:title" content="${pageTitle}"`);
    pageContent = pageContent.replace(/property="og:description" content=".*?"/, `property="og:description" content="${pageDesc}"`);

    // Twitter Tags
    pageContent = pageContent.replace(/property="twitter:url" content=".*?"/, `property="twitter:url" content="${baseUrl}/time/${dirName}/"`);
    pageContent = pageContent.replace(/property="twitter:title" content=".*?"/, `property="twitter:title" content="${pageTitle}"`);
    pageContent = pageContent.replace(/property="twitter:description" content=".*?"/, `property="twitter:description" content="${pageDesc}"`);

    // Replace the main converter area while preserving shared sections.

    const explanation = getExplanation(timeData);

    const newMainContent = `
        <!-- Hero Result Section -->
        <div class="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
            <div class="container mx-auto px-4">
                <section aria-labelledby="time-heading" class="max-w-3xl mx-auto text-center">
                    <h1 id="time-heading" class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        What is <span class="text-blue-600">${time24}</span> in Military Time?
                    </h1>

                    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-blue-100 my-10 relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <p class="text-lg text-slate-500 font-medium mb-4 uppercase tracking-wider">Standard 12-Hour Time</p>
                        <p class="text-6xl md:text-8xl font-black text-blue-600 tracking-tight">${time12}</p>
                    </div>

                    <div class="prose prose-lg mx-auto text-slate-600 leading-relaxed">
                        <p class="text-xl">${explanation}</p>
                    </div>

                    <!-- Quick Nav -->
                    <div class="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-slate-100">
                        <a href="${prevLink}" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            ${prevTime.time24}
                        </a>
                        <span class="text-slate-300">|</span>
                        <a href="${baseUrl}" class="inline-flex items-center px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                            Use Custom Converter
                        </a>
                        <span class="text-slate-300">|</span>
                        <a href="${nextLink}" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium">
                            ${nextTime.time24}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    `;

    const mainStart = pageContent.indexOf('<main>');
    const featuresStart = pageContent.indexOf('<!-- Features Section -->');
    const changelogStart = pageContent.indexOf('<!-- Changelog Section -->');
    const mainEnd = pageContent.indexOf('</main>');

    if (mainStart !== -1 && featuresStart !== -1 && changelogStart !== -1 && mainEnd !== -1) {
        const headerPart = pageContent.substring(0, mainStart + 6);
        
        const middlePart = pageContent.substring(featuresStart, changelogStart);
        
        const footerPart = pageContent.substring(mainEnd);
        
        pageContent = headerPart + newMainContent + middlePart + footerPart;
    } else {
        console.warn('Could not find all section markers in index.html. Checking fallback...');
        // Fallback if changelog marker is missing (though it should be there)
        if (mainStart !== -1 && featuresStart !== -1) {
             const beforeMain = pageContent.substring(0, mainStart + 6);
             const afterFeatures = pageContent.substring(featuresStart);
             pageContent = beforeMain + newMainContent + afterFeatures;
        }
    }

    // Fix asset paths from /time/HH-MM/ pages.
    pageContent = pageContent.replace(/href="\.\/dist\/app\.css/g, 'href="../../dist/app.css');
    pageContent = pageContent.replace(/href="\/favicon/g, 'href="/favicon');
    pageContent = pageContent.replace(/src="script\.js/g, 'src="../../script.js');
    pageContent = pageContent.replace(/href="time\/(\d{2}-\d{2})\//g, 'href="../$1/');

    const filePath = path.join(pageDir, 'index.html');
    fs.writeFileSync(filePath, pageContent);
    console.log(`Generated: ${dirName}/index.html`);
});

console.log('All pages generated successfully!');
