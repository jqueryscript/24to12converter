const fs = require('fs');
const path = require('path');

const sitemapPath = 'sitemap.xml';
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// 基础 URL
const baseUrl = 'https://www.24to12converter.com';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// 构建新页面的 XML 块
let newUrls = '';

// 生成 00-00 到 23-45
const intervals = ['00', '15', '30', '45'];
let addedCount = 0;

for (let h = 0; h < 24; h++) {
    const hourStr = h.toString().padStart(2, '0');
    for (let m of intervals) {
        const timePath = `time/${hourStr}-${m}/`;
        const loc = `${baseUrl}/${timePath}`;
        
        // 检查是否已经存在（防止重复添加）
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

// 插入到 </urlset> 之前
if (newUrls) {
    sitemapContent = sitemapContent.replace('</urlset>', `${newUrls}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Sitemap updated successfully with ${addedCount} new time pages.`);
} else {
    console.log('No new URLs needed to be added.');
}
