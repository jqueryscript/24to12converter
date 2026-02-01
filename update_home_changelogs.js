const fs = require('fs');
const path = require('path');

const updates = {
    en: {
        title: "Recent Updates",
        desc: "We are constantly improving our tools. Here are the latest updates and fixes.",
        date: "January 30, 2026",
        p1: "Expanded conversion coverage to every 15-minute interval across all 9 languages.",
        p2: "Full site audit completed: Fixed 4,700+ internal links and asset paths for better SEO.",
        priorTitle: "Prior Major Updates",
        prior1: "Full multilingual support for 9+ languages including German, Spanish, and French.",
        prior2: "Launched specialized Military Time Converter and comprehensive Time Conversion Charts.",
        prior3: "Optimized mobile UI, improved input masking, and accessibility enhancements."
    },
    de: {
        title: "Aktuelle Updates",
        desc: "Wir verbessern unsere Tools ständig. Hier sind die neuesten Updates und Korrekturen.",
        date: "30. Januar 2026",
        p1: "Erweiterte Konvertierung auf alle 15-Minuten-Intervalle in allen 9 Sprachen.",
        p2: "Vollständiges Website-Audit abgeschlossen: 4.700+ interne Links und Pfade korrigiert.",
        priorTitle: "Frühere wichtige Updates",
        prior1: "Vollständige mehrsprachige Unterstützung für 9+ Sprachen.",
        prior2: "Militärzeit-Konverter und umfassende Zeittabellen eingeführt.",
        prior3: "Mobile UI optimiert, Eingabemaskierung und Barrierefreiheit verbessert."
    },
    es: {
        title: "Actualizaciones Recientes",
        desc: "Mejoramos constantemente nuestras herramientas. Aquí están las últimas actualizaciones y correcciones.",
        date: "30 de enero de 2026",
        p1: "Cobertura de conversión ampliada a intervalos de 15 minutos en los 9 idiomas.",
        p2: "Auditoría completa del sitio: corregidos más de 4.700 enlaces internos y rutas de activos.",
        priorTitle: "Actualizaciones importantes anteriores",
        prior1: "Soporte multilingüe completo para más de 9 idiomas.",
        prior2: "Lanzamiento del convertidor de tiempo militar y tablas de conversión.",
        prior3: "UI móvil optimizada, mejoras en la máscara de entrada y accesibilidad."
    },
    fr: {
        title: "Mises à jour récentes",
        desc: "Nous améliorons constamment nos outils. Voici les dernières mises à jour et corrections.",
        date: "30 janvier 2026",
        p1: "Couverture de conversion étendue à chaque intervalle de 15 minutes dans les 9 langues.",
        p2: "Audit complet du site : correction de plus de 4 700 liens internes et chemins d'accès.",
        priorTitle: "Mises à jour majeures précédentes",
        prior1: "Support multilingue complet pour plus de 9 langues.",
        prior2: "Lancement du convertisseur d'heure militaire et des tableaux de conversion.",
        prior3: "Optimisation de l'interface mobile, du masquage de saisie et de l'accessibilité."
    },
    it: {
        title: "Aggiornamenti Recenti",
        desc: "Miglioriamo costantemente i nostri strumenti. Ecco gli ultimi aggiornamenti e correzioni.",
        date: "30 Gennaio 2026",
        p1: "Copertura della conversione estesa a intervalli di 15 minuti in tutte le 9 lingue.",
        p2: "Audit completo del sito: corretti oltre 4.700 link interni e percorsi degli asset.",
        priorTitle: "Precedenti aggiornamenti principali",
        prior1: "Supporto multilingue completo per oltre 9 lingue.",
        prior2: "Lancio del convertitore di ora militare e delle tabelle di conversione.",
        prior3: "Ottimizzazione UI mobile, miglioramento della maschera di input e accessibilità."
    },
    pt: {
        title: "Atualizações Recentes",
        desc: "Estamos constantemente melhorando nossas ferramentas. Aqui estão as últimas atualizações e correções.",
        date: "30 de janeiro de 2026",
        p1: "Cobertura de conversão expandida para intervalos de 15 minutos em todos os 9 idiomas.",
        p2: "Auditoria completa do site: corrigidos mais de 4.700 links internos e caminhos de ativos.",
        priorTitle: "Atualizações principais anteriores",
        prior1: "Suporte multilíngue completo para mais de 9 idiomas.",
        prior2: "Lançamento do conversor de horário militar e tabelas de conversão.",
        prior3: "UI móvel otimizada, melhoria na máscara de entrada e acessibilidade."
    },
    ja: {
        title: "最近のアップデート",
        desc: "常にツールの改善を行っています。最新のアップデートと修正内容は以下の通りです。",
        date: "2026年1月30日",
        p1: "全9言語で15分間隔の変換ページを拡充しました。",
        p2: "サイト全体の監査を完了：4,700以上の内部リンクとアセットパスを修正しSEOを改善。",
        priorTitle: "以前の主なアップデート",
        prior1: "ドイツ語、スペイン語、フランス語を含む9つ以上の言語に完全対応。",
        prior2: "軍事時間変換器および詳細な時間対応表をリリース。",
        prior3: "モバイルUIの最適化、入力マスクの改善、アクセシビリティの向上。"
    },
    ko: {
        title: "최근 업데이트",
        desc: "당사는 도구를 지속적으로 개선하고 있습니다. 최신 업데이트 및 수정 사항은 다음과 같습니다.",
        date: "2026년 1월 30일",
        p1: "9개 모든 언어에서 15분 간격 변환 페이지를 확장했습니다.",
        p2: "전체 사이트 감사 완료: SEO 개선을 위해 4,700개 이상의 내부 링크 및 경로 수정.",
        priorTitle: "이전 주요 업데이트",
        prior1: "독일어, 스페인어, 프랑스어 등 9개 이상의 언어 완벽 지원.",
        prior2: "군사 시간 변환기 및 종합 시간 변환표 출시.",
        prior3: "모바일 UI 최적화, 입력 마스크 개선 및 접근성 향상."
    },
    'zh-tw': {
        title: "最近更新",
        desc: "我們不斷改進工具。以下是最新更新和修復內容。",
        date: "2026年1月30日",
        p1: "擴展了全站 9 種語言的 15 分鐘間隔轉換頁面。",
        p2: "完成全站審計：修復了 4,700+ 個內鏈和資源路徑，提升 SEO 性能。",
        priorTitle: "過往重大更新",
        prior1: "全面支持 9+ 種語言（德、西、法、中等）。",
        prior2: "上線軍用時間轉換器與完整時間對照表。",
        prior3: "優化移動端 UI、輸入遮罩及無障礙訪問。"
    }
};

function generateFullSection(lang) {
    const d = updates[lang] || updates.en;
    return `
            <!-- Changelog Section -->
        <div class="py-20 bg-slate-100">
            <div class="container mx-auto px-4">
                <section id="changelog" aria-labelledby="changelog-heading">
                    <div class="max-w-4xl mx-auto text-center">
                        <h2 id="changelog-heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">${d.title}</h2>
                        <p class="text-lg text-gray-600 max-w-2xl mx-auto">${d.desc}</p>
                    </div>
                    <div class="mt-12 max-w-2xl mx-auto">
                        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">${d.date}</h3>
                            <ul class="space-y-2">
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>${d.p1}</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>${d.p2}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">${d.priorTitle}</h3>
                            <ul class="space-y-2">
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>${d.prior1}</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>${d.prior2}</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>${d.prior3}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>`;
}

const homepages = [
    { file: 'index.html', lang: 'en' },
    { file: 'de/index.html', lang: 'de' },
    { file: 'es/index.html', lang: 'es' },
    { file: 'fr/index.html', lang: 'fr' },
    { file: 'it/index.html', lang: 'it' },
    { file: 'ja/index.html', lang: 'ja' },
    { file: 'ko/index.html', lang: 'ko' },
    { file: 'pt/index.html', lang: 'pt' },
    { file: 'zh-tw/index.html', lang: 'zh-tw' }
];

homepages.forEach(hp => {
    if (!fs.existsSync(hp.file)) return;
    let content = fs.readFileSync(hp.file, 'utf8');
    
    const changelogMarker = '<!-- Changelog Section -->';
    const mainEndMarker = '</main>';

    if (content.includes(changelogMarker)) {
        // Replace existing section
        const startIndex = content.indexOf(changelogMarker);
        const nextSectionIndex = content.indexOf('<footer', startIndex);
        const nextMainEndIndex = content.indexOf('</main>', startIndex);
        
        // Find where the section actually ends (before </main>)
        let endIndex = nextMainEndIndex !== -1 ? nextMainEndIndex : nextSectionIndex;
        
        const newSection = generateFullSection(hp.lang);
        const newContent = content.substring(0, startIndex) + newSection + '\n    ' + content.substring(endIndex);
        fs.writeFileSync(hp.file, newContent);
        console.log(`Updated existing changelog in: ${hp.file}`);
    } else {
        // Insert before </main>
        const mainEndIndex = content.indexOf(mainEndMarker);
        if (mainEndIndex !== -1) {
            const newSection = generateFullSection(hp.lang);
            const newContent = content.substring(0, mainEndIndex) + newSection + '\n    ' + content.substring(mainEndIndex);
            fs.writeFileSync(hp.file, newContent);
            console.log(`Inserted new changelog in: ${hp.file}`);
        }
    }
});