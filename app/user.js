/**
 * 用户配置模块
 */

// 用户默认配置
const DEFAULT_USER = {
  name: '天宫起始页',
  description: 'v1.0.0 beta'
};

// 获取用户配置
function getUserConfig() {
  const savedConfig = localStorage.getItem('userConfig');
  if (savedConfig) {
    return JSON.parse(savedConfig);
  }
  return DEFAULT_USER;
}

// 保存用户配置
function saveUserConfig(config) {
  localStorage.setItem('userConfig', JSON.stringify(config));
}

// 更新用户界面
function updateUserUI() {
  const userConfig = getUserConfig();
  
  // 更新用户名称
  const userNameElement = document.querySelector('.user-info h3');
  if (userNameElement) {
    userNameElement.textContent = userConfig.name;
  }
  
  // 更新用户描述
  const userDescElement = document.querySelector('.user-info p');
  if (userDescElement) {
    userDescElement.textContent = userConfig.description;
  }
}

// 显示用户名称编辑界面
function showUserNameEdit() {
  const userConfig = getUserConfig();
  const userInfoElement = document.querySelector('.user-info');
  
  if (!userInfoElement) return;
  
  // 检查是否已经显示编辑界面
  if (document.querySelector('.user-name-edit')) return;
  
  // 创建编辑界面
  const editContainer = document.createElement('div');
  editContainer.className = 'user-name-edit';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = userConfig.name;
  nameInput.placeholder = '输入用户名称';
  
  const saveButton = document.createElement('button');
  saveButton.textContent = '保存';
  saveButton.addEventListener('click', () => {
    const newName = nameInput.value.trim();
    if (newName) {
      userConfig.name = newName;
      saveUserConfig(userConfig);
      updateUserUI();
      editContainer.remove();
    }
  });
  
  editContainer.appendChild(nameInput);
  editContainer.appendChild(saveButton);
  userInfoElement.appendChild(editContainer);
  
  // 自动聚焦输入框
  nameInput.focus();
}

// 初始化用户配置
function initUserConfig() {
  // 更新用户界面
  updateUserUI();
  
  // 添加点击事件，点击用户名称显示编辑界面
  const userNameElement = document.querySelector('.user-info h3');
  if (userNameElement) {
    userNameElement.addEventListener('click', showUserNameEdit);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initUserConfig);

// 导出函数，以便在其他模块中使用
export { getUserConfig, saveUserConfig, updateUserUI, initUserConfig }; 