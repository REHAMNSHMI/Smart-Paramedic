const CASES = {
  "كاحل": [
    "أبعد المصاب عن الخطر.",
    "اجلسه وارفع القدم قليلاً.",
    "ضع ثلجاً ملفوفاً على المكان لمدة عشرين دقيقة.",
    "ثبت الكاحل بضماد مرن.",
    "اذهب للطبيب إن استمر الألم."
  ],
  "ضغط": [
    "اجلس المصاب وارفع ساقيه قليلاً.",
    "افتح الملابس الضيقة.",
    "أعطه ماء إن لم يكن فاقد الوعي.",
    "اطلب المساعدة إن لم يتحسن."
  ],
  "سكر": [
    "إن كان منخفضاً أعطه عصير أو سكر سريع.",
    "إن كان مرتفعاً اطلب المساعدة الطبية فوراً.",
    "راقب التنفس والوعي حتى تصل المساعدة."
  ]
};

const btn = document.getElementById("emergencyBtn");
const output = document.getElementById("output");

// عرض جميع الخطوات لكل الحالات عند تحميل الصفحة
function showAllInstructions(){
  let html = "<b>🩺 الخطوات الإسعافية لكل الحالات:</b><br><br>";
  for(const key in CASES){
    html += `<b>${key}:</b><br>`;
    html += CASES[key].map((s,i)=>`${i+1}. ${s}`).join("<br>");
    html += "<br><br>";
  }
  output.innerHTML = html;
}
showAllInstructions();

// دالة النطق الصوتي
function speak(text){
  if('speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}

// تفعيل التعرف على الصوت
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = false;

  btn.onclick = () => {
    recognition.start();
    btn.textContent = "🎧 جاري الاستماع...";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    let matched = null;

    for (const key in CASES) {
      if (text.includes(key)) matched = key;
    }

    if (matched) {
      output.innerHTML = `<b>🩺 خطوات الإسعاف لحالة "${matched}":</b><br>` +
        CASES[matched].map((s,i)=>`${i+1}. ${s}`).join("<br>");
      speak(CASES[matched].join("، ثم "));
    } else {
      output.innerHTML = "❌ لم أفهم الحالة، حاول مرة أخرى.";
      speak("لم أفهم الحالة، حاول مرة أخرى.");
    }
  };

  recognition.onend = () => {
    btn.textContent = "🎙 اضغط وتحدث";
  };

} else {
  output.innerHTML += "<br><br>⚠️ المتصفح لا يدعم ميزة التعرف على الصوت.";
}
