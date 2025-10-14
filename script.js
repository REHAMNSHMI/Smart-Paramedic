<button id="emergencyBtn">🎙 اضغط وتحدث</button>
<div id="output" style="margin-top:10px; white-space: pre-line;"></div>

<script>
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

function speak(text){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

if ('webkitSpeechRecognition' in window) {
  const r = new webkitSpeechRecognition();
  r.lang = 'ar-SA';
  r.continuous = false;

  btn.onclick = ()=>{
    r.start();
    btn.textContent = "🎧 جاري الاستماع...";
  };

  r.onresult = (e)=>{
    const text = e.results[0][0].transcript.trim();
    console.log("تم التعرف على:", text); // لمراقبة النص
    let matched = null;

    for (const key in CASES) {
      if (text.toLowerCase().includes(key)) matched = CASES[key];
    }

    console.log("متطابق مع:", matched);

    if (matched) {
      output.innerHTML = "<b>🩺 الخطوات الإسعافية:</b><br>" + matched.map(s => "• " + s).join("<br>");
      speak(matched.join("، ثم "));
    } else {
      output.textContent = "❌ لم أفهم الحالة، حاول مرة أخرى.";
      speak("لم أفهم الحالة، حاول مرة أخرى.");
    }
  };

  r.onend = ()=>{
    btn.textContent = "🎙 اضغط وتحدث";
  };
} else {
  alert("المتصفح لا يدعم ميزة التعرف على الصوت");
}
</script>
