/**
 * 主页链接模块
 */

// 默认图标
const DEFAULT_ICON = './icons/defaultfavicon.svg';

// 图标URL缓存
const iconCache = {};

// 缓存图标URL，避免重复请求
function cacheIconUrl(domain, url) {
  if (domain && url && url !== DEFAULT_ICON) {
    iconCache[domain] = url;
    // 将缓存保存到localStorage，这样页面刷新后仍可使用
    try {
      const savedCache = JSON.parse(localStorage.getItem('iconCache') || '{}');
      savedCache[domain] = url;
      localStorage.setItem('iconCache', JSON.stringify(savedCache));
    } catch (error) {
      console.error('保存图标缓存失败:', error);
    }
  }
}

// 从缓存中获取图标URL
function getIconFromCache(domain) {
  // 首先从内存缓存中检查
  if (iconCache[domain]) {
    return iconCache[domain];
  }
  
  // 如果内存中没有，则从localStorage中检查
  try {
    const savedCache = JSON.parse(localStorage.getItem('iconCache') || '{}');
    if (savedCache[domain]) {
      // 将URL恢复到内存缓存中
      iconCache[domain] = savedCache[domain];
      return savedCache[domain];
    }
  } catch (error) {
    console.error('读取图标缓存失败:', error);
  }
  
  return null;
}

// 从JSON文件获取链接数据
async function fetchLinks() {
  try {
    // 先检查是否可以访问localStorage
    try {
      localStorage.getItem('test');
    } catch (e) {
      console.error('无法访问localStorage:', e);
      // 如果无法访问localStorage，直接从JSON文件获取
      const response = await fetch('./links.json');
      const links = await response.json();
      console.log(`无法使用localStorage，直接从JSON文件加载了 ${links.length} 条链接`);
      return links;
    }

    // 尝试从localStorage获取links
    const cachedLinks = localStorage.getItem('links');
    if (cachedLinks) {
      console.log('从localStorage获取links数据');
      try {
        const parsedLinks = JSON.parse(cachedLinks);
        console.log(`从localStorage加载了 ${parsedLinks.length} 条链接`);
        return parsedLinks;
      } catch (parseError) {
        console.error('解析localStorage中的links数据出错:', parseError);
        // 如果解析出错，清除损坏的数据
        localStorage.removeItem('links');
        // 将继续加载JSON文件
      }
    }
    
    // 如果没有缓存或缓存损坏，从JSON文件获取
    console.log('从JSON文件获取links数据');
    const response = await fetch('./links.json');
    if (!response.ok) {
      throw new Error(`获取links.json时出错: ${response.status} ${response.statusText}`);
    }
    
    const links = await response.json();
    console.log(`成功从JSON文件加载了 ${links.length} 条链接`);
    
    // 将数据保存到localStorage以便下次使用
    try {
      if (links && links.length > 0) {
        localStorage.removeItem('links'); // 先清除，确保没有残留的数据
        localStorage.setItem('links', JSON.stringify(links));
        console.log('links数据已保存到localStorage，大小:', JSON.stringify(links).length, '字节');
        
        // 验证是否正确存储
        const verifyLinks = localStorage.getItem('links');
        if (verifyLinks) {
          const verifiedData = JSON.parse(verifyLinks);
          console.log('验证: 已在localStorage中存储了', verifiedData.length, '条链接');
        } else {
          console.error('验证失败: localStorage中未找到links数据');
        }
      } else {
        console.warn('未保存空链接数据到localStorage');
      }
    } catch (storageError) {
      console.error('保存links数据到localStorage时出错:', storageError);
      // 继续返回数据，即使保存失败
    }
    
    return links;
  } catch (error) {
    console.error('获取链接数据时出错:', error);
    // 返回空数组，避免应用崩溃
    return [];
  }
}

// 从JSON文件获取用户自定义链接数据
async function fetchUserLinks() {
  try {
    // 先检查是否可以访问localStorage
    try {
      localStorage.getItem('test');
    } catch (e) {
      console.error('无法访问localStorage:', e);
      // 如果无法访问localStorage，直接从JSON文件获取
      const response = await fetch('./userlink.json');
      const userLinks = await response.json();
      console.log(`无法使用localStorage，直接从JSON文件加载了 ${userLinks.length} 条用户链接`);
      return userLinks;
    }

    // 尝试从localStorage获取userLinks
    const cachedUserLinks = localStorage.getItem('userLinks');
    if (cachedUserLinks) {
      console.log('从localStorage获取userLinks数据');
      try {
        const parsedUserLinks = JSON.parse(cachedUserLinks);
        console.log(`从localStorage加载了 ${parsedUserLinks.length} 条用户链接`);
        return parsedUserLinks;
      } catch (parseError) {
        console.error('解析localStorage中的userLinks数据出错:', parseError);
        // 如果解析出错，清除损坏的数据
        localStorage.removeItem('userLinks');
        // 将继续加载JSON文件
      }
    }
    
    // 如果没有缓存或缓存损坏，从JSON文件获取
    console.log('从JSON文件获取userLinks数据');
    const response = await fetch('./userlink.json');
    if (!response.ok) {
      throw new Error(`获取userlink.json时出错: ${response.status} ${response.statusText}`);
    }
    
    const userLinks = await response.json();
    console.log(`成功从JSON文件加载了 ${userLinks.length} 条用户链接`);
    
    // 将数据保存到localStorage以便下次使用
    try {
      if (userLinks && Array.isArray(userLinks)) {
        localStorage.removeItem('userLinks'); // 先清除，确保没有残留的数据
        localStorage.setItem('userLinks', JSON.stringify(userLinks));
        console.log('userLinks数据已保存到localStorage，大小:', JSON.stringify(userLinks).length, '字节');
        
        // 验证是否正确存储
        const verifyLinks = localStorage.getItem('userLinks');
        if (verifyLinks) {
          const verifiedData = JSON.parse(verifyLinks);
          console.log('验证: 已在localStorage中存储了', verifiedData.length, '条用户链接');
        } else {
          console.error('验证失败: localStorage中未找到userLinks数据');
        }
      } else {
        console.warn('未保存无效的用户链接数据到localStorage');
      }
    } catch (storageError) {
      console.error('保存userLinks数据到localStorage时出错:', storageError);
      // 继续返回数据，即使保存失败
    }
    
    return userLinks;
  } catch (error) {
    console.error('获取用户链接数据时出错:', error);
    // 返回空数组，避免应用崩溃
    return [];
  }
}

// 获取网站图标
async function getFavicon(url) {
  try {
    if (!url) return DEFAULT_ICON;
    
    // 从URL中提取域名
    const domain = new URL(url).hostname;
    
    // 检查是否已存在缓存
    const cachedIcon = getIconFromCache(domain);
    if (cachedIcon) {
      console.log(`使用缓存的图标: ${domain}`);
      return cachedIcon;
    }
    
    // 创建一个Promise，用于检测图片是否可以成功加载
    const tryLoadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
        // 设置3秒超时
        setTimeout(() => reject(new Error('Timeout')), 3000);
      });
    };
    
    // 尝试多种favicon获取方式
    try {
      // 1. 首先尝试获取标准ico格式
      const icoUrl = `https://${domain}/favicon.ico`;
      const iconUrl = await tryLoadImage(icoUrl);
      // 缓存成功获取的图标URL
      cacheIconUrl(domain, iconUrl);
      return iconUrl;
    } catch (error) {
      console.log(`尝试加载ico失败: ${domain}`);
      
      try {
        // 2. 尝试获取png格式
        const pngUrl = `https://${domain}/favicon.png`;
        const iconUrl = await tryLoadImage(pngUrl);
        // 缓存成功获取的图标URL
        cacheIconUrl(domain, iconUrl);
        return iconUrl;
      } catch (error) {
        console.log(`尝试加载png失败: ${domain}`);
        
        try {
          // 3. 尝试使用API获取
          const apiUrl = `https://www.favicon.vip/get.php?url=${domain}`;
          const iconUrl = await tryLoadImage(apiUrl);
          // 缓存成功获取的图标URL
          cacheIconUrl(domain, iconUrl);
          return iconUrl;
        } catch (error) {
          console.log(`所有方法均失败: ${domain}，使用默认图标`);
          return DEFAULT_ICON;
        }
      }
    }
  } catch (error) {
    console.error('获取favicon时出错:', error);
    return DEFAULT_ICON;
  }
}

// 创建主页链接元素
function createLinkElement(link) {
  const linkCard = document.createElement('a');
  linkCard.href = link.url;
  linkCard.className = 'link-card';
  linkCard.target = '_blank';
  linkCard.title = link.description || link.name;
  
  const icon = document.createElement('img');
  icon.className = 'link-icon';
  
  // 如果已有图标，直接使用，否则设置默认图标并异步加载
  if (link.icon) {
    icon.src = link.icon;
  } else {
    icon.src = DEFAULT_ICON;
    // 异步获取图标
    getFavicon(link.url).then(iconUrl => {
      icon.src = iconUrl;
      // 更新链接对象中的图标URL
      link.icon = iconUrl;
      
      // 更新localStorage中的链接数据
      if (iconUrl !== DEFAULT_ICON) {
        updateLinkIconInStorage(link);
      }
    }).catch(() => {
      icon.src = DEFAULT_ICON;
    });
  }
  
  icon.alt = link.name;
  icon.onerror = () => {
    icon.src = DEFAULT_ICON;
  };
  
  const name = document.createElement('div');
  name.className = 'link-name';
  name.textContent = link.name;
  
  linkCard.appendChild(icon);
  linkCard.appendChild(name);
  
  return linkCard;
}

// 更新localStorage中链接的图标URL
function updateLinkIconInStorage(updatedLink) {
  try {
    // 更新系统链接
    let links = JSON.parse(localStorage.getItem('links') || '[]');
    let linkUpdated = false;
    
    for (let i = 0; i < links.length; i++) {
      if (links[i].url === updatedLink.url) {
        links[i].icon = updatedLink.icon;
        linkUpdated = true;
        break;
      }
    }
    
    if (linkUpdated) {
      localStorage.setItem('links', JSON.stringify(links));
    } else {
      // 尝试更新用户链接
      let userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
      let userLinkUpdated = false;
      
      for (let i = 0; i < userLinks.length; i++) {
        if (userLinks[i].url === updatedLink.url) {
          userLinks[i].icon = updatedLink.icon;
          userLinkUpdated = true;
          break;
        }
      }
      
      if (userLinkUpdated) {
        localStorage.setItem('userLinks', JSON.stringify(userLinks));
      }
    }
  } catch (error) {
    console.error('更新链接图标URL失败:', error);
  }
}

// 使用一个标志变量跟踪是否已经渲染过，避免重复渲染
let homeLinksRendered = false;

// 渲染主页链接
function renderHomeLinks() {
  console.log('开始渲染主页链接');
  
  const homeLinksContainer = document.getElementById('links-container');
  if (!homeLinksContainer) {
    console.error('未找到链接容器 links-container');
    return;
  }
  
  // 获取当前链接数量用于调试
  const currentLinks = homeLinksContainer.querySelectorAll('.link-card');
  console.log('渲染前链接容器中已有链接数量:', currentLinks.length);
  
  // 防止重复渲染
  if (homeLinksRendered && currentLinks.length > 0) {
    console.log('主页链接已经渲染过，跳过重复渲染');
    return;
  }
  
  // 清空容器
  homeLinksContainer.innerHTML = '';
  
  // 获取应该显示在主页的链接
  let links = JSON.parse(localStorage.getItem('links') || '[]');
  let userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
  
  console.log('获取到系统链接数量:', links.length);
  console.log('获取到用户链接数量:', userLinks.length);
  
  // 使用Map进行去重，以URL为键
  // 优先显示用户自定义的链接
  const uniqueLinks = new Map();
  
  // 首先添加用户链接
  let userHomeLinks = 0;
  userLinks.forEach(link => {
    if (link.showOnHome) {
      uniqueLinks.set(link.url, link);
      userHomeLinks++;
    }
  });
  console.log('应显示在首页的用户链接数:', userHomeLinks);
  
  // 再添加系统链接，不覆盖已有的用户链接
  let systemHomeLinks = 0;
  links.forEach(link => {
    if (link.showOnHome && !uniqueLinks.has(link.url)) {
      uniqueLinks.set(link.url, link);
      systemHomeLinks++;
    }
  });
  console.log('应显示在首页的系统链接数:', systemHomeLinks);
  
  // 将Map转回数组
  const homeLinks = Array.from(uniqueLinks.values());
  
  // 限制显示链接数量
  const displayLinks = homeLinks.slice(0, 24);
  
  console.log('去重后的链接数量:', homeLinks.length);
  console.log('最终显示的链接数量:', displayLinks.length);
  
  // 只有在有链接要显示时才进行渲染
  if (displayLinks.length > 0) {
    // 渲染链接
    for (const link of displayLinks) {
      // 创建链接元素
      const linkElement = createLinkElement(link);
      homeLinksContainer.appendChild(linkElement);
    }
    
    // 标记已渲染
    homeLinksRendered = true;
  } else {
    console.warn('没有找到可显示在主页的链接');
  }
  
  const finalLinks = homeLinksContainer.querySelectorAll('.link-card');
  console.log('渲染后链接容器中的链接数量:', finalLinks.length);
}

