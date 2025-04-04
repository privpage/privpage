/**
 * 侧边栏功能模块
 */

// 切换侧边栏状态
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    // 添加或移除body的sidebar-open类
    document.body.classList.toggle('sidebar-open');
    
    // 切换菜单图标
    const menuButton = document.getElementById('menu-toggle');
    if (menuButton) {
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        menuButton.innerHTML = `<svg t="1742896814308" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3616" width="24" height="24"><path d="M874.666667 800H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM149.333333 224h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32zM149.333333 544h512c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32z" p-id="3617"></path><path d="M748.8 339.2c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l125.866667 125.866667-125.866667 125.866666c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533334s17.066667-2.133333 23.466666-8.533334l149.333334-149.333333c12.8-12.8 12.8-32 0-44.8l-151.466667-147.2z" p-id="3618"></path></svg>`;
      } else {
        menuButton.innerHTML = `<svg t="1742896762053" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3405" width="24" height="24"><path d="M874.666667 800H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM149.333333 224h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32zM341.333333 480c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h512c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H341.333333z" p-id="3406"></path><path d="M275.2 684.8c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-128-128 125.866667-125.866667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-149.333333 149.333334c-12.8 12.8-12.8 32 0 44.8l149.333333 149.333333z" p-id="3407"></path></svg>`;
      }
    }
  }
}

// 关闭侧边栏
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    // 移除body的sidebar-open类
    document.body.classList.remove('sidebar-open');
    
    // 更新菜单图标
    const menuButton = document.getElementById('menu-toggle');
    if (menuButton) {
      menuButton.innerHTML = `<svg t="1742896762053" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3405" width="24" height="24"><path d="M874.666667 800H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM149.333333 224h725.333334c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32zM341.333333 480c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h512c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H341.333333z" p-id="3406"></path><path d="M275.2 684.8c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-128-128 125.866667-125.866667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-149.333333 149.333334c-12.8 12.8-12.8 32 0 44.8l149.333333 149.333333z" p-id="3407"></path></svg>`;
    }
  }
}

// 折叠/展开分类
function toggleCategory(el) {
  if (el) {
    el.classList.toggle('collapsed');
    const categoryLinks = el.nextElementSibling;
    if (categoryLinks) {
      categoryLinks.classList.toggle('collapsed');
    }
    
    // 保存分类的折叠状态到localStorage
    const categoryName = el.closest('.category')?.dataset.category;
    if (categoryName) {
      const collapsedCategories = JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
      const isCollapsed = el.classList.contains('collapsed');
      
      if (isCollapsed && !collapsedCategories.includes(categoryName)) {
        // 添加到已折叠列表
        collapsedCategories.push(categoryName);
      } else if (!isCollapsed && collapsedCategories.includes(categoryName)) {
        // 从已折叠列表中移除
        const index = collapsedCategories.indexOf(categoryName);
        collapsedCategories.splice(index, 1);
      }
      
      localStorage.setItem('collapsedCategories', JSON.stringify(collapsedCategories));
    }
  }
}

// 使toggleCategory在全局可用，以便从mainlink.js中调用
window.toggleCategory = toggleCategory;

// 搜索侧边栏链接
function searchSidebarLinks(query) {
  if (!query) {
    // 如果查询为空，清除所有高亮
    const highlightedLinks = document.querySelectorAll('.sidebar-link.highlight');
    highlightedLinks.forEach(link => {
      link.classList.remove('highlight');
    });
    
    // 恢复所有分类的折叠状态
    const collapsedCategories = JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      const categoryName = category.dataset.category;
      if (categoryName) {
        const shouldBeCollapsed = collapsedCategories.includes(categoryName);
        
        const categoryTitle = category.querySelector('.category-title');
        const categoryLinks = category.querySelector('.category-links');
        
        if (categoryTitle && categoryLinks) {
          // 根据存储的状态设置折叠
          if (shouldBeCollapsed) {
            categoryTitle.classList.add('collapsed');
            categoryLinks.classList.add('collapsed');
          } else {
            categoryTitle.classList.remove('collapsed');
            categoryLinks.classList.remove('collapsed');
          }
        }
      }
    });
    
    return;
  }
  
  query = query.toLowerCase();
  let found = false;
  
  // 搜索所有链接
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    const linkText = link.textContent.toLowerCase();
    const linkUrl = link.href.toLowerCase();
    const linkTitle = (link.title || '').toLowerCase();
    
    if (linkText.includes(query) || linkUrl.includes(query) || linkTitle.includes(query)) {
      link.classList.add('highlight');
      
      // 确保该链接所在的分类是展开的
      const categoryLinks = link.closest('.category-links');
      if (categoryLinks && categoryLinks.classList.contains('collapsed')) {
        const categoryTitle = categoryLinks.previousElementSibling;
        if (categoryTitle) {
          // 临时展开，不保存状态
          categoryTitle.classList.remove('collapsed');
          categoryLinks.classList.remove('collapsed');
        }
      }
      
      // 滚动到匹配的链接
      setTimeout(() => {
        link.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
      found = true;
    } else {
      link.classList.remove('highlight');
    }
  });
  
  // 如果没有找到匹配项，可以添加一个提示
  if (!found) {
    console.log('未找到匹配的链接');
  }
  
  return found;
}

// 初始化侧边栏
function initSidebar() {
  // 点击菜单按钮切换侧边栏
  const menuButton = document.getElementById('menu-toggle');
  if (menuButton) {
    menuButton.addEventListener('click', toggleSidebar);
  }
  
  // 点击遮罩层关闭侧边栏
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // 注意: 分类标题的点击事件现在在renderSidebarLinks中处理
  
  // 初始检查localStorage中的collapsedCategories
  // 如果不存在，则创建一个空数组，表示默认所有分类都是展开的
  if (!localStorage.getItem('collapsedCategories')) {
    localStorage.setItem('collapsedCategories', JSON.stringify([]));
  }
  
  // 添加侧边栏搜索功能
  const searchInput = document.getElementById('sidebar-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchSidebarLinks(e.target.value.trim());
    });
    
    // 添加按下 ESC 键清除搜索的功能
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchSidebarLinks('');
      }
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initSidebar);

// 导出函数，以便在其他模块中使用
export { toggleSidebar, closeSidebar, toggleCategory, searchSidebarLinks, initSidebar }; 