const fs = require('fs');
const path = require('path');
const glob = require('glob');

const baseUrl = 'https://www.24to12converter.com';
const languages = ['', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-tw'];
const expectedIntervals = [];
for (let h = 0; h < 24; h++) {
    const hh = h.toString().padStart(2, '0');
    ['00', '15', '30', '45'].forEach(mm => expectedIntervals.push(`${hh}-${mm}`));
}

const auditResults = {
    missingFiles: [],
    seoErrors: [],
    deadLinks: [],
    inconsistentCanonicals: []
};

// 1. Check for missing language pages
console.log('Checking for missing localized pages...');
expectedIntervals.forEach(slug => {
    languages.forEach(lang => {
        const filePath = lang 
            ? path.join(lang, 'time', slug, 'index.html')
            : path.join('time', slug, 'index.html');
        if (!fs.existsSync(filePath)) {
            auditResults.missingFiles.push(`Missing: ${filePath}`);
        }
    });
});

// 2. Sample Check for SEO and Links (Check root, lang roots, and 5 random time pages)
const sampleFiles = [
    'index.html',
    'de/index.html',
    'time-chart/index.html',
    'time/12-00/index.html',
    'de/time/18-30/index.html',
    'military-time-converter/index.html'
];

console.log('Auditing sample files for SEO and links...');
const allFiles = glob.sync('**/index.html', { ignore: 'node_modules/**' });

allFiles.forEach(file => {
    const normalizedFile = file.replace(/\\/g, '/');
    let content;
    try {
        content = fs.readFileSync(file, 'utf8');
    } catch (e) { return; }

    // SEO: Title & Description
    if (!content.includes('<title>')) auditResults.seoErrors.push(`${normalizedFile}: Missing <title>`);
    if (!content.includes('name="description"')) auditResults.seoErrors.push(`${normalizedFile}: Missing meta description`);

    // SEO: Canonical Check
    const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)"/);
    if (!canonicalMatch) {
        auditResults.seoErrors.push(`${normalizedFile}: Missing canonical link`);
    } else {
        const expectedCanonical = baseUrl + '/' + normalizedFile.replace('index.html', '');
        if (canonicalMatch[1] !== expectedCanonical && canonicalMatch[1] !== expectedCanonical.slice(0, -1)) {
             // Handle root index exception
             if (!(normalizedFile === 'index.html' && canonicalMatch[1] === baseUrl + '/')) {
                auditResults.inconsistentCanonicals.push(`${normalizedFile}: Expected ${expectedCanonical}, found ${canonicalMatch[1]}`);
             }
        }
    }

    // SEO: Hreflang Check
    if (!content.includes('hreflang="x-default"')) auditResults.seoErrors.push(`${normalizedFile}: Missing hreflang x-default`);
    if (!content.includes('hreflang="de"')) auditResults.seoErrors.push(`${normalizedFile}: Missing hreflang de (partial check)`);

    // Links: Internal Link Check (Regex for href)
    const links = content.match(/href="([^"h][^"]*)"/g); // Matches relative links only
    if (links) {
        links.forEach(l => {
            let target = l.match(/href="(.*?)"/)[1].split('#')[0].split('?')[0];
            if (!target || target === '/' || target.startsWith('http')) return;

            const currentDir = path.dirname(file);
            let absoluteTarget = path.resolve(currentDir, target);
            
            // Check if directory or file exists
            if (!fs.existsSync(absoluteTarget)) {
                // Try adding index.html if it's a directory link
                if (!fs.existsSync(path.join(absoluteTarget, 'index.html'))) {
                    auditResults.deadLinks.push(`${normalizedFile}: Broken link to ${target} (Resolved: ${absoluteTarget})`);
                }
            }
        });
    }
});

console.log('\n--- AUDIT REPORT ---');
console.log(`Total Files Checked: ${allFiles.length}`);
console.log(`Missing Localized Files: ${auditResults.missingFiles.length}`);
console.log(`SEO Errors: ${auditResults.seoErrors.length}`);
console.log(`Dead Links: ${auditResults.deadLinks.length}`);
console.log(`Inconsistent Canonicals: ${auditResults.inconsistentCanonicals.length}`);

if (auditResults.deadLinks.length > 0) {
    console.log('\nTop 5 Dead Links:');
    console.log(auditResults.deadLinks.slice(0, 5).join('\n'));
}

if (auditResults.inconsistentCanonicals.length > 0) {
    console.log('\nTop 5 Canonical Mismatches:');
    console.log(auditResults.inconsistentCanonicals.slice(0, 5).join('\n'));
}

if (auditResults.seoErrors.length > 0) {
    console.log('\nSample SEO Errors:');
    console.log(auditResults.seoErrors.slice(0, 5).join('\n'));
}
