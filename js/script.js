console.log("Lecture Feedback System geladen.");

(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function updateIcon(theme) {
    const iconElement = document.getElementById('theme-icon');
    if (iconElement) {
        iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    updateIcon(activeTheme);
});

// دالة لحفظ الكورس والانتقال (تستخدم في صفحة auswaehlen.html)
function saveCourseAndRedirect() {
    const inputElement = document.getElementById('kurs-auswahl');
    const selectedCourse = inputElement.value;

    // التأكد من أن المستخدم أدخل شيئاً
    if (selectedCourse.trim() !== "") {
        // حفظ الاسم في ذاكرة المتصفح
        localStorage.setItem('currentCourseName', selectedCourse);
        // الانتقال للصفحة التالية
        location.href = 'dashboard.html';
    } else {
        alert("Bitte wählen Sie zuerst einen Kurs aus!"); // تنبيه إذا كان الحقل فارغاً
    }
}

// دالة لجلب الاسم وعرضه (تعمل تلقائياً عند فتح dashboard.html)
document.addEventListener('DOMContentLoaded', () => {
    // التحقق أولاً من كود الثيم الموجود سابقاً...
    
    // الكود الجديد: البحث عن عنصر العنوان
    const titleElement = document.getElementById('course-title');
    
    // إذا وجدنا العنصر (يعني نحن في صفحة الداشبورد)
    if (titleElement) {
        // جلب الاسم من الذاكرة
        const savedCourse = localStorage.getItem('currentCourseName');
        
        // إذا كان هناك اسم محفوظ، نعرضه
        if (savedCourse) {
            titleElement.textContent = savedCourse + " - Dashboard";
        }
    }
    
    // تحديث مسار الرابط العلوي (اختياري لجمالية أكثر)
    const urlDisplay = document.querySelector('.url-display');
    if (urlDisplay && localStorage.getItem('currentCourseName')) {
        urlDisplay.textContent = `.../KursAuswaehlen/${localStorage.getItem('currentCourseName')}/Dashboard`;
    }
});
