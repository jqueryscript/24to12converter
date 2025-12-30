const fs = require('fs');
const path = require('path');

// 读取主页作为模板
const template = fs.readFileSync('index.html', 'utf8');

// 基础配置
const baseUrl = 'https://www.24to12converter.com';
const outputDir = path.join(__dirname, 'time');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 辅助函数：将 24 小时制转换为 12 小时制对象
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
    
    // 格式化分钟
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

// 辅助函数：生成解释文本
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

// 生成 00:00 到 23:00 的页面
console.log('Starting page generation...');

for (let h = 0; h < 24; h++) {
    const timeData = convertTime(h, 0);
    const { time24, time12 } = timeData;
    
    // 目录名，例如 "15-00"
    const dirName = time24.replace(':', '-');
    const pageDir = path.join(outputDir, dirName);
    
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir);
    }

    // 上一个和下一个小时用于导航
    const prevHour = h === 0 ? 23 : h - 1;
    const nextHour = h === 23 ? 0 : h + 1;
    const prevTime = convertTime(prevHour, 0);
    const nextTime = convertTime(nextHour, 0);
    const prevLink = `/time/${prevTime.time24.replace(':', '-')}/`;
    const nextLink = `/time/${nextTime.time24.replace(':', '-')}/`;

    // --- 开始替换模板内容 ---
    let pageContent = template;

    // 1. 替换 Meta Tags
    const pageTitle = `What is ${time24} Military Time? Convert to ${time12}`;
    const pageDesc = `Instant conversion: ${time24} military time is exactly ${time12}. See the calculation, math, and full time chart explanation here.`;
    
    pageContent = pageContent.replace(/<title>.*<\/title>/, `<title>${pageTitle}</title>`);
    pageContent = pageContent.replace(/content="The best tool to instantly convert.*?"/, `content="${pageDesc}"`);
    pageContent = pageContent.replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${baseUrl}/time/${dirName}/"`);
    
    // OG Tags
    pageContent = pageContent.replace(/property="og:url" content=".*?"/, `property="og:url" content="${baseUrl}/time/${dirName}/"`);
    pageContent = pageContent.replace(/property="og:title" content=".*?"/, `property="og:title" content="${pageTitle}"`);
    pageContent = pageContent.replace(/property="og:description" content=".*?"/, `property="og:description" content="${pageDesc}"`);
    
    // Twitter Tags
    pageContent = pageContent.replace(/property="twitter:url" content=".*?"/, `property="twitter:url" content="${baseUrl}/time/${dirName}/"`);
    pageContent = pageContent.replace(/property="twitter:title" content=".*?"/, `property="twitter:title" content="${pageTitle}"`);
    pageContent = pageContent.replace(/property="twitter:description" content=".*?"/, `property="twitter:description" content="${pageDesc}"`);

    // 2. 替换 Main Content
    // 我们需要保留 Header 和 Footer，但替换 <main> 里面的主要部分
    // 策略：找到 "Converter Section" 的开始和 "Features Section" 的开始，替换中间的内容
    
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

    // 找到原始 HTML 中的关键节点
    const mainStart = pageContent.indexOf('<main>');
    const featuresStart = pageContent.indexOf('<!-- Features Section -->');
    const changelogStart = pageContent.indexOf('<!-- Changelog Section -->');
    const mainEnd = pageContent.indexOf('</main>');
    
    if (mainStart !== -1 && featuresStart !== -1 && changelogStart !== -1 && mainEnd !== -1) {
        // 1. Header 到 Main 开始
        const headerPart = pageContent.substring(0, mainStart + 6);
        
        // 2. Features 到 Changelog 之前 (包含 Features, How To Use, Use Cases, FAQ, Chart)
        // 注意：这部分位于新 Hero 内容之后
        const middlePart = pageContent.substring(featuresStart, changelogStart);
        
        // 3. Main 结束及 Footer (跳过 Changelog)
        const footerPart = pageContent.substring(mainEnd);
        
        // 组合新页面
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

    // 修正资源路径：因为我们在 /time/HH-MM/ 目录下，所以资源引用需要回退两级
    // 替换 CSS, JS, Favicon 等
    pageContent = pageContent.replace(/href="\.\/dist\/app\.css/g, 'href="../../dist/app.css');
    pageContent = pageContent.replace(/href="\/favicon/g, 'href="/favicon'); // 绝对路径不用动
    pageContent = pageContent.replace(/src="script\.js/g, 'src="../../script.js');
    
    // 写入文件
    const filePath = path.join(pageDir, 'index.html');
    fs.writeFileSync(filePath, pageContent);
    console.log(`Generated: ${dirName}/index.html`);
}

console.log('All pages generated successfully!');