// 按分类渲染侧边栏链接
function renderSidebarLinks() {
  const sidebar = document.getElementById('sidebar-categories');
  if (!sidebar) return;
  
  // 清空侧边栏分类区域
  sidebar.innerHTML = '';
  
  // 获取链接数据
  const links = JSON.parse(localStorage.getItem('links') || '[]');
  const userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
  
  // 合并链接数据
  const allLinks = [...links, ...userLinks];
  
  // 按分类分组链接
  const categories = {};
  allLinks.forEach(link => {
    const category = link.category || '未分类';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(link);
  });
  
  // 获取已保存的折叠状态
  const collapsedCategories = JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
  
  // 为每个分类创建一个部分
  for (const [category, categoryLinks] of Object.entries(categories)) {
    const categorySection = document.createElement('div');
    categorySection.className = 'category';
    categorySection.dataset.category = category; // 添加分类名称作为数据属性
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.innerHTML = `${category} <span class="arrow">▼</span>`;
    
    const categoryLinksContainer = document.createElement('div');
    categoryLinksContainer.className = 'category-links';
    
    // 为每个分类中的链接创建元素
    for (const link of categoryLinks) {
      // 创建链接元素
      const linkElement = document.createElement('a');
      linkElement.className = 'sidebar-link';
      linkElement.href = link.url;
      linkElement.target = '_blank';
      linkElement.title = link.description || link.name;
      
      const icon = document.createElement('img');
      // 如果已有图标，直接使用，否则设置默认图标并异步加载
      if (link.icon) {
        icon.src = link.icon;
      } else {
        icon.src = DEFAULT_ICON;
        // 异步获取图标
        getFavicon(link.url).then(iconUrl => {
          icon.src = iconUrl;
          // 更新链接对象中的图标URL，以便保存状态
          link.icon = iconUrl;
          
          // 更新本地存储中的链接数据
          if (iconUrl !== DEFAULT_ICON) {
            updateLinkIconInStorage(link);
          }
        }).catch(() => {
          icon.src = DEFAULT_ICON;
        });
      }
      
      icon.alt = link.name;
      icon.onerror = () => {
        icon.src = DEFAULT_ICON;
      };
      
      const name = document.createElement('span');
      name.className = 'link-text';
      name.textContent = link.name;
      
      linkElement.appendChild(icon);
      linkElement.appendChild(name);
      
      categoryLinksContainer.appendChild(linkElement);
    }
    
    categorySection.appendChild(categoryTitle);
    categorySection.appendChild(categoryLinksContainer);
    sidebar.appendChild(categorySection);
    
    // 检查是否应该折叠
    if (collapsedCategories.includes(category)) {
      categoryTitle.classList.add('collapsed');
      categoryLinksContainer.classList.add('collapsed');
    }
  }
  
  // 重新绑定点击事件
  const categoryTitles = sidebar.querySelectorAll('.category-title');
  categoryTitles.forEach(title => {
    // 移除可能存在的旧事件监听器 (使用新函数避免重复绑定)
    title.removeEventListener('click', titleClickHandler);
    // 添加新的事件监听器
    title.addEventListener('click', titleClickHandler);
  });
}

// 点击分类标题的事件处理函数
function titleClickHandler() {
  // 调用sidebar.js中的toggleCategory函数
  if (typeof window.toggleCategory === 'function') {
    window.toggleCategory(this);
  } else if (typeof toggleCategory === 'function') {
    toggleCategory(this);
  }
}

// 保存链接到localStorage
function saveLinks(links) {
  localStorage.setItem('links', JSON.stringify(links));
}

// 保存用户链接到localStorage
function saveUserLinks(userLinks) {
  localStorage.setItem('userLinks', JSON.stringify(userLinks));
}

