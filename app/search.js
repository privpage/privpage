/**
 * 搜索引擎功能模块
 */

// 搜索引擎配置
const searchEngines = [
  {
    name: '百度',
    url: 'https://www.baidu.com/s?wd={query}',
    placeholder: '百度一下，你就知道'
  },
  {
    name: '谷歌',
    url: 'https://www.google.com/search?q={query}',
    placeholder: '搜索谷歌...'
  },
  {
    name: '必应',
    url: 'https://cn.bing.com/search?q={query}',
    placeholder: '搜索必应...'
  },
  {
    name: '知乎',
    url: 'https://www.zhihu.com/search?type=content&q={query}',
    placeholder: '搜索知乎...'
  }
];

let currentEngine = 0;

// 初始化搜索引擎
function initSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchEnginesContainer = document.getElementById('search-engines');
  
  // 初始化搜索引擎选项
  if (searchEnginesContainer) {
    // 先清空容器内容，避免重复添加
    searchEnginesContainer.innerHTML = '';
    
    searchEngines.forEach((engine, index) => {
      const engineElement = document.createElement('div');
      engineElement.className = `search-engine ${index === currentEngine ? 'active' : ''}`;
      engineElement.textContent = engine.name;
      engineElement.setAttribute('data-index', index);
      engineElement.addEventListener('click', () => {
        switchSearchEngine(index);
      });
      searchEnginesContainer.appendChild(engineElement);
    });
    
    console.log('搜索引擎选项已初始化，共添加', searchEngines.length, '个选项');
  }
  
  // 设置初始占位符
  if (searchInput) {
    searchInput.placeholder = searchEngines[currentEngine].placeholder;
  }
  
  // 搜索表单提交事件
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        search(query);
      }
    });
  }
  
  // 从本地存储恢复上次使用的搜索引擎
  const savedEngine = localStorage.getItem('searchEngine');
  if (savedEngine !== null) {
    switchSearchEngine(parseInt(savedEngine, 10));
  }
  
  console.log('搜索功能初始化完成，当前选中:', searchEngines[currentEngine].name);
}

// 切换搜索引擎
function switchSearchEngine(index) {
  // 确保索引有效
  if (index < 0 || index >= searchEngines.length) return;
  
  // 更新当前引擎
  currentEngine = index;
  
  // 更新 UI
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = searchEngines[currentEngine].placeholder;
  }
  
  // 更新搜索引擎选项的活动状态
  const engineElements = document.querySelectorAll('.search-engine');
  engineElements.forEach((element, i) => {
    if (i === currentEngine) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
  
  // 保存到本地存储
  localStorage.setItem('searchEngine', currentEngine.toString());
}

// 执行搜索
function search(query) {
  const engine = searchEngines[currentEngine];
  const searchUrl = engine.url.replace('{query}', encodeURIComponent(query));
  window.open(searchUrl, '_blank');
}

// 导出函数，以便在其他模块中使用
export { initSearch, switchSearchEngine, search }; 