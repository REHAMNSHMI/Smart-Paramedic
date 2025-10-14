const emergencyBtn = document.getElementById("emergencyBtn");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;

const cases = [
  {name:"نزيف", steps:["اضغط على مكان النزيف","ارفع الجزء المصاب","اطلب مساعدة طبية"], info:"اضغط على مكان النزيف واطلب المساعدة فورًا"},
  {name:"إغماء", steps:["ضع المصاب على ظهره","تأكد من التنفس","اطلب مساعدة طبية"], info:"ضع الشخص مستلقيًا وتحقق من تنفسه"},
  {name:"انخفاض السكر", steps:["قدم للمصاب عصير أو حلوى","اجلس المصاب","اطلب مساعدة طبية"], info:"قدم سكريات سريعة للمصاب وأجلسه"}
];

function showSteps(c){
  stepsSection.style.display = "block";
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(c.steps);
}

function speakSteps(steps){
  if(synth.speaking) synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}

function playLast(){
  if(currentUtterance){
    if(synth.speaking) synth.cancel();
    synth.speak(currentUtterance);
  }
}

function stopSpeech(){
  if(synth.speaking) synth.cancel();
}

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

    // البحث عن أي حالة موجودة
    const found = cases.find(c=>word.includes(c.name.toLowerCase()));
    if(found){
      showSteps(found);
    }
  };

  recognition.onerror = function(e){console.log(e);}
}

emergencyBtn.addEventListener("click", ()=>{
  if(recognition){
    recognition.start();
  }
});

stopBtn.addEventListener("click", stopSpeech);
playBtn.addEventListener("click", playLast);
