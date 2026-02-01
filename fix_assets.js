const fs = require('fs');
const path = require('path');
const glob = require('glob');

const allFiles = glob.sync('**/index.html', { ignore: 'node_modules/**' });

allFiles.forEach(filePath => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const depth = parts.length - 1;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const prefix = depth === 0 ? '' : '../'.repeat(depth);

    // Precise string replacement for common errors found
    const targets = [
        { old: 'src="script.js', new: `src="${prefix}script.js` },
        { old: 'src="../script.js', new: `src="${prefix}script.js` },
        { old: 'src="../../script.js', new: `src="${prefix}script.js` },
        { old: 'href="./dist/app.css"', new: `href="${prefix}dist/app.css"` },
        { old: 'href="../dist/app.css"', new: `href="${prefix}dist/app.css"` },
        { old: 'href="../../dist/app.css"', new: `href="${prefix}dist/app.css"` }
    ];

    targets.forEach(t => {
        if (content.includes(t.old)) {
            const newContent = content.split(t.old).join(t.new);
            if (content !== newContent) {
                content = newContent;
                modified = true;
            }
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content);
    }
});
console.log('Global asset path fix completed via string split/join.');