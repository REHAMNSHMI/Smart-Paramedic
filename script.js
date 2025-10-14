const btn = document.getElementById("emergencyBtn");

// تعليمات افتراضية عند البداية
output.innerHTML = "<b>🩺 خطوات الإسعاف المتاحة:</b><br>" +
    "• قل: 'كاحل'<br>" +
    "• قل: 'ضغط'<br>" +
    "• قل: 'سكر'";

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

  btn.onclick = () => {
    r.start();
    btn.textContent = "🎧 جاري الاستماع...";
  };

  r.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    console.log("تم التعرف على:", text);
    let matched = null;

    for (const key in CASES) {
      if (text.includes(key)) matched = CASES[key];
    }

    if (matched) {
      output.innerHTML = "<b>🩺 الخطوات الإسعافية:</b><br>" + matched.map(s => "• " + s).join("<br>");
      speak(matched.join("، ثم "));
    } else {
      output.innerHTML = "❌ لم أفهم الحالة، حاول مرة أخرى.";
      speak("لم أفهم الحالة، حاول مرة أخرى.");
    }
  };

  r.onend = () => {
    btn.textContent = "🎙 اضغط وتحدث";
  };
} else {
  output.innerHTML = "⚠️ المتصفح لا يدعم ميزة التعرف على الصوت";
}
