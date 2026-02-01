const fs = require('fs');
const path = require('path');

// === 配置区域 ===
const baseUrl = 'https://www.24to12converter.com';
const outputDirBase = __dirname; // 项目根目录

// 语言配置
const languages = [
    { code: 'en', prefix: '', template: 'index.html' },
    { code: 'de', prefix: 'de', template: 'de/index.html' },
    { code: 'es', prefix: 'es', template: 'es/index.html' },
    { code: 'fr', prefix: 'fr', template: 'fr/index.html' },
    { code: 'pt', prefix: 'pt', template: 'pt/index.html' },
    { code: 'it', prefix: 'it', template: 'it/index.html' },
    { code: 'ja', prefix: 'ja', template: 'ja/index.html' },
    { code: 'ko', prefix: 'ko', template: 'ko/index.html' },
    { code: 'zh-tw', prefix: 'zh-tw', template: 'zh-tw/index.html' }
];

// 翻译字典
const translations = {
    en: {
        titleStr: "What is {time24} Military Time? Convert to {time12}",
        descStr: "Instant conversion: {time24} military time is exactly {time12}. See the calculation, math, and full time chart explanation here.",
        h1Str: "What is <span class='text-blue-600'>{time24}</span> in Military Time?",
        labelStr: "Standard 12-Hour Time",
        navBack: "Use Custom Converter",
        expl: (h24, t24, t12, h12, p) => {
            if (h24 === 0) return `<strong>${t24}</strong> is the start of the day. It converts to <strong>${t12}</strong> (Midnight).`;
            if (h24 < 12) return `Since <strong>${h24}</strong> is less than 12, the hour stays the same. <strong>${t24}</strong> is <strong>${t12}</strong>.`;
            if (h24 === 12) return `<strong>${t24}</strong> is the middle of the day. It converts to <strong>${t12}</strong> (Noon).`;
            return `Subtract 12 from the hour: <strong>${h24} - 12 = ${h12}</strong>. So <strong>${t24}</strong> is <strong>${t12}</strong>.`;
        }
    },
    de: {
        titleStr: "Wieviel Uhr ist {time24} Militärzeit? In {time12} umrechnen",
        descStr: "Sofortige Umrechnung: {time24} Militärzeit ist genau {time12}. Sehen Sie hier die Berechnung und die vollständige Zeittabelle.",
        h1Str: "Wieviel Uhr ist <span class='text-blue-600'>{time24}</span>?",
        labelStr: "Standard 12-Stunden-Zeit",
        navBack: "Benutzerdefinierten Konverter verwenden",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> ist der Tagesbeginn. Es entspricht <strong>${t12}</strong> (Mitternacht).`;
             if (h24 < 12) return `Da <strong>${h24}</strong> kleiner als 12 ist, bleibt die Stunde gleich. <strong>${t24}</strong> ist <strong>${t12}</strong>.`;
             if (h24 === 12) return `<strong>${t24}</strong> ist Mittag. Es entspricht <strong>${t12}</strong> (Mittag).`;
             return `Ziehen Sie 12 von der Stunde ab: <strong>${h24} - 12 = ${h12}</strong>. Also ist <strong>${t24}</strong> gleich <strong>${t12}</strong>.`;
        }
    },
    es: {
        titleStr: "¿Qué hora es {time24} en tiempo militar? Convertir a {time12}",
        descStr: "Conversión instantánea: {time24} en tiempo militar es exactamente {time12}. Vea el cálculo y la tabla horaria completa aquí.",
        h1Str: "¿Qué hora es <span class='text-blue-600'>{time24}</span> en Tiempo Militar?",
        labelStr: "Hora Estándar de 12 Horas",
        navBack: "Usar Convertidor Personalizado",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> es el comienzo del día. Equivale a <strong>${t12}</strong> (Medianoche).`;
             if (h24 < 12) return `Como <strong>${h24}</strong> es menor que 12, la hora se mantiene. <strong>${t24}</strong> es <strong>${t12}</strong>.`;
             if (h24 === 12) return `<strong>${t24}</strong> es el mediodía. Equivale a <strong>${t12}</strong>.`;
             return `Resta 12 a la hora: <strong>${h24} - 12 = ${h12}</strong>. Así que <strong>${t24}</strong> son las <strong>${t12}</strong>.`;
        }
    },
    fr: {
        titleStr: "Quelle heure est-il {time24} en heure militaire ? Convertir en {time12}",
        descStr: "Conversion instantanée : {time24} correspond exactement à {time12}. Voir le calcul et le tableau complet ici.",
        h1Str: "Quelle heure est-il <span class='text-blue-600'>{time24}</span> ?",
        labelStr: "Format 12 Heures Standard",
        navBack: "Utiliser le Convertisseur Personnalisé",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> est le début de la journée. Cela correspond à <strong>${t12}</strong> (Minuit).`;
             if (h24 < 12) return `Comme <strong>${h24}</strong> est inférieur à 12, l'heure reste la même. <strong>${t24}</strong> est <strong>${t12}</strong>.`;
             if (h24 === 12) return `<strong>${t24}</strong> est le milieu de la journée. Cela correspond à <strong>${t12}</strong> (Midi).`;
             return `Soustrayez 12 de l'heure : <strong>${h24} - 12 = ${h12}</strong>. Donc <strong>${t24}</strong> est <strong>${t12}</strong>.`;
        }
    },
    pt: {
        titleStr: "Que horas são {time24} no horário militar? Converter para {time12}",
        descStr: "Conversão instantânea: {time24} é exatamente {time12}. Veja o cálculo e a tabela completa aqui.",
        h1Str: "Que horas são <span class='text-blue-600'>{time24}</span> no Horário Militar?",
        labelStr: "Horário Padrão de 12 Horas",
        navBack: "Usar Conversor Personalizado",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> é o início do dia. Corresponde a <strong>${t12}</strong> (Meia-noite).`;
             if (h24 < 12) return `Como <strong>${h24}</strong> é menor que 12, a hora permanece a mesma. <strong>${t24}</strong> é <strong>${t12}</strong>.`;
             if (h24 === 12) return `<strong>${t24}</strong> é meio-dia. Corresponde a <strong>${t12}</strong>.`;
             return `Subtraia 12 da hora: <strong>${h24} - 12 = ${h12}</strong>. Portanto, <strong>${t24}</strong> são <strong>${t12}</strong>.`;
        }
    },
    it: {
        titleStr: "Che ore sono {time24} nel formato militare? Converti in {time12}",
        descStr: "Conversione istantanea: le {time24} corrispondono esattamente alle {time12}. Vedi il calcolo e la tabella completa qui.",
        h1Str: "Che ore sono le <span class='text-blue-600'>{time24}</span>?",
        labelStr: "Formato Standard 12 Ore",
        navBack: "Usa Convertitore Personalizzato",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> è l'inizio della giornata. Corrisponde alle <strong>${t12}</strong> (Mezzanotte).`;
             if (h24 < 12) return `Poiché <strong>${h24}</strong> è minore di 12, l'ora rimane la stessa. Le <strong>${t24}</strong> sono le <strong>${t12}</strong>.`;
             if (h24 === 12) return `Le <strong>${t24}</strong> sono mezzogiorno. Corrisponde alle <strong>${t12}</strong>.`;
             return `Sottrai 12 dall'ora: <strong>${h24} - 12 = ${h12}</strong>. Quindi le <strong>${t24}</strong> sono le <strong>${t12}</strong>.`;
        }
    },
    ja: {
        titleStr: "軍事時間の{time24}は何時ですか？ {time12}に変換",
        descStr: "即時変換：24時間表記の{time24}は、12時間表記の{time12}です。計算方法と完全な対応表はこちら。",
        h1Str: "24時間表記の<span class='text-blue-600'>{time24}</span>は何時？",
        labelStr: "12時間表記（午前/午後）",
        navBack: "カスタム変換ツールを使用",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong>は一日の始まりです。これは<strong>${t12}</strong>（深夜0時）に相当します。`;
             if (h24 < 12) return `<strong>${h24}</strong>は12より小さいため、時間はそのままです。<strong>${t24}</strong>は<strong>${t12}</strong>です。`;
             if (h24 === 12) return `<strong>${t24}</strong>は正午です。これは<strong>${t12}</strong>（お昼の12時）に相当します。`;
             return `時間から12を引きます： <strong>${h24} - 12 = ${h12}</strong>。したがって、<strong>${t24}</strong>は<strong>${t12}</strong>です。`;
        }
    },
    ko: {
        titleStr: "24시간제 {time24}는 몇 시입니까? {time12}로 변환",
        descStr: "즉시 변환 : 24시간제의 {time24}는 12시간제의 {time12}입니다. 계산 방법 및 전체 시간표는 여기를 참조하세요.",
        h1Str: "24시간제 <span class='text-blue-600'>{time24}</span>는 몇 시입니까?",
        labelStr: "12시간제 표준 시간",
        navBack: "사용자 지정 변환기 사용",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong>은 하루의 시작입니다. <strong>${t12}</strong>(자정)에 해당합니다.`;
             if (h24 < 12) return `<strong>${h24}</strong>은 12보다 작으므로 시간은 그대로 유지됩니다. <strong>${t24}</strong>는 <strong>${t12}</strong>입니다.`;
             if (h24 === 12) return `<strong>${t24}</strong>는 정오입니다. <strong>${t12}</strong>에 해당합니다.`;
             return `시간에서 12를 뺍니다: <strong>${h24} - 12 = ${h12}</strong>. 따라서 <strong>${t24}</strong>는 <strong>${t12}</strong>입니다.`;
        }
    },
    'zh-tw': {
        titleStr: "24小時制的 {time24} 是什麼時間？轉換為 {time12}",
        descStr: "即時轉換：24小時制的 {time24} 正是 {time12}。在此查看計算邏輯和完整時間對照表。",
        h1Str: "24小時制的 <span class='text-blue-600'>{time24}</span> 是什麼時間？",
        labelStr: "12小時制標準時間",
        navBack: "使用自定義轉換器",
        expl: (h24, t24, t12, h12, p) => {
             if (h24 === 0) return `<strong>${t24}</strong> 是一天的開始。它對應於 <strong>${t12}</strong> (午夜)。`;
             if (h24 < 12) return `因為 <strong>${h24}</strong> 小於 12，所以小時數保持不變。<strong>${t24}</strong> 就是 <strong>${t12}</strong>。`;
             if (h24 === 12) return `<strong>${t24}</strong> 是中午。它對應於 <strong>${t12}</strong>。`;
             return `將小時數減去 12：<strong>${h24} - 12 = ${h12}</strong>。所以 <strong>${t24}</strong> 就是 <strong>${t12}</strong>。`;
        }
    }
};

