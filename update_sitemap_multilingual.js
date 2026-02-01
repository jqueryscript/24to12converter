const fs = require('fs');
const path = require('path');

const sitemapPath = 'sitemap.xml';
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const baseUrl = 'https://www.24to12converter.com';
const today = new Date().toISOString().split('T')[0];

const languages = [
    { code: 'en', prefix: '' },
    { code: 'de', prefix: 'de' },
    { code: 'es', prefix: 'es' },
    { code: 'fr', prefix: 'fr' },
    { code: 'pt', prefix: 'pt' },
    { code: 'it', prefix: 'it' },
    { code: 'ja', prefix: 'ja' },
    { code: 'ko', prefix: 'ko' },
    { code: 'zh-tw', prefix: 'zh-tw' }
];

let newUrls = '';
let addedCount = 0;

const intervals = ['00', '15', '30', '45'];

languages.forEach(lang => {
    for (let h = 0; h < 24; h++) {
        const hourStr = h.toString().padStart(2, '0');
        for (let m of intervals) {
            const dirName = `${hourStr}-${m}`;
            
            let pathStr = '';
            if (lang.prefix) {
                pathStr = `${lang.prefix}/time/${dirName}/`;
            } else {
                pathStr = `time/${dirName}/`;
            }
            
            const loc = `${baseUrl}/${pathStr}`;
            
            // 检查是否存在
            if (sitemapContent.includes(`<loc>${loc}</loc>`)) {
                continue;
            }

            newUrls += `
    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
            addedCount++;
        }
    }
});

if (newUrls) {
    sitemapContent = sitemapContent.replace('</urlset>', `${newUrls}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Sitemap updated successfully with ${addedCount} new pages.`);
} else {
    console.log('No new URLs needed to be added.');
}
