const emergencyBtn = document.getElementById("emergencyBtn");
const casesSection = document.getElementById("casesSection");
const stepsSection = document.getElementById("stepsSection");
const casesList = document.getElementById("casesList");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const readBtn = document.getElementById("readBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

const synth = window.speechSynthesis;
let currentUtterance = null;

const cases = [
  {name:"كسر", steps:["ثبّت الجزء المصاب","تجنب الحركة","اطلب مساعدة طبية"]},
  {name:"نزيف", steps:["اضغط على مكان النزيف","ارفع الجزء المصاب","اطلب مساعدة طبية"]},
  {name:"إغماء", steps:["ضع المصاب على ظهره","تأكد من التنفس","اطلب مساعدة طبية"]}
];

// عرض الحالات
emergencyBtn.addEventListener("click", ()=>{
  casesSection.classList.remove("hidden");
  casesList.innerHTML = "";
  cases.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3>
                      <button>اختر</button>`;
    card.querySelector("button").addEventListener("click",()=>{
      showSteps(c);
    });
    casesList.appendChild(card);
  });
});

// عرض الخطوات
function showSteps(c){
  casesSection.classList.add("hidden");
  stepsSection.classList.remove("hidden");
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(c.steps);
}

// التحكم بالصوت
function speakSteps(steps){
  stopSpeech();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}
function stopSpeech(){
  if(synth.speaking) synth.cancel();
}

// أزرار التحكم
readBtn.addEventListener("click",()=>speakSteps(Array.from(stepsList.children).map(li=>li.textContent)));
stopBtn.addEventListener("click",stopSpeech);
backBtn.addEventListener("click",()=>{
  stepsSection.classList.add("hidden");
  casesSection.classList.remove("hidden");
});

// التعرف على الصوت بالعربي
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event){
    const last = event.results[event.results.length -1];
    const word = last[0].transcript.trim();
    console.log("سمعت:", word);
    const found = cases.find(c=>word.includes(c.name));
    if(found) showSteps(found);
  };

  recognition.onerror = function(e){console.log(e);}
  recognition.start();
} else {
  console.log("تعرف الصوت غير مدعوم بهذا المتصفح");
}