// 辅助函数：转换时间
function convertTime(hour, minute) {
    let period = 'AM';
    let displayHour = hour;
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) displayHour = hour - 12;
    }
    if (hour === 0) displayHour = 12;
    
    const minuteStr = minute.toString().padStart(2, '0');
    const time24 = `${hour.toString().padStart(2, '0')}:${minuteStr}`;
    const time12 = `${displayHour}:${minuteStr} ${period}`;
    
    return { hour24: hour, minute: minuteStr, time24, hour12: displayHour, period, time12 };
}

// 主逻辑
console.log('Starting multilingual page generation...');

languages.forEach(lang => {
    console.log(`Processing language: ${lang.code}...`);
    
    // 读取该语言的模板
    const templatePath = path.join(outputDirBase, lang.template);
    if (!fs.existsSync(templatePath)) {
        console.error(`Template not found: ${templatePath}`);
        return;
    }
    let template = fs.readFileSync(templatePath, 'utf8');

    // 确定该语言的输出基础目录
    // en -> /time/
    // de -> /de/time/
    const langBaseDir = lang.prefix ? path.join(outputDirBase, lang.prefix, 'time') : path.join(outputDirBase, 'time');
    
    if (!fs.existsSync(langBaseDir)) {
        fs.mkdirSync(langBaseDir, { recursive: true });
    }

    const t = translations[lang.code] || translations.en;

    // 生成 00:00 到 23:45 的页面
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
        const { time24, time12, hour24, hour12, period } = timeData;
        const dirName = time24.replace(':', '-'); // "15-00"
        
        const pageDir = path.join(langBaseDir, dirName);
        if (!fs.existsSync(pageDir)) {
            fs.mkdirSync(pageDir, { recursive: true });
        }

        // 准备替换内容
        const title = t.titleStr.replace(/{time24}/g, time24).replace(/{time12}/g, time12);
        const desc = t.descStr.replace(/{time24}/g, time24).replace(/{time12}/g, time12);
        const h1 = t.h1Str.replace(/{time24}/g, time24);
        const explanation = t.expl(hour24, time24, time12, hour12, period);
        
        // 导航链接
        const prevIndex = index === 0 ? allTimePoints.length - 1 : index - 1;
        const nextIndex = index === allTimePoints.length - 1 ? 0 : index + 1;
        const prevPoint = allTimePoints[prevIndex];
        const nextPoint = allTimePoints[nextIndex];
        const prevT = convertTime(prevPoint.h, prevPoint.m).time24;
        const nextT = convertTime(nextPoint.h, nextPoint.m).time24;
        
        // 注意 URL 路径:
        // 当前页面是 /{lang}/time/{current}/
        // 链接到 /{lang}/time/{prev}/
        const prevLink = `../${prevT.replace(':', '-')}/`;
        const nextLink = `../${nextT.replace(':', '-')}/`;
        // 回主页链接: /{lang}/ -> ../../
        const homeLink = '../../'; 

        // === 核心替换逻辑 ===
        let content = template;

        // 1. Meta Tags
        content = content.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
        content = content.replace(/content="[^ vital]*24.*convert.*"/i, `content="${desc}"`); // 模糊匹配原 description
        // 尝试匹配特定的 og:title 等，如果没有找到就可能保留了原样，这取决于模板的一致性
        // 为了稳健，我们使用更宽泛的正则或者假设模板结构标准
        content = content.replace(/property="og:title" content=".*?"/, `property="og:title" content="${title}"`);
        content = content.replace(/property="og:description" content=".*?"/, `property="og:description" content="${desc}"`);
        content = content.replace(/property="twitter:title" content=".*?"/, `property="twitter:title" content="${title}"`);
        content = content.replace(/property="twitter:description" content=".*?"/, `property="twitter:description" content="${desc}"`);

        // 2. Canonical & Hreflang (最重要!)
        // 当前页面的规范 URL
        const currentUrlPath = lang.prefix ? `${lang.prefix}/time/${dirName}/` : `time/${dirName}/`;
        const canonicalUrl = `${baseUrl}/${currentUrlPath}`;
        content = content.replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${canonicalUrl}"`);

        // 重写 hreflang
        // 我们需要构建一个包含所有语言对应页面的 hreflang 块
        let hreflangBlock = '';
        languages.forEach(l => {
            const lPath = l.prefix ? `${l.prefix}/time/${dirName}/` : `time/${dirName}/`;
            const lUrl = `${baseUrl}/${lPath}`;
            hreflangBlock += `    <link rel="alternate" hreflang="${l.code}" href="${lUrl}" />\n`;
        });
        hreflangBlock += `    <link rel="alternate" hreflang="x-default" href="${baseUrl}/time/${dirName}/" />`;
        
        // 替换现有的 hreflang 块 (假设它们是连续的)
        // 使用正则找到第一个 hreflang 到最后一个 x-default
        // 这种替换比较冒险，建议使用标记或者替换整个 <head> 的一部分。
        // 但鉴于我们知道模板结构，我们可以找到 <!--hreflang tags --> 注释
        if (content.includes('<!-- hreflang tags -->')) {
            const startMarker = '<!-- hreflang tags -->';
            const endMarker = '<!-- Schema.org Markup -->'; // 下一个块通常是 Schema
            const startIndex = content.indexOf(startMarker);
            const endIndex = content.indexOf(endMarker);
            if (startIndex !== -1 && endIndex !== -1) {
                const before = content.substring(0, startIndex + startMarker.length);
                const after = content.substring(endIndex);
                content = before + '\n' + hreflangBlock + '\n    ' + after;
            }
        }

        // 3. 内容注入
        // 使用之前的逻辑：替换 Main Content，移除 Changelog
        const newMainContent = `
        <!-- Hero Result Section -->
        <div class="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
            <div class="container mx-auto px-4">
                <section aria-labelledby="time-heading" class="max-w-3xl mx-auto text-center">
                    <h1 id="time-heading" class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        ${h1}
                    </h1>
                    
                    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-blue-100 my-10 relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <p class="text-lg text-slate-500 font-medium mb-4 uppercase tracking-wider">${t.labelStr}</p>
                        <p class="text-6xl md:text-8xl font-black text-blue-600 tracking-tight">${time12}</p>
                    </div>

                    <div class="prose prose-lg mx-auto text-slate-600 leading-relaxed">
                        <p class="text-xl">${explanation}</p>
                    </div>

                    <!-- Quick Nav -->
                    <div class="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-slate-100">
                        <a href="${prevLink}" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            ${prevT}
                        </a>
                        <span class="text-slate-300">|</span>
                        <a href="${homeLink}" class="inline-flex items-center px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                            ${t.navBack}
                        </a>
                        <span class="text-slate-300">|</span>
                        <a href="${nextLink}" class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium">
                            ${nextT}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2"><path d="m12 5 7 7-7 7"/><path d="M5 12h14"/></svg>
                        </a>
                    </div>
                </section>
            </div>
        </div>
        `;

        const mainStart = content.indexOf('<main>');
        const featuresStart = content.indexOf('<!-- Features Section -->');
        const changelogStart = content.indexOf('<!-- Changelog Section -->');
        const mainEnd = content.indexOf('</main>');

        // 尝试构建页面
        // 优先使用 changelogStart 剔除日志，如果没有则保留 features 后所有内容
        if (mainStart !== -1 && featuresStart !== -1) {
             const beforeMain = content.substring(0, mainStart + 6);
             let middlePart = '';
             let footerPart = '';

             if (changelogStart !== -1 && mainEnd !== -1) {
                 // 有 Changelog，剔除它
                 middlePart = content.substring(featuresStart, changelogStart);
                 footerPart = content.substring(mainEnd);
             } else {
                 // 没有 Changelog 标记，保留 features 后所有
                 middlePart = content.substring(featuresStart);
                 // footerPart 包含在 middlePart 里了，或者我们需要在这里截断？
                 // 不，如果直接取 substring(featuresStart)，它会包含 </main> 及其后的 footer
                 // 所以这里直接拼接即可
                 content = beforeMain + newMainContent + middlePart;
                 // 修正资源路径
                 // 路径深度：
                 // en: /time/15-00/ -> depth 2 (../../)
                 // de: /de/time/15-00/ -> depth 3 (../../../)
                 const depth = lang.prefix ? 3 : 2;
                 const prefix = '../'.repeat(depth);
                 
                 content = content.replace(/href="\.\/dist\/app\.css/g, `href="${prefix}dist/app.css`);
                 content = content.replace(/href="\.\.\/dist\/app\.css/g, `href="${prefix}dist/app.css`); // 防止重复替换
                 content = content.replace(/src="script\.js/g, `src="${prefix}script.js`);
                 content = content.replace(/src="\.\.\/script\.js/g, `src="${prefix}script.js`);

                 fs.writeFileSync(path.join(pageDir, 'index.html'), content);
                 return; 
             }
             
             content = beforeMain + newMainContent + middlePart + footerPart;
        } else {
            console.error(`Structure markers not found in ${lang.code} template.`);
            return;
        }

        // 修正资源路径
        const depth = lang.prefix ? 3 : 2;
        const prefix = '../'.repeat(depth);
        
        // 处理 CSS/JS 路径 (兼容 ./ 和 ../ 开头的情况)
        content = content.replace(/href="(\.\/|\.\.\/)dist\/app\.css/g, `href="${prefix}dist/app.css`);
        content = content.replace(/src="(\.\/|\.\.\/)script\.js/g, `src="${prefix}script.js`);

        fs.writeFileSync(path.join(pageDir, 'index.html'), content);
    });
});

console.log('All multilingual pages generated.');
