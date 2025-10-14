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

// عرض الخطوات لكل الحالات مسبقاً
output.innerHTML = "<b>🩺 الخطوات الإسعافية لكل الحالات:</b><br>" +
    "<b>كاحل:</b><br>" +
    CASES["كاحل"].map(s => "• " + s).join("<br>") + "<br><br>" +
    "<b>ضغط:</b><br>" +
    CASES["ضغط"].map(s => "• " + s).join("<br>") + "<br><br>" +
    "<b>سكر:</b><br>" +
    CASES["سكر"].map(s => "• " + s).join("<br>");

function speak(text){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

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
    console.log("تم التعرف على:", text);
    let matched = null;

    for (const key in CASES) {
      if (text.includes(key)) matched = CASES[key];
    }

    if (matched) {
      output.innerHTML = "<b>🩺 الخطوات الإسعافية:</b><br>" +
          matched.map(s => "• " + s).join("<br>");
      speak(matched.join("، ثم "));
    } else {
      output.innerHTML = "❌ لم أفهم الحالة، حاول مرة أخرى.";
      speak("لم أفهم الحالة، حاول مرة أخرى.");
    }
  };

  recognition.onend = () => {
    btn.textContent = "🎙 اضغط وتحدث";
  };

} else {
  output.innerHTML += "<br><br>⚠️ المتصفح لا يدعم ميزة التعرف على الصوت";
}
