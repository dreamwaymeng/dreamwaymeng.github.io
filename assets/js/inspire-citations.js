/**
 * INSPIRE-HEP Citation Summary
 * Fetches publication data from INSPIRE-HEP API and displays citation statistics
 */

(function() {
  'use strict';

  console.log('[INSPIRE Citations] Script loaded');

  // Configuration
  const CACHE_KEY = 'inspire_citations_cache_v3';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const API_BASE = 'https://inspirehep.net/api/literature';

  // Translation labels
  const TRANSLATIONS = {
    en: {
      papers: 'Papers',
      citations: 'Citations',
      citationsPerPaper: 'Cites/Paper',
      hindex: 'h-index',
      highlyCited: 'Cited >100 ',
      topJournals: 'Top Journals',
      prl: 'PRL',
      prd: 'PRD',
      physRept: 'Phys.Rept.',
      sciBull: 'Sci.Bull.',
      jhep: 'JHEP',
      dataSource: 'Data from INSPIREHEP',
      lastUpdated: 'Updated',
      refresh: 'Refresh',
      loading: 'Loading citation data...',
      errorMsg: 'Unable to load citation data. Please visit the full publication list.',
      retry: 'Retry'
    },
    zh: {
      papers: '论文',
      citations: '引用',
      citationsPerPaper: '篇均引用',
      hindex: 'h指数',
      highlyCited: '引用>100',
      topJournals: '顶级期刊',
      prl: 'PRL',
      prd: 'PRD',
      physRept: 'Phys.Rept.',
      sciBull: 'Sci.Bull.',
      jhep: 'JHEP',
      dataSource: '数据来自INSPIREHEP',
      lastUpdated: '更新',
      refresh: '刷新',
      loading: '正在加载引用数据...',
      errorMsg: '无法加载引用数据，请访问完整论文列表。',
      retry: '重试'
    }
  };

  /**
   * Format number with thousand separators
   */
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Format decimal number
   */
  function formatDecimal(num, decimals = 1) {
    if (num === undefined || num === null || isNaN(num)) {
      return '0.0';
    }
    return num.toFixed(decimals);
  }

  /**
   * Format date based on language
   */
  function formatDate(date, lang) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, options);
  }

  /**
   * Calculate h-index from citation counts
   */
  function calculateHIndex(citationCounts) {
    // Sort citations in descending order
    const sorted = citationCounts.slice().sort((a, b) => b - a);

    // Find largest h where h papers have >= h citations
    let hIndex = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }

    return hIndex;
  }

  /**
   * Check if paper is published
   */
  function isPublished(pub) {
    const metadata = pub.metadata;

    // Must be citeable
    if (!metadata.citeable) {
      return false;
    }

    // Must have publication info
    if (!metadata.publication_info || metadata.publication_info.length === 0) {
      return false;
    }

    // Check if any publication_info entry has material="publication"
    return metadata.publication_info.some(info =>
      info.material === 'publication'
    );
  }

  /**
   * Get journal title from publication
   */
  function getJournalTitle(pub) {
    const pubInfo = pub.metadata.publication_info;
    if (!pubInfo || pubInfo.length === 0) {
      return null;
    }

    // Try to find publication entry first, otherwise use first entry with journal_title
    let publication = pubInfo.find(info => info.material === 'publication');
    if (!publication) {
      publication = pubInfo.find(info => info.journal_title);
    }
    return publication ? publication.journal_title : null;
  }

  /**
   * Count papers by top journals
   */
  function countTopJournals(publications) {
    const counts = {
      prl: 0,
      prd: 0,
      physRept: 0,
      sciBull: 0,
      jhep: 0
    };

    publications.forEach(pub => {
      const journal = getJournalTitle(pub);
      if (!journal) return;

      const journalLower = journal.toLowerCase();

      if (journalLower.includes('phys.rev.lett')) {
        counts.prl++;
      } else if (journalLower.includes('phys.rev.d')) {
        counts.prd++;
      } else if (journalLower.includes('phys.rept')) {
        counts.physRept++;
      } else if (journalLower.includes('sci.bull')) {
        counts.sciBull++;
      } else if (journalLower === 'jhep') {
        counts.jhep++;
      }
    });

    return counts;
  }

  /**
   * Fetch publications from INSPIRE-HEP API
   */
  async function fetchPublications(authorId) {
    // Construct API URL using BAI (author identifier)
    const bai = 'Lu.Meng.1'; // BAI for author ID 1692520
    const fields = 'citation_count,citation_count_without_self_citations,publication_info,citeable';
    const size = 250; // Ensure we get all publications
    const query = `a ${bai}`;
    const url = `${API_BASE}?q=${encodeURIComponent(query)}&size=${size}&fields=${fields}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.hits.hits; // Array of publication records
  }

  /**
   * Calculate metrics from publication data
   */
  function calculateMetrics(publications) {
    // Use all publications (not filtering for published only)
    const citationCounts = [];
    let totalCitations = 0;
    let totalCitationsWithoutSelf = 0;
    let highlyCitedCount = 0;

    publications.forEach(pub => {
      const citations = pub.metadata.citation_count || 0;
      const citationsWithoutSelf = pub.metadata.citation_count_without_self_citations || 0;

      citationCounts.push(citations);
      totalCitations += citations;
      totalCitationsWithoutSelf += citationsWithoutSelf;

      if (citations > 100) {
        highlyCitedCount++;
      }
    });

    const topJournals = countTopJournals(publications);
    const citationsPerPaper = publications.length > 0
      ? totalCitations / publications.length
      : 0;

    return {
      totalPapers: publications.length,
      totalCitations: totalCitations,
      totalCitationsWithoutSelf: totalCitationsWithoutSelf,
      citationsPerPaper: citationsPerPaper,
      hIndex: calculateHIndex(citationCounts),
      highlyCitedCount: highlyCitedCount,
      topJournals: topJournals,
      timestamp: Date.now()
    };
  }

  /**
   * Get cached data if still valid
   */
  function getCachedData() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      const age = Date.now() - data.timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }
    } catch (e) {
      console.error('Error reading cache:', e);
    }
    return null;
  }

  /**
   * Save data to cache
   */
  function setCachedData(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error writing cache:', e);
    }
  }

  /**
   * Render citation summary HTML
   */
  function renderSummary(metrics, lang, container) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const updateDate = formatDate(new Date(metrics.timestamp), lang);

    // Provide defaults for backward compatibility with old cached data
    const citationsPerPaper = metrics.citationsPerPaper || 0;
    const topJournals = metrics.topJournals || { prl: 0, prd: 0, physRept: 0, sciBull: 0, jhep: 0 };

    const html = `
      <div class="citations-summary">
        <div class="citations-grid">
          <div class="citation-stat">
            <span class="stat-value">${formatNumber(metrics.totalPapers)}</span>
            <span class="stat-label">${t.papers}</span>
          </div>
          <div class="citation-stat">
            <span class="stat-value">${formatNumber(metrics.totalCitations)}</span>
            <span class="stat-label">${t.citations}</span>
          </div>
          <div class="citation-stat">
            <span class="stat-value">${formatDecimal(citationsPerPaper)}</span>
            <span class="stat-label">${t.citationsPerPaper}</span>
          </div>
          <div class="citation-stat">
            <span class="stat-value">${formatNumber(metrics.hIndex)}</span>
            <span class="stat-label">${t.hindex}</span>
          </div>
          <div class="citation-stat">
            <span class="stat-value">${formatNumber(metrics.highlyCitedCount)}</span>
            <span class="stat-label">${t.highlyCited}</span>
          </div>
          <div class="citation-stat citation-stat-journals">
            <span class="stat-label">${t.topJournals}</span>
            <div class="journal-counts">
              <span class="journal-item">${t.prl}: ${topJournals.prl}</span>
              <span class="journal-item">${t.prd}: ${topJournals.prd}</span>
              <span class="journal-item">${t.physRept}: ${topJournals.physRept}</span>
              <span class="journal-item">${t.sciBull}: ${topJournals.sciBull}</span>
              <span class="journal-item">${t.jhep}: ${topJournals.jhep}</span>
            </div>
          </div>
        </div>
        <div class="citations-footer">
          <small>${t.dataSource} | ${t.lastUpdated}: ${updateDate} | <a href="#" class="citations-refresh">${t.refresh}</a></small>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Add refresh click handler
    const refreshLink = container.querySelector('.citations-refresh');
    if (refreshLink) {
      refreshLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadCitations(container, true);
      });
    }
  }

  /**
   * Render loading state
   */
  function renderLoading(lang, container) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    container.innerHTML = `
      <div class="citations-loading">
        <span class="loading-spinner"></span> ${t.loading}
      </div>
    `;
  }

  /**
   * Render error state
   */
  function renderError(lang, container) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    container.innerHTML = `
      <div class="citations-error">
        <p>${t.errorMsg}</p>
        <small><a href="#" class="citations-retry">${t.retry}</a></small>
      </div>
    `;

    // Add retry click handler
    const retryLink = container.querySelector('.citations-retry');
    if (retryLink) {
      retryLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadCitations(container, true);
      });
    }
  }

  /**
   * Main function to load and display citations
   */
  async function loadCitations(container, forceRefresh) {
    const authorId = container.getAttribute('data-author-id');
    const lang = container.getAttribute('data-lang') || 'en';

    // Try to use cached data first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        renderSummary(cached, lang, container);
        return;
      }
    }

    // Show loading state
    renderLoading(lang, container);

    try {
      // Fetch fresh data from API
      const publications = await fetchPublications(authorId);
      const metrics = calculateMetrics(publications);

      // Cache the results
      setCachedData(metrics);

      // Render the summary
      renderSummary(metrics, lang, container);
    } catch (error) {
      console.error('Error fetching citations:', error);

      // Try to use stale cache as fallback
      const staleCache = getCachedData();
      if (staleCache && !forceRefresh) {
        renderSummary(staleCache, lang, container);
      } else {
        renderError(lang, container);
      }
    }
  }

  /**
   * Initialize citation containers on page load
   */
  function initCitations() {
    console.log('[INSPIRE Citations] Initializing...');
    const containers = document.querySelectorAll('#inspire-citations');
    console.log('[INSPIRE Citations] Found', containers.length, 'container(s)');
    containers.forEach(function(container) {
      loadCitations(container, false);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCitations);
  } else {
    initCitations();
  }

})();