// 添加新链接
function addLink(link, isUserLink = true) {
  if (isUserLink) {
    const userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
    userLinks.push(link);
    saveUserLinks(userLinks);
  } else {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    links.push(link);
    saveLinks(links);
  }
  
  // 刷新显示
  renderHomeLinks();
  renderSidebarLinks();
}

// 编辑链接
function editLink(index, updatedLink, isUserLink = true) {
  if (isUserLink) {
    const userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
    if (index >= 0 && index < userLinks.length) {
      userLinks[index] = updatedLink;
      saveUserLinks(userLinks);
    }
  } else {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    if (index >= 0 && index < links.length) {
      links[index] = updatedLink;
      saveLinks(links);
    }
  }
  
  // 刷新显示
  renderHomeLinks();
  renderSidebarLinks();
}

// 删除链接
function deleteLink(index, isUserLink = true) {
  if (isUserLink) {
    const userLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
    if (index >= 0 && index < userLinks.length) {
      userLinks.splice(index, 1);
      saveUserLinks(userLinks);
    }
  } else {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    if (index >= 0 && index < links.length) {
      links.splice(index, 1);
      saveLinks(links);
    }
  }
  
  // 刷新显示
  renderHomeLinks();
  renderSidebarLinks();
}

// 从浏览器导入书签
function importFromBrowser() {
  // 创建文件输入元素
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.html';
  
  fileInput.addEventListener('change', async (e) => {
    if (!e.target.files.length) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        // 获取所有书签链接
        const bookmarks = [];
        const links = doc.querySelectorAll('a');
        
        // 获取现有链接
        const userLinks = JSON.parse(localStorage.getItem('userLinks')) || [];
        const systemLinks = JSON.parse(localStorage.getItem('systemLinks')) || [];
        
        // 创建一个包含所有现有URL的集合，用于快速查重
        const existingUrls = new Set();
        userLinks.forEach(link => existingUrls.add(link.url));
        systemLinks.forEach(link => existingUrls.add(link.url));
        
        // 重复计数
        let duplicateCount = 0;
        
        // 添加日期前缀的文件夹名称
        const now = new Date();
        const datePrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        links.forEach(link => {
          const url = link.href;
          const name = link.textContent.trim();
          
          // 检查是否为有效URL
          if (url && url.startsWith('http') && name) {
            // 检查是否已存在
            if (existingUrls.has(url)) {
              duplicateCount++;
              return;
            }
            
            // 获取文件夹结构作为分类
            let category = '导入书签';
            let parent = link.closest('DL').previousElementSibling;
            if (parent && parent.tagName === 'H3') {
              category = `${datePrefix} - ${parent.textContent.trim()}`;
            }
            
            bookmarks.push({
              name,
              url,
              category,
              icon: '',
              description: '',
              showOnHome: false,
              timestamp: Date.now()
            });
            
            // 将URL添加到已存在集合中，防止同一批导入中的重复
            existingUrls.add(url);
          }
        });
        
        if (bookmarks.length > 0) {
          // 将导入的书签添加到用户链接中
          userLinks.push(...bookmarks);
          localStorage.setItem('userLinks', JSON.stringify(userLinks));
          
          // 生成导出文件名
          const filename = `bookmarks_import_${datePrefix}.json`;
          
          alert(`成功导入 ${bookmarks.length} 个书签，跳过 ${duplicateCount} 个重复书签。
您可以导出导入的书签为JSON文件。`);
          
          // 提供导出选项
          if (confirm('是否立即导出已导入的书签为JSON文件？')) {
            const json = JSON.stringify(bookmarks, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            
            URL.revokeObjectURL(url);
          }
          
          // 刷新显示
          renderSidebarLinks();
        } else {
          alert('未找到有效书签或所有书签已存在。');
        }
      } catch (error) {
        console.error('导入书签时出错:', error);
        alert('导入书签时出错: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  });
  
  fileInput.click();
}

// 从JSON导入链接
function importFromJSON() {
  // 创建文件输入元素
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  
  fileInput.addEventListener('change', (e) => {
    if (!e.target.files.length) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let importedLinks;
        
        try {
          importedLinks = JSON.parse(content);
          
          // 验证JSON格式
          if (!Array.isArray(importedLinks)) {
            throw new Error('导入的JSON不是有效的链接数组格式');
          }
        } catch (err) {
          alert('无法解析JSON文件: ' + err.message);
          return;
        }
        
        // 获取现有链接
        const userLinks = JSON.parse(localStorage.getItem('userLinks')) || [];
        const systemLinks = JSON.parse(localStorage.getItem('systemLinks')) || [];
        
        // 创建一个包含所有现有URL的集合
        const existingUrls = new Set();
        userLinks.forEach(link => existingUrls.add(link.url));
        systemLinks.forEach(link => existingUrls.add(link.url));
        
        // 询问是否更新已存在的链接
        const updateExisting = confirm("是否更新已存在的链接信息？点击\"确定\"更新，点击\"取消\"跳过重复链接。");
        
        let newCount = 0;
        let duplicateCount = 0;
        let updatedCount = 0;
        
        // 处理导入的链接
        importedLinks.forEach(link => {
          // 确保链接有所有必要的字段
          link = {
            name: link.name || '未命名',
            url: link.url || '',
            category: link.category || '导入链接',
            icon: link.icon || '',
            description: link.description || '',
            showOnHome: link.showOnHome || false,
            timestamp: link.timestamp || Date.now()
          };
          
          // 检查URL是否有效
          if (!link.url || !link.url.startsWith('http')) {
            console.warn('跳过无效URL:', link.url);
            return;
          }
          
          // 检查是否已存在
          if (existingUrls.has(link.url)) {
            if (updateExisting) {
              // 更新现有链接
              for (let i = 0; i < userLinks.length; i++) {
                if (userLinks[i].url === link.url) {
                  // 保留原始showOnHome状态
                  const showOnHome = userLinks[i].showOnHome;
                  userLinks[i] = { ...link, showOnHome };
                  updatedCount++;
                  return;
                }
              }
              
              // 如果在系统链接中
              for (let i = 0; i < systemLinks.length; i++) {
                if (systemLinks[i].url === link.url) {
                  // 将其添加到用户链接中（相当于覆盖系统链接）
                  const showOnHome = systemLinks[i].showOnHome;
                  userLinks.push({ ...link, showOnHome });
                  updatedCount++;
                  return;
                }
              }
            } else {
              duplicateCount++;
            }
          } else {
            // 添加新链接
            userLinks.push(link);
            existingUrls.add(link.url);
            newCount++;
          }
        });
        
        // 保存更新后的链接
        localStorage.setItem('userLinks', JSON.stringify(userLinks));
        
        // 刷新显示
        renderSidebarLinks();
        renderHomeLinks();
        
        // 显示导入结果
        alert(`导入完成！
新增: ${newCount} 个链接
更新: ${updatedCount} 个链接
跳过: ${duplicateCount} 个重复链接`);
        
      } catch (error) {
        console.error('导入JSON时出错:', error);
        alert('导入JSON时出错: ' + error.message);
      }
    };
    
    reader.readAsText(file);
  });
  
  fileInput.click();
}

// 初始化链接
function initLinks() {
  console.log('开始初始化链接');
  
  // 加载图标缓存
  try {
    const savedCache = JSON.parse(localStorage.getItem('iconCache') || '{}');
    Object.keys(savedCache).forEach(domain => {
      iconCache[domain] = savedCache[domain];
    });
    console.log(`已加载图标缓存，共${Object.keys(iconCache).length}个域名的图标`);
    
    // 清理图标缓存
    cleanIconCache(150); // 保留最近的150个图标
  } catch (error) {
    console.error('加载图标缓存失败:', error);
  }
  
  // 确保链接数据已加载
  Promise.all([fetchLinks(), fetchUserLinks()])
    .then(([links, userLinks]) => {
      // 保存到localStorage以便后续使用
      if (!localStorage.getItem('links')) {
        localStorage.setItem('links', JSON.stringify(links));
      }
      if (!localStorage.getItem('userLinks')) {
        localStorage.setItem('userLinks', JSON.stringify(userLinks));
      }
      
      // 渲染主页链接
      renderHomeLinks();
      
      // 渲染侧边栏链接
      renderSidebarLinks();
      
      // 设置默认所有分类都是折叠的
      ensureAllCategoriesCollapsed();
      
      console.log('链接初始化完成');
    })
    .catch(error => {
      console.error('初始化链接时出错:', error);
    });
}

// 确保所有分类默认为折叠状态
function ensureAllCategoriesCollapsed() {
  // 获取所有分类名称
  const categoryElements = document.querySelectorAll('.category');
  const allCategories = [];
  categoryElements.forEach(category => {
    const categoryName = category.dataset.category;
    if (categoryName) {
      allCategories.push(categoryName);
    }
  });
  
  // 读取当前已折叠的分类
  let collapsedCategories = JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
  
  // 第一次加载时，所有分类默认折叠
  if (!localStorage.getItem('categoriesInitialized')) {
    collapsedCategories = [...allCategories];
    localStorage.setItem('collapsedCategories', JSON.stringify(collapsedCategories));
    localStorage.setItem('categoriesInitialized', 'true');
    
    // 应用折叠状态到DOM
    categoryElements.forEach(category => {
      const categoryName = category.dataset.category;
      if (categoryName) {
        const title = category.querySelector('.category-title');
        const links = category.querySelector('.category-links');
        if (title && links) {
          title.classList.add('collapsed');
          links.classList.add('collapsed');
        }
      }
    });
  }
}

// 导出函数，以便在其他模块中使用
export { 
  fetchLinks, 
  fetchUserLinks, 
  renderHomeLinks, 
  renderSidebarLinks, 
  addLink, 
  editLink, 
  deleteLink, 
  importFromBrowser, 
  importFromJSON, 
  initLinks,
  getFavicon,
  cleanIconCache,
  titleClickHandler,
  ensureAllCategoriesCollapsed
};

// 切换链接在主页显示状态
function toggleShowOnHome(url) {
  // 辅助函数：在数组中更新链接
  function updateLinkInArray(links, url) {
    for (let i = 0; i < links.length; i++) {
      if (links[i].url === url) {
        links[i].showOnHome = !links[i].showOnHome;
        return {
          updated: true,
          isShowOnHome: links[i].showOnHome
        };
      }
    }
    return { updated: false };
  }

  // 首先检查用户链接
  let userLinks = JSON.parse(localStorage.getItem('userLinks')) || [];
  let result = updateLinkInArray(userLinks, url);
  
  if (result.updated) {
    localStorage.setItem('userLinks', JSON.stringify(userLinks));
    // 更新UI元素而不刷新整个侧边栏
    const toggleElement = document.querySelector(`.sidebar-link[href="${url}"] .home-toggle`);
    if (toggleElement) {
      toggleElement.classList.toggle('active', result.isShowOnHome);
      toggleElement.title = result.isShowOnHome ? '在主页显示 (点击切换)' : '不在主页显示 (点击切换)';
    }
    // 只更新主页链接
    renderHomeLinks();
    return;
  }
  
  // 如果用户链接中没有找到，检查系统链接
  let links = JSON.parse(localStorage.getItem('links')) || [];
  result = updateLinkInArray(links, url);
  
  if (result.updated) {
    localStorage.setItem('links', JSON.stringify(links));
    // 更新UI元素而不刷新整个侧边栏
    const toggleElement = document.querySelector(`.sidebar-link[href="${url}"] .home-toggle`);
    if (toggleElement) {
      toggleElement.classList.toggle('active', result.isShowOnHome);
      toggleElement.title = result.isShowOnHome ? '在主页显示 (点击切换)' : '不在主页显示 (点击切换)';
    }
    // 只更新主页链接
    renderHomeLinks();
  }
}

// 清理图标缓存，只保留最近使用的图标
function cleanIconCache(maxEntries = 100) {
  try {
    const savedCache = JSON.parse(localStorage.getItem('iconCache') || '{}');
    const entries = Object.entries(savedCache);
    
    // 如果缓存项超过最大限制，则只保留最近的maxEntries个
    if (entries.length > maxEntries) {
      console.log(`图标缓存过大(${entries.length}项)，清理至${maxEntries}项`);
      
      // 这里简单地保留最新的maxEntries个项，如果有需要可以改为基于使用频率的策略
      const newCache = Object.fromEntries(entries.slice(-maxEntries));
      
      // 更新缓存
      localStorage.setItem('iconCache', JSON.stringify(newCache));
      
      // 更新内存缓存
      Object.keys(iconCache).forEach(key => {
        if (!newCache[key]) {
          delete iconCache[key];
        }
      });
      
      console.log(`图标缓存已清理完成，当前缓存数量: ${Object.keys(newCache).length}`);
    }
  } catch (error) {
    console.error('清理图标缓存失败:', error);
  }
} 