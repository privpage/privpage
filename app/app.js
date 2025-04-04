/**
 * 主应用入口文件
 */

// 导入其他模块
import { initDateTime } from './time.js';
import { initSearch } from './search.js';
import { initSidebar } from './sidebar.js';
import { initLinks, importFromBrowser, importFromJSON } from './mainlink.js';
import { initTheme, showThemeSelector } from './theme.js';
import { initUserConfig } from './user.js';

// 更新版权年份
function updateCopyrightYear() {
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// 创建确认对话框
function createConfirmDialog(title, message, onConfirm) {
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'confirm-dialog-overlay';
  document.body.appendChild(overlay);
  
  // 创建对话框
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
  const dialogTitle = document.createElement('div');
  dialogTitle.className = 'confirm-dialog-title';
  dialogTitle.textContent = title;
  
  const dialogMessage = document.createElement('div');
  dialogMessage.className = 'confirm-dialog-message';
  dialogMessage.textContent = message;
  
  const dialogButtons = document.createElement('div');
  dialogButtons.className = 'confirm-dialog-buttons';
  
  const cancelButton = document.createElement('button');
  cancelButton.className = 'confirm-dialog-button confirm-dialog-cancel';
  cancelButton.textContent = '取消';
  
  const confirmButton = document.createElement('button');
  confirmButton.className = 'confirm-dialog-button confirm-dialog-confirm';
  confirmButton.textContent = '确认';
  
  // 添加事件
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  });
  
  confirmButton.addEventListener('click', () => {
    onConfirm();
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  });
  
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  });
  
  // 组装对话框
  dialogButtons.appendChild(cancelButton);
  dialogButtons.appendChild(confirmButton);
  
  dialog.appendChild(dialogTitle);
  dialog.appendChild(dialogMessage);
  dialog.appendChild(dialogButtons);
  
  document.body.appendChild(dialog);
}

// 清除本地数据
function clearLocalData() {
  createConfirmDialog(
    '清除本地数据',
    '确定要清除所有本地存储的数据吗？这将删除所有自定义链接、设置和缓存，此操作不可撤销。',
    () => {
      // 记录清除前的数据
      const allKeys = [...Object.keys(localStorage)];
      console.log('清除前的localStorage数据:', allKeys);
      
      try {
        // 先尝试一个一个地删除localStorage中的重要数据项
        const keysToDelete = [
          'links', 
          'userLinks', 
          'systemLinks', 
          'collapsedCategories', 
          'categoriesInitialized',
          'iconCache',
          'theme'
        ];
        keysToDelete.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`正在删除关键数据: ${key}`);
            localStorage.removeItem(key);
          }
        });
        
        // 再尝试删除所有剩余项
        allKeys.forEach(key => {
          if (!keysToDelete.includes(key) && localStorage.getItem(key)) {
            console.log(`正在删除其他数据: ${key}`);
            localStorage.removeItem(key);
          }
        });
        
        // 最后使用clear方法
        localStorage.clear();
        
        // 验证清除是否成功
        const remainingKeys = Object.keys(localStorage);
        console.log('清除后的localStorage数据:', remainingKeys);
        
        if (remainingKeys.length > 0) {
          console.error('警告: localStorage仍有残留项!', remainingKeys);
          // 记录剩余项的值，以便调试
          remainingKeys.forEach(key => {
            console.log(`残留项 ${key} 的值:`, localStorage.getItem(key));
          });
        } else {
          console.log('localStorage清除成功!');
        }
        
        // 清除sessionStorage中的数据
        const sessionKeys = [...Object.keys(sessionStorage)];
        sessionKeys.forEach(key => sessionStorage.removeItem(key));
        sessionStorage.clear();
        console.log('sessionStorage已清除');
        
        // 清除所有缓存
        clearCaches()
          .then(() => {
            // 完成所有清除操作后显示结果
            setTimeout(() => {
              // 显示成功消息并提示用户刷新页面
              const message = `所有本地数据已尝试清除（原有${allKeys.length}项）。\n\n点击确定后将重新加载页面。`;
              
              // 使用原生confirm来避免可能的自定义confirm函数冲突
              if (window.confirm(message)) {
                // 使用强制刷新，并添加时间戳参数避免缓存
                forceRefreshPage();
              }
            }, 300);
          });
        
      } catch (error) {
        console.error('清除数据时出错:', error);
        alert('清除数据时出错: ' + error.message);
      }
    }
  );
}

// 清除缓存
function clearCaches() {
  return new Promise((resolve) => {
    if (!window.caches) {
      console.log('此浏览器不支持Cache API');
      resolve();
      return;
    }
    
    console.log('开始清除caches...');
    caches.keys()
      .then(cacheNames => {
        if (cacheNames.length === 0) {
          console.log('没有找到缓存');
          resolve();
          return;
        }
        
        const deletePromises = cacheNames.map(cacheName => {
          return caches.delete(cacheName)
            .then(success => {
              console.log(`缓存 ${cacheName} 清除 ${success ? '成功' : '失败'}`);
              return success;
            });
        });
        
        Promise.all(deletePromises)
          .then(() => {
            console.log('所有缓存清除完成');
            resolve();
          })
          .catch(err => {
            console.error('清除缓存出错:', err);
            resolve(); // 即使出错也继续执行
          });
      })
      .catch(err => {
        console.error('获取缓存列表出错:', err);
        resolve(); // 即使出错也继续执行
      });
  });
}

// 强制刷新页面
function forceRefreshPage() {
  // 尝试多种方法强制刷新
  try {
    // 方法1: 使用reload(true)
    window.location.reload(true);
  } catch (e) {
    try {
      // 方法2: 使用带参数的URL
      const timestamp = new Date().getTime();
      if (window.location.href.indexOf('?') > -1) {
        window.location.href = window.location.href.split('?')[0] + '?t=' + timestamp;
      } else {
        window.location.href = window.location.href + '?t=' + timestamp;
      }
    } catch (e2) {
      // 方法3: 最基本的刷新
      window.location = window.location.href;
    }
  }
}

// 初始化应用
function initApp() {
  // 初始化时间和日期显示
  initDateTime();
  
  // 初始化搜索功能
  initSearch();
  
  // 初始化链接（先生成链接和分类）
  initLinks();
  
  // 初始化侧边栏（在链接生成后初始化，以确保分类可以正确折叠）
  initSidebar();
  
  // 初始化用户配置
  initUserConfig();
  
  // 更新版权年份
  updateCopyrightYear();
  
  // 添加导入书签按钮事件
  const importButton = document.getElementById('import-bookmarks');
  if (importButton) {
    importButton.addEventListener('click', importFromBrowser);
  }
  
  // 添加导入JSON按钮事件
  const importJsonButton = document.getElementById('import-json');
  if (importJsonButton) {
    importJsonButton.addEventListener('click', importFromJSON);
  }
  
  // 添加主题设置按钮事件
  const themeSettingsButton = document.getElementById('theme-settings');
  if (themeSettingsButton) {
    themeSettingsButton.addEventListener('click', showThemeSelector);
  }
  
  // 添加清除数据按钮事件
  const clearDataButton = document.getElementById('clear-data');
  if (clearDataButton) {
    clearDataButton.addEventListener('click', clearLocalData);
  }
  
  console.log('应用初始化完成');
}

// 当页面DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出函数，以便在其他模块中使用
export { initApp, clearLocalData }; 