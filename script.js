const emergencyBtn = document.getElementById("emergencyBtn");
const showCasesBtn = document.getElementById("showCasesBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const readBtn = document.getElementById("readBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

const synth = window.speechSynthesis;
let recognition = null;

const cases = [
  {name:"كسر", steps:["ثبّت الجزء المصاب","تجنب الحركة","اطلب مساعدة طبية"]},
  {name:"نزيف", steps:["اضغط على مكان النزيف","ارفع الجزء المصاب","اطلب مساعدة طبية"]},
  {name:"إغماء", steps:["ضع المصاب على ظهره","تأكد من التنفس","اطلب مساعدة طبية"]}
];

// عرض الحالات في زر منفصل
showCasesBtn.addEventListener("click", ()=>{
  if(casesList.classList.contains("hidden")){
    casesList.classList.remove("hidden");
    casesList.innerHTML = "";
    cases.forEach(c=>{
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${c.name}</h3>`;
      casesList.appendChild(card);
    });
  } else {
    casesList.classList.add("hidden");
  }
});

// عرض الخطوات
function showSteps(c){
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
  if(synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(steps.join(". "));
  utter.lang = "ar-SA";
  synth.speak(utter);
}

// أزرار التحكم
readBtn.addEventListener("click",()=>speakSteps(Array.from(stepsList.children).map(li=>li.textContent)));
stopBtn.addEventListener("click", ()=>{if(synth.speaking)synth.cancel();});
backBtn.addEventListener("click",()=>{stepsSection.classList.add("hidden");});

// تفعيل المايك عند الضغط على زر الطوارئ
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
      showSteps(found);
      speakSteps(["تم التعرف على الحالة:", found.name]);
    }
  };

  recognition.onerror = function(e){console.log(e);}
}

// زر الطوارئ الكبير يفتح المايك ويستمع
emergencyBtn.addEventListener("click", ()=>{
  if(recognition) recognition.start();
});
