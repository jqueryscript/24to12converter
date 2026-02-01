const fs = require('fs');
const path = require('path');
const glob = require('glob');

const filesPattern = '**/index.html';
const ignore = ['node_modules/**'];

function processFiles() {
    const allFiles = glob.sync(filesPattern, { ignore, nodir: true });
    console.log(`Found ${allFiles.length} pages to update...`);

    allFiles.forEach(filePath => {
        const normalizedPath = filePath.replace(/\\/g, '/');
        const parts = normalizedPath.split('/');
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let linkPrefix = '';

        if (normalizedPath === 'index.html') {
            linkPrefix = 'time/';
        } else if (parts.includes('time-chart') || parts.includes('military-time-converter')) {
            linkPrefix = '../time/';
        } else if (parts.includes('time') && parts[parts.length - 1] === 'index.html') {
            linkPrefix = '../';
        } else if (parts.length === 2 && parts[1] === 'index.html') {
            linkPrefix = 'time/';
        } else {
            linkPrefix = 'time/';
        }

        const timeRegex = /<td class="px-6 py-4 font-medium text-slate-900">(?:<a[^>]*>)?(\d{2}):(00|15|30|45)(?:<\/a>)?<\/td>/g;

        content = content.replace(timeRegex, (match, hour, minute) => {
            const timeSlug = `${hour}-${minute}`;
            const newContent = `<td class="px-6 py-4 font-medium text-slate-900"><a href="${linkPrefix}${timeSlug}/" class="text-blue-600 hover:underline">${hour}:${minute}</a></td>`;
            if (match !== newContent) {
                modified = true;
                return newContent;
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed links in: ${normalizedPath} (Prefix: ${linkPrefix})`);
        }
    });
}

processFiles();
