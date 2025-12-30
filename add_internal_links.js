const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 需要处理的文件匹配模式
const files = [
    'index.html',                          // 根目录主页
    '**/index.html',                       // 各子目录主页 (de, es, time-chart 等)
    '**/time-chart/index.html'             // 专门的图表页
];

// 排除已经生成的落地页本身，避免死循环
const ignore = [
    'time/**/index.html',
    '**/time/**/index.html',
    'node_modules/**'
];

function processFiles() {
    // 使用 glob 找到所有 index.html
    const allFiles = glob.sync('**/index.html', { 
        ignore: ignore,
        nodir: true 
    });

    console.log(`Found ${allFiles.length} pages to update with internal links...`);

    allFiles.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 识别当前文件的深度，以确定链接前缀
        // 根目录 index.html -> time/15-00/
        // de/index.html -> time/15-00/
        // de/time-chart/index.html -> ../time/15-00/
        // time-chart/index.html -> ../time/15-00/
        
        const dirDepth = filePath.split(path.sep).length - 1;
        let linkPrefix = 'time/';
        
        // 如果是在子目录的子目录（如 de/time-chart），需要回退一级到语言根目录
        // 但注意：你的结构中，de/ 下面就有 time/ 目录，所以 de/index.html 应该直接连 time/
        // 而 de/time-chart/index.html 需要 ../time/
        if (filePath.includes('time-chart') || filePath.includes('military-time-converter')) {
            linkPrefix = '../time/';
        }

        // 匹配表格中的整点时间单元格
        // 原始格式: <td class="px-6 py-4 font-medium text-slate-900">15:00</td>
        const timeRegex = /<td class="px-6 py-4 font-medium text-slate-900">(\d{2}):00<\/td>/g;

        content = content.replace(timeRegex, (match, hour) => {
            modified = true;
            const timeSlug = `${hour}-00`;
            return `<td class="px-6 py-4 font-medium text-slate-900"><a href="${linkPrefix}${timeSlug}/" class="text-blue-600 hover:underline">${hour}:00</a></td>`;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated links in: ${filePath}`);
        }
    });
}

processFiles();
