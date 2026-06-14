(function () {
  'use strict';

  // ─── Translation dictionary (zh-CN → en) ───────────────────────────────────
  var dict = {
    // Nav menu
    '首页': 'Home',
    '关于': 'About',
    '归档': 'Archives',
    '标签': 'Tags',
    '分类': 'Categories',
    '搜索': 'Search',
    '标签云': 'Tag Cloud',

    // Sidebar
    '最新文章': 'Recent Posts',
    '文章目录': 'Contents',
    '最新评论': 'Recent Comments',
    '网站资讯': 'Site Info',
    '文章数目': 'Posts',
    '运行时间': 'Runtime',
    '本站总字数': 'Total Words',
    '上次更新': 'Last Updated',
    '标签数目': 'Tags',
    '分类数目': 'Categories',

    // Article meta
    '发表于': 'Posted on',
    '更新于': 'Updated on',
    '字数统计': 'Word Count',
    '阅读时长': 'Read Time',
    '分钟': 'min',
    '字': 'words',

    // Buttons / UI
    '目录': 'TOC',
    '阅读模式': 'Reading',
    '夜间模式': 'Dark Mode',
    '隐藏边栏': 'Hide Aside',
    '返回顶部': 'Top',
    '加载更多': 'Load More',
    '上一篇': 'Prev',
    '下一篇': 'Next',
    '复制成功': 'Copied!',
    '复制代码': 'Copy',

    // 404 / misc
    '页面不存在': 'Page Not Found',
    '回到首页': 'Back Home',
  };

  var reversDict = {};
  Object.keys(dict).forEach(function (zh) { reversDict[dict[zh]] = zh; });

  // ─── Core: walk text nodes and replace ─────────────────────────────────────
  function replaceTextNodes(root, map) {
    var walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentNode;
      // Skip script / style / pre / code nodes
      if (!parent) continue;
      var tag = parent.tagName ? parent.tagName.toUpperCase() : '';
      if (['SCRIPT', 'STYLE', 'PRE', 'CODE', 'TEXTAREA'].indexOf(tag) !== -1) continue;
      var trimmed = node.nodeValue.trim();
      if (map[trimmed] !== undefined) {
        node.nodeValue = node.nodeValue.replace(trimmed, map[trimmed]);
      }
    }
  }

  function applyLang(lang) {
    var map = lang === 'en' ? dict : reversDict;
    replaceTextNodes(document.body, map);
    // Update button label
    var btn = document.getElementById('i18n-toggle');
    if (btn) btn.textContent = lang === 'en' ? '中' : 'EN';
    // Persist
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  // ─── Inject toggle button into navbar ───────────────────────────────────────
  function injectButton() {
    if (document.getElementById('i18n-toggle')) return;

    var currentLang = 'zh';
    try { currentLang = localStorage.getItem('lang') || 'zh'; } catch (e) {}

    var btn = document.createElement('button');
    btn.id = 'i18n-toggle';
    btn.setAttribute('aria-label', 'Switch language');
    btn.textContent = currentLang === 'en' ? '中' : 'EN';

    btn.addEventListener('click', function () {
      var next = (localStorage.getItem('lang') || 'zh') === 'en' ? 'zh' : 'en';
      applyLang(next);
    });

    // Insert into nav — try common Butterfly selectors
    var target =
      document.querySelector('#nav .menus_items') ||
      document.querySelector('#nav-right') ||
      document.querySelector('nav');

    if (target) {
      var wrap = document.createElement('div');
      wrap.className = 'i18n-wrap';
      wrap.appendChild(btn);
      target.appendChild(wrap);
    }
  }

  // ─── Init ────────────────────────────────────────────────────────────────────
  function init() {
    injectButton();
    var lang = 'zh';
    try { lang = localStorage.getItem('lang') || 'zh'; } catch (e) {}
    if (lang === 'en') applyLang('en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Sync across tabs
  window.addEventListener('storage', function (e) {
    if (e.key === 'lang') applyLang(e.newValue || 'zh');
  });
})();
