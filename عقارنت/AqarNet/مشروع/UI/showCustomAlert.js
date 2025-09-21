export function showCustomAlert(message, color = '#f44336') {
  const alertBox = document.getElementById('customAlert');
  const alertText = document.getElementById('customAlertText');

  if (!alertBox || !alertText) {
    console.error("❌ عناصر التنبيه غير موجودة في HTML");
    return;
  }

  alertText.textContent = message;
  alertBox.style.backgroundColor = color;
  alertBox.style.display = 'block';

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 5000); // مدة الظهور 5 ثواني
}