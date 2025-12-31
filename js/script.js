console.log("Lecture Feedback System geladen.");

/* =========================================
   1. Theme System (Dark/Light Mode)
   ========================================= */
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

/* =========================================
   2. Course Selection & Dashboard Logic
   ========================================= */
function saveCourseAndRedirect() {
    const inputElement = document.getElementById('kurs-auswahl');
    const selectedCourse = inputElement.value;

    if (selectedCourse.trim() !== "") {
        localStorage.setItem('currentCourseName', selectedCourse);
        location.href = 'dashboard.html';
    } else {
        alert("Bitte wählen Sie zuerst einen Kurs aus!");
    }
}

/* =========================================
   3. Session Validation & Question Logic
   ========================================= */
function validateAndGenerate() {
    // A. التحقق من خيارات الفيدباك
    const options = document.querySelectorAll('.option-row input[type="checkbox"]');
    
    // تأكد من وجود العناصر لتجنب الأخطاء
    if(options.length > 0) {
        const isTempoChecked = options[0].checked;
        const isVerstaendnisChecked = options[1].checked;
        const isStimmungChecked = options[2].checked;

        if (!isTempoChecked && !isVerstaendnisChecked && !isStimmungChecked) {
            alert("Bitte wählen Sie mindestens eine Feedback-Option aus (Tempo, Verständnis oder Stimmung)!");
            return;
        }
               // === التعديل الجديد: حفظ إعدادات الجلسة ===
        const sessionConfig = {
            tempo: isTempoChecked,
            verstaendnis: isVerstaendnisChecked,
            stimmung: isStimmungChecked
        };
        // نحول الكائن لنص JSON لنحفظه في الذاكرة
        localStorage.setItem('sessionConfig', JSON.stringify(sessionConfig));
    }

    // B. حفظ السؤال النصي
    const questionInput = document.getElementById('popular-questions');
    const allowText = document.getElementById('allow-text-questions');

    if (allowText && allowText.checked) {
        // نستخدم trim() للتأكد أن المستخدم لم يدخل مسافات فارغة فقط
        const qValue = questionInput.value.trim() ? questionInput.value : "Offene Runde";
        localStorage.setItem('activeSessionQuestion', qValue);
    } else {
        localStorage.removeItem('activeSessionQuestion');
    }    

    // C. الانتقال
    location.href = 'qr_anzeige.html';
}

/* =========================================
   4. Dummy Data for Dashboard
   ========================================= */
const courseData = {
    "Informatik": {
        tempo: 85,
        understanding: 60,
        questions: ["Wie funktioniert Rekursion genau?", "Unterschied zwischen Stack und Heap?"]
    },
    "HCI": {
        tempo: 45,
        understanding: 90,
        questions: ["Was sind die 10 Heuristiken?", "Unterschied UI vs UX?"]
    },
    "Mathematik": {
        tempo: 75,
        understanding: 40,
        questions: ["Beweis für Satz 3 nicht verstanden.", "Wie löst man das Integral?"]
    }
};

function updateDashboardStats() {
    const currentCourse = localStorage.getItem('currentCourseName');
    
    const tempoVal = document.getElementById('stat-tempo-val');
    const tempoBar = document.getElementById('stat-tempo-bar');
    const understandVal = document.getElementById('stat-understanding-val');
    const understandBar = document.getElementById('stat-understanding-bar');
    const questionsEl = document.getElementById('stat-questions');

    // تأكد أننا في صفحة الداشبورد وأن البيانات موجودة
    if (tempoVal && currentCourse && courseData[currentCourse]) {
        const data = courseData[currentCourse];

        tempoVal.textContent = data.tempo + "%";
        understandVal.textContent = data.understanding + "%";

        setTimeout(() => {
            tempoBar.style.width = data.tempo + "%";
            understandBar.style.width = data.understanding + "%";
        }, 100);

        // تلوين الأشرطة
        if(data.tempo > 80) tempoBar.style.backgroundColor = "#e74c3c"; 
        else if(data.tempo < 50) tempoBar.style.backgroundColor = "#3498db"; 
        else tempoBar.style.backgroundColor = "#2ecc71"; 

        if(data.understanding < 50) understandBar.style.backgroundColor = "#e74c3c";
        else understandBar.style.backgroundColor = "#2ecc71";

        // تعبئة الأسئلة
        questionsEl.innerHTML = ""; 
        data.questions.forEach(question => {
            const div = document.createElement('div');
            div.className = 'question-card';
            div.textContent = question;
            questionsEl.appendChild(div);
        });
    }
}

/* =========================================
   5. Session List Logic (New vs Old Courses)
   ========================================= */
function updateSessionList() {
    const currentCourse = localStorage.getItem('currentCourseName');
    const sessionListEl = document.querySelector('.session-list');
    
    // أسماء الكورسات التي نعتبرها "قديمة" ولها بيانات
    const coursesWithHistory = ["Informatik", "HCI", "Mathematik"];
    
    if (sessionListEl && currentCourse) {
        // التحقق: هل الكورس الحالي واحد من الكورسات القديمة؟
        // نستخدم toLowerCase لتجنب مشاكل الحروف الكبيرة والصغيرة
        const isOldCourse = coursesWithHistory.some(c => c.toLowerCase() === currentCourse.toLowerCase());

        if (!isOldCourse) {
            // إذا كان كورساً جديداً، نفرغ القائمة ونعرض الرسالة
            sessionListEl.innerHTML = `
                <li style="text-align: center; padding: 20px; color: var(--text-color); opacity: 0.7; font-style: italic;">
                    Noch keine Sitzungen vorhanden. <br>
                    <span style="font-size: 1.5rem; display: block; margin-top: 10px;">🚀</span>
                    Starten Sie Ihre erste Sitzung!
                </li>
            `;
        }
        // ملاحظة: إذا كان كورساً قديماً، لن نفعل شيئاً، وسيبقى كود HTML الأصلي (Sitzung 1, 2...) كما هو.
    }
}

/* =========================================
   6. MAIN EVENT LISTENER (The Brain)
   هذا الجزء ينفذ الأوامر تلقائياً عند تحميل أي صفحة
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // أ. تحديث أيقونة الثيم
    const activeTheme = document.documentElement.getAttribute('data-theme');
    updateIcon(activeTheme);

    // ب. تحديث عناوين الداشبورد
    const titleElement = document.getElementById('course-title');
    if (titleElement) {
        const savedCourse = localStorage.getItem('currentCourseName');
        const savedSemester = localStorage.getItem('currentSemester'); // جلبنا السمستر أيضاً إذا وجد
        
        if (savedCourse) {
            // إذا كان هناك سمستر، نضيفه للعنوان
            const titleText = savedSemester ? `${savedCourse} (${savedSemester})` : savedCourse;
            titleElement.textContent = titleText + " - Dashboard";
        }
        
        updateDashboardStats(); // تحديث الإحصائيات
        updateSessionList();    // <--- تحديث قائمة الجلسات (الدالة الجديدة)
    }
    
    // ج. تحديث مسار الرابط العلوي
    const urlDisplay = document.querySelector('.url-display');
    if (urlDisplay && localStorage.getItem('currentCourseName')) {
        if(urlDisplay.textContent.includes("KursAuswaehlen") || urlDisplay.textContent.includes("LectureFeedback")) {
            urlDisplay.textContent = `.../Kurs/${localStorage.getItem('currentCourseName')}/Dashboard`;
        }
    }

    // د. عرض السؤال المختار في Live Dashboard
    const displayDiv = document.getElementById('main-question-display');
    if (displayDiv) {
        const savedQuestion = localStorage.getItem('activeSessionQuestion');
        if (savedQuestion) {
            displayDiv.innerHTML = `<strong>Aktuelle Frage:</strong> ${savedQuestion}`;
            displayDiv.style.display = "block";
        } else {
            displayDiv.style.display = "none";
        }
    }

    // هـ. التحكم في ظهور البارات (Sliders)
    const feedbackTab = document.getElementById('feedback');
    if (feedbackTab) {
        const configStr = localStorage.getItem('sessionConfig');
        if (configStr) {
            const config = JSON.parse(configStr);
            const rows = document.querySelectorAll('.slider-row');
            
            // ترتيب HTML: 0=Verständnis, 1=Stimmung, 2=Tempo
            if (rows.length >= 3) {
                if (!config.verstaendnis) rows[0].style.display = 'none';
                if (!config.stimmung) rows[1].style.display = 'none';
                if (!config.tempo) rows[2].style.display = 'none';
            }
        }
    }
});

