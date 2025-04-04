/**
 * 更新时间和日期显示
 */
function updateDateTime() {
  const now = new Date();
  
  // 更新时间
  const timeElement = document.getElementById('time');
  if (timeElement) {
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  // 更新日期
  const dateElement = document.getElementById('date');
  if (dateElement) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    dateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
  }
}

// 初始化时间和日期
function initDateTime() {
  updateDateTime();
  // 每秒更新一次
  setInterval(updateDateTime, 1000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initDateTime);

// 导出函数，以便在其他模块中使用
export { updateDateTime, initDateTime }; 