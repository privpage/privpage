/**
 * 主题切换功能模块
 */

// 获取当前主题
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// 设置主题
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    updateThemeIcon(false);
  }
}

// 更新主题图标
function updateThemeIcon(isDark) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    if (isDark) {
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

// 切换主题
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// 显示主题选择提示框
function showThemeSelector() {
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'theme-selector-overlay';
  document.body.appendChild(overlay);
  
  // 创建提示框
  const dialog = document.createElement('div');
  dialog.className = 'theme-selector-dialog';
  
  // 创建标题
  const title = document.createElement('h3');
  title.className = 'theme-selector-title';
  title.textContent = '选择您喜欢的主题';
  
  // 创建说明文本
  const description = document.createElement('p');
  description.className = 'theme-selector-description';
  description.textContent = '您可以随时通过右下角的按钮切换主题。';
  
  // 创建选项容器
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'theme-selector-options';
  
  // 创建亮色主题选项
  const lightOption = document.createElement('div');
  lightOption.className = 'theme-option light-option';
  lightOption.innerHTML = `
    <div class="theme-preview light-preview">
      <div class="preview-header"></div>
      <div class="preview-content">
        <div class="preview-circle"></div>
        <div class="preview-lines">
          <div class="preview-line"></div>
          <div class="preview-line"></div>
        </div>
      </div>
    </div>
    <div class="theme-name">亮色主题</div>
  `;
  
  // 创建暗色主题选项
  const darkOption = document.createElement('div');
  darkOption.className = 'theme-option dark-option';
  darkOption.innerHTML = `
    <div class="theme-preview dark-preview">
      <div class="preview-header"></div>
      <div class="preview-content">
        <div class="preview-circle"></div>
        <div class="preview-lines">
          <div class="preview-line"></div>
          <div class="preview-line"></div>
        </div>
      </div>
    </div>
    <div class="theme-name">暗色主题</div>
  `;
  
  // 添加点击事件
  lightOption.addEventListener('click', () => {
    setTheme('light');
    localStorage.setItem('themeSelected', 'true');
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  });
  
  darkOption.addEventListener('click', () => {
    setTheme('dark');
    localStorage.setItem('themeSelected', 'true');
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  });
  
  // 组装对话框
  optionsContainer.appendChild(lightOption);
  optionsContainer.appendChild(darkOption);
  dialog.appendChild(title);
  dialog.appendChild(description);
  dialog.appendChild(optionsContainer);
  document.body.appendChild(dialog);
  
  // 防止点击遮罩层关闭
  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    // 不做任何操作，强制用户选择一个主题
  });
}

// 初始化主题
function initTheme() {
  // 检查是否是首次访问（是否已经选择过主题）
  const hasSelectedTheme = localStorage.getItem('themeSelected');
  
  if (!hasSelectedTheme) {
    // 首次访问，显示主题选择提示框
    showThemeSelector();
  } else {
    // 从本地存储中读取主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 如果存在主题设置，则应用该主题
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 否则，检查系统偏好
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (prefersDarkScheme.matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }
  
  // 添加主题切换按钮的事件监听器
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initTheme);

// 导出函数，以便在其他模块中使用
export { getCurrentTheme, setTheme, toggleTheme, initTheme, showThemeSelector };