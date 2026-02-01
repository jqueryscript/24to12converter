const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 1. Helper to convert time
function convertTime(h, m) {
    let period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const t24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const t12 = `${h12}:${m.toString().padStart(2, '0')} ${period}`;
    return { t24, t12 };
}

// 2. Generator for Homepage Chart (00, 15, 30, 45)
function generateHomeChartHtml() {
    let html = '';
    for (let h = 0; h < 24; h++) {
        const v00 = convertTime(h, 0);
        const v15 = convertTime(h, 15);
        const v30 = convertTime(h, 30);
        const v45 = convertTime(h, 45);

        html += `                                <tr class="border-b border-slate-200 hover:bg-slate-50">
                                    <td class="px-6 py-4 font-medium text-slate-900">${v00.t24}</td>
                                    <td class="px-6 py-4">${v00.t12}</td>
                                    <td class="px-6 py-4 font-medium text-slate-900">${v15.t24}</td>
                                    <td class="px-6 py-4">${v15.t12}</td>
                                </tr>
                                <tr class="border-b border-slate-200 hover:bg-slate-50">
                                    <td class="px-6 py-4 font-medium text-slate-900">${v30.t24}</td>
                                    <td class="px-6 py-4">${v30.t12}</td>
                                    <td class="px-6 py-4 font-medium text-slate-900">${v45.t24}</td>
                                    <td class="px-6 py-4">${v45.t12}</td>
                                </tr>\n`;
    }
    return html;
}

// 3. Generator for Detailed Time Chart (00, 10, 15, 20, 30, 40, 45, 50)
function generateDetailedChartHtml() {
    let html = '';
    const mins = [0, 10, 15, 20, 30, 40, 45, 50];
    for (let h = 0; h < 12; h++) {
        for (let m of mins) {
            const left = convertTime(h, m);
            const right = convertTime(h + 12, m);
            html += `<tr class="border-b border-slate-200 hover:bg-slate-50">
<td class="px-6 py-4 font-medium text-slate-900">${left.t24}</td>
<td class="px-6 py-4">${left.t12}</td>
<td class="px-6 py-4 font-medium text-slate-900">${right.t24}</td>
<td class="px-6 py-4">${right.t12}</td>
</tr>\n`;
        }
    }
    return html;
}

// 4. Main Process
async function run() {
    const homeFiles = glob.sync('**/index.html', { ignore: ['time/**', 'time-chart/**', 'node_modules/**'] });
    const chartFiles = glob.sync('**/time-chart/index.html', { ignore: ['node_modules/**'] });

    console.log('Updating Homepage charts...');
    const homeHtml = generateHomeChartHtml();
    homeFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        const startTag = '<tbody id="time-chart-body" class="bg-white">';
        const endTag = '</tbody>';
        const startIndex = content.indexOf(startTag);
        const endIndex = content.indexOf(endTag, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            const newContent = content.substring(0, startIndex + startTag.length) + '\n' + homeHtml + '                            ' + content.substring(endIndex);
            fs.writeFileSync(file, newContent);
            console.log(`Updated: ${file}`);
        }
    });

    console.log('Updating Detailed charts...');
    const detailedHtml = generateDetailedChartHtml();
    chartFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        // Find the second <tbody> or use a marker
        // In time-chart/index.html it's usually the only <tbody> in the main table
        const startMarker = '<tbody class="bg-white">';
        const endMarker = '</tbody>';
        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            const newContent = content.substring(0, startIndex + startMarker.length) + '\n' + detailedHtml + content.substring(endIndex);
            fs.writeFileSync(file, newContent);
            console.log(`Updated: ${file}`);
        }
    });
}

run();
