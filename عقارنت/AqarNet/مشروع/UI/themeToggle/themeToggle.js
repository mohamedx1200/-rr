// دالة لتطبيق الوضع
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('selectedTheme');

  if (savedTheme) {
    // إذا فيه قيمة محفوظة نطبقها
    applyTheme(savedTheme);
  } else {
    // إذا مافيش → نستعمل الوضع الافتراضي للجهاز
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  
  // عند الضغط على الزر
  const themeToggleBtn = document.getElementById('themeToggle');
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    const selectedTheme = isDark ? 'light' : 'dark';

    // حفظ الاختيار في LocalStorage
    localStorage.setItem('selectedTheme', selectedTheme);

    // تطبيق الوضع الجديد
    applyTheme(selectedTheme);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const toggleText = document.querySelector('.toggle-text');
  
  // التحقق من التفضيل المحفوظ
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleText.textContent = 'الوضع الليلي';
  }
  
  themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
      toggleText.textContent = 'الوضع الليلي';
    } else {
      localStorage.setItem('darkMode', null);
      toggleText.textContent = 'الوضع النهاري';
    }
  });
});