const fs = require('fs');
const path = require('path');
const glob = require('glob');

const baseUrl = 'https://www.24to12converter.com';
const projectRoot = __dirname;

const auditResults = {
    missingFiles: [],
    seoErrors: [],
    deadLinks: [],
    invalidHreflangs: []
};

const allFiles = glob.sync('**/index.html', { ignore: 'node_modules/**' });

allFiles.forEach(file => {
    const normalizedFile = file.replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const currentDir = path.dirname(path.join(projectRoot, file));

    // 1. Canonical Verification
    const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)"/);
    if (canonicalMatch) {
        const found = canonicalMatch[1];
        let expected = baseUrl + '/' + normalizedFile.replace('index.html', '');
        if (normalizedFile === 'index.html') expected = baseUrl + '/';
        
        if (found !== expected && found !== expected.slice(0, -1)) {
            auditResults.seoErrors.push(`${normalizedFile}: Canonical mismatch. Found: ${found}, Expected: ${expected}`);
        }
    }

    // 2. Hreflang URL Verification (Check if de/time/HH-MM exists if linked)
    const hreflangMatches = content.matchAll(/<link rel="alternate" hreflang=".*?" href="(.*?)"/g);
    for (const match of hreflangMatches) {
        const url = match[1];
        if (url.startsWith(baseUrl)) {
            const urlPath = url.replace(baseUrl, '').replace(/^\//, '');
            const targetFile = path.join(projectRoot, urlPath, 'index.html');
            if (!fs.existsSync(targetFile)) {
                auditResults.invalidHreflangs.push(`${normalizedFile}: Hreflang points to missing page: ${url}`);
            }
        }
    }

    // 3. Asset & Internal Link Verification
    // Find all href and src
    const linkMatches = content.matchAll(/(?:href|src)=\"([^"h][^\"]*)\"/g);
    for (const match of linkMatches) {
        let target = match[1].split('#')[0].split('?')[0];
        if (!target || target === '/') continue;

        let absoluteTarget;
        if (target.startsWith('/')) {
            // Root-relative
            absoluteTarget = path.join(projectRoot, target);
        } else {
            // Relative
            absoluteTarget = path.resolve(currentDir, target);
        }

        if (!fs.existsSync(absoluteTarget)) {
            // Check if it's a directory that should have index.html
            if (!fs.existsSync(path.join(absoluteTarget, 'index.html'))) {
                auditResults.deadLinks.push(`${normalizedFile}: Broken reference to ${target}`);
            }
        }
    }
});

console.log('\n--- REFINED AUDIT REPORT ---');
console.log(`Total Files Checked: ${allFiles.length}`);
console.log(`Dead Links/Assets: ${auditResults.deadLinks.length}`);
console.log(`Canonical/SEO Errors: ${auditResults.seoErrors.length}`);
console.log(`Invalid Hreflang URLs: ${auditResults.invalidHreflangs.length}`);

if (auditResults.deadLinks.length > 0) {
    console.log('\nSample Dead Links:');
    const uniqueDead = [...new Set(auditResults.deadLinks)];
    console.log(uniqueDead.slice(0, 10).join('\n'));
}

if (auditResults.seoErrors.length > 0) {
    console.log('\nSEO Errors:');
    console.log(auditResults.seoErrors.slice(0, 10).join('\n'));
}

if (auditResults.invalidHreflangs.length > 0) {
    console.log('\nInvalid Hreflangs (first 10):');
    console.log(auditResults.invalidHreflangs.slice(0, 10).join('\n'));
}
