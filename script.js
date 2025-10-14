const emergencyBtn = document.getElementById("emergencyBtn");
const micBtn = document.getElementById("micBtn");
const suggestions = document.getElementById("suggestions");
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
  {name:"إغماء", steps:["ضع المصاب على ظهره","تأكد من التنفس","اطلب مساعدة طبية"]},
  {name:"سكر منخفض", steps:["قدم للمصاب عصير أو حلوى","اجلس المصاب","اطلب مساعدة طبية"]},
  {name:"حرق", steps:["برد المكان المصاب بماء","غطيه شاش نظيف","اطلب مساعدة طبية"]}
];

// عرض الحالات أسفل زر الطوارئ
function showSuggestions(){
  suggestions.innerHTML = "الحالات المتاحة: " + cases.map(c=>c.name).join(", ");
}
showSuggestions();

// عرض الحالات عند الضغط على زر الطوارئ
emergencyBtn.addEventListener("click", ()=>{
  casesSection.classList.remove("hidden");
  casesList.innerHTML = "";
  cases.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3>
                      <button>اختر</button>`;
    card.querySelector("button").addEventListener("click",()=> showSteps(c));
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
let recognition = null;
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event){
    const last = event.results[event.results.length -1];
    const word = last[0].transcript.trim().toLowerCase();
    console.log("سمعت:", word);
    const found = cases.find(c=>word.includes(c.name));
    if(found){
      speakSteps(["تم التعرف على الحالة:", found.name]);
      showSteps(found);
    }
  };

  recognition.onerror = function(e){console.log(e);}
}

// زر المايك
micBtn.addEventListener("click", ()=>{
  if(recognition){
    recognition.start();
    micBtn.textContent = "🔴 المايك مفعل";
  }
});
