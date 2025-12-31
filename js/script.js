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

function saveCourseAndRedirect() {
    const inputElement = document.getElementById('kurs-auswahl');
    const selectedCourse = inputElement.value;

    if (selectedCourse.trim() !== "") {
        localStorage.setItem('currentCourseName', selectedCourse);
        location.href = 'dashboard.html';
    } else {
        alert("Bitte wählen Sie zuerst einen Kurs aus!"); // تنبيه إذا كان الحقل فارغاً
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const titleElement = document.getElementById('course-title');
    
    if (titleElement) {
        const savedCourse = localStorage.getItem('currentCourseName');
        
        if (savedCourse) {
            titleElement.textContent = savedCourse + " - Dashboard";
        }
    }
    
    const urlDisplay = document.querySelector('.url-display');
    if (urlDisplay && localStorage.getItem('currentCourseName')) {
        urlDisplay.textContent = `.../KursAuswaehlen/${localStorage.getItem('currentCourseName')}/Dashboard`;
    }
});

/* =========================================
   (Simulated Backend)
   ========================================= */

// 1. (Dummy Data)
const courseData = {
    "Informatik": {
        tempo: 85,          // Sehr schnell
        understanding: 60,  // Durchschnittliches Verständnis des Schwierigkeitsgrades des Materials
        questions: [
            "Wie funktioniert Rekursion genau?",
            "Unterschied zwischen Stack und Heap?"
        ]
    },
    "HCI": {
        tempo: 45,          // Langsam/Gemütlich
        understanding: 90,  // hohes Verständnis
        questions: [
            "Was sind die 10 Heuristiken?",
            "Unterschied UI vs UX?"
        ]
    },
    "Mathematik": {
        tempo: 75,          // ziemlich schnell
        understanding: 40,  // Geringes Verständnis (schwieriges Material)
        questions: [
            "Beweis für Satz 3 nicht verstanden.",
            "Wie löst man das Integral?"
        ]
    }
};

// 2. Dashboard-Aktualisierungsfunktion
function updateDashboardStats() {
    const currentCourse = localStorage.getItem('currentCourseName');
    
    const tempoVal = document.getElementById('stat-tempo-val');
    const tempoBar = document.getElementById('stat-tempo-bar');
    
    const understandVal = document.getElementById('stat-understanding-val');
    const understandBar = document.getElementById('stat-understanding-bar');
    
    const questionsEl = document.getElementById('stat-questions');

    if (tempoVal && currentCourse && courseData[currentCourse]) {
        const data = courseData[currentCourse];

        tempoVal.textContent = data.tempo + "%";
        understandVal.textContent = data.understanding + "%";

        setTimeout(() => {
            tempoBar.style.width = data.tempo + "%";
            understandBar.style.width = data.understanding + "%";
        }, 100);

        if(data.tempo > 80) tempoBar.style.backgroundColor = "#e74c3c"; 
        else if(data.tempo < 50) tempoBar.style.backgroundColor = "#3498db"; 
        else tempoBar.style.backgroundColor = "#2ecc71"; 

        if(data.understanding < 50) understandBar.style.backgroundColor = "#e74c3c";
        else understandBar.style.backgroundColor = "#2ecc71";

        questionsEl.innerHTML = ""; 
        data.questions.forEach(question => {
            const div = document.createElement('div');
            div.className = 'question-card'; // كلاس التنسيق الجديد
            div.textContent = question;
            questionsEl.appendChild(div);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    updateDashboardStats();
});

function validateAndGenerate() {
    // 1. جلب حالة مربعات الاختيار الثلاثة الأساسية
    // ملاحظة: تأكد من إضافة id لهذه المربعات في الـ HTML إذا لم تكن موجودة
    // سأفترض أنك ستضيف ids كالتالي: check-tempo, check-verstaendnis, check-stimmung
    // إذا لم تستطع تعديل الـ HTML لإضافة IDs، يمكننا استخدام QuerySelector المتطور
    
    // سأستخدم هنا الطريقة الأكثر أماناً (البحث داخل الكلاس .option-row)
    const options = document.querySelectorAll('.option-row input[type="checkbox"]');
    
    // الـ options[0] هو Tempo
    // الـ options[1] هو Verständnis
    // الـ options[2] هو Stimmung
    
    const isTempoChecked = options[0].checked;
    const isVerstaendnisChecked = options[1].checked;
    const isStimmungChecked = options[2].checked;

    // 2. التحقق: هل تم اختيار واحد على الأقل؟
    if (!isTempoChecked && !isVerstaendnisChecked && !isStimmungChecked) {
        // رسالة خطأ بالألمانية
        alert("Bitte wählen Sie mindestens eine Feedback-Option aus (Tempo, Verständnis oder Stimmung)!");
        return; // توقف هنا ولا تكمل
    }

    // 3. إذا كان كل شيء تمام، انتقل للصفحة التالية
    location.href = 'qr_anzeige.html';
}
