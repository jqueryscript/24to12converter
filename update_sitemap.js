const fs = require('fs');
const path = require('path');

const sitemapPath = 'sitemap.xml';
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');


const baseUrl = 'https://www.24to12converter.com';
const today = new Date().toISOString().split('T')[0];


let newUrls = '';


const intervals = ['00', '15', '30', '45'];
let addedCount = 0;

for (let h = 0; h < 24; h++) {
    const hourStr = h.toString().padStart(2, '0');
    for (let m of intervals) {
        const timePath = `time/${hourStr}-${m}/`;
        const loc = `${baseUrl}/${timePath}`;


        if (sitemapContent.includes(loc)) {
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


if (newUrls) {
    sitemapContent = sitemapContent.replace('</urlset>', `${newUrls}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Sitemap updated successfully with ${addedCount} new time pages.`);
} else {
    console.log('No new URLs needed to be added.');
}
