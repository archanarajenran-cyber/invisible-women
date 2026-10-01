const $ = id => document.getElementById(id);
let lang = 'ta', history = [], step = 0, rec = null, listening = false, demoMode = false;

const UI = {
  ta: { home: 'முகப்பு', helpNav: 'உதவி', language: 'மொழி', welcome: 'வணக்கம்! நான் உங்களுக்கு உதவுகிறேன்.',
    askPrompt: 'உங்களுக்கு என்ன உதவி வேண்டும்?', mic: 'பேசுங்கள்', micStop: 'நிறுத்து', placeholder: 'இங்கே எழுதுங்கள்...',
    ask: 'கேளுங்கள்', demo: 'டெமோ பாருங்கள்', answerTitle: 'பதில்', read: '🔊 படித்துக் காட்டு', dontGet: 'புரியவில்லை',
    showSteps: 'படிப்படியாகப் பாருங்கள்', prev: 'முந்தையது', next: 'அடுத்தது', step: 'படி', of: '/', docs: 'தேவையான ஆவணங்கள்',
    who: 'யார் விண்ணப்பிக்கலாம்', official: 'அதிகாரப்பூர்வ இணையதளம்', listening: 'கேட்கிறேன்... பேசுங்கள்', thinking: 'யோசிக்கிறேன்...',
    noMic: 'இந்த உலாவியில் குரல் வசதி இல்லை. Chrome அல்லது Edge பயன்படுத்துங்கள், அல்லது எழுதுங்கள்.',
    micErr: 'மைக்ரோஃபோனை அனுமதியுங்கள் அல்லது எழுதுங்கள்.', noVoice: 'இந்த கருவியில் தமிழ் குரல் இல்லை. எழுத்தைப் படியுங்கள்.',
    noKey: 'AI இணைப்பு இன்னும் அமைக்கப்படவில்லை. "டெமோ பாருங்கள்" பொத்தானை அழுத்துங்கள்.', err: 'மன்னிக்கவும், பிழை ஏற்பட்டது. மீண்டும் முயலுங்கள்.',
    empty: 'முதலில் பேசுங்கள் அல்லது எழுதுங்கள்.', safe: 'பாதுகாப்பு: கடவுச்சொல், OTP, வங்கி PIN எண்களை யாரிடமும் சொல்லாதீர்கள்.' },
  en: { home: 'Home', helpNav: 'Help', language: 'Language', welcome: 'Hello! I will help you.',
    askPrompt: 'What help do you need?', mic: 'Speak', micStop: 'Stop', placeholder: 'Write here...',
    ask: 'Ask', demo: 'Try Demo', answerTitle: 'Answer', read: '🔊 Read Aloud', dontGet: "I don't understand",
    showSteps: 'See step by step', prev: 'Back', next: 'Next', step: 'Step', of: 'of', docs: 'Documents needed',
    who: 'Who can apply', official: 'Official website', listening: 'Listening... please speak', thinking: 'Thinking...',
    noMic: 'Voice is not supported here. Use Chrome or Edge, or type.', micErr: 'Please allow the microphone, or type.',
    noVoice: 'No voice for this language on this device. Please read the text.',
    noKey: 'AI is not set up yet. Press "Try Demo".', err: 'Sorry, something went wrong. Please try again.',
    empty: 'Please speak or type first.', safe: 'Safety: never share passwords, OTPs or bank PINs with anyone.' }
};
const t = k => UI[lang][k];
const status = s => $('status').textContent = s || '';

// ---------- Gemini system prompt ----------
function systemPrompt() {
  const L = lang === 'ta'
  ? 'ONLY simple spoken Tamil. Do not use English.'
  : 'ONLY very simple English.';
  const data = { name: SCHEME.name[lang], whoCanApply: SCHEME.whoCanApply[lang], benefit: SCHEME.benefit[lang],
    eligibility: SCHEME.eligibility[lang], documents: SCHEME.documents[lang], howToApply: SCHEME.steps[lang],
    officialLink: SCHEME.link, helpline: SCHEME.helpline };
  return `You are a kind Tamil-speaking helper for a woman using a government service for the first time.
  
Reply in ${L}. Use short, everyday words. Never assume she knows English; if a hard word is needed, explain it in simple words.
Explain ONLY ONE step at a time, then ask one simple question (for example "Do you have this?").
If information is missing, ask one simple question.
Use ONLY the scheme information below. NEVER invent eligibility rules, documents, amounts or dates. If something is not in the information, or you are unsure, say clearly she should verify it from the official government source or helpline.
Do not ask for unnecessary personal information. NEVER ask for passwords, OTPs, bank PINs, card numbers or other secrets; if she shares them, tell her not to.
If the question is not about this scheme, politely say this demo supports only this service.
Output plain text only: no markdown, no bullet symbols, no emojis. Maximum 60 words.

SCHEME INFORMATION:
${JSON.stringify(data)}`;
}

async function callGemini(userText) {
  history.push({ role: 'user', parts: [{ text: userText }] });
  const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt(), contents: history.slice(-12) }) });
  const d = await r.json();
  if (!r.ok) { history.pop(); throw new Error(d.error); }
  history.push({ role: 'model', parts: [{ text: d.text }] });
  return d.text;
}

// ---------- Show answer ----------
function showAnswer(text) {
  $('answerText').textContent = text;
  $('answer').hidden = false;
  $('answer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  status('');
}

async function ask(text) {
  const q = (text ?? $('q').value).trim();
  if (!q) return status(t('empty'));
  demoMode = false; status(t('thinking'));
  try { showAnswer(await callGemini(q)); }
  catch (e) { status(e.message === 'NO_KEY' ? t('noKey') : t('err')); }
}

async function dontUnderstand(stepText) {
  status(t('thinking'));
  if (demoMode && !stepText) return showAnswer(SCHEME.demo.simpler[lang]);
  const msg = lang === 'ta'
    ? `எனக்குப் புரியவில்லை. இந்த படியை இன்னும் எளிய தமிழில், சிறிய வாக்கியங்களில், ஒரு சிறிய உதாரணத்துடன் சொல்லுங்கள்: ${stepText || 'உங்கள் கடைசி பதில்'}`
    : `I did not understand. Explain this again in even simpler English, short sentences, with a small everyday example: ${stepText || 'your last answer'}`;
  try { showAnswer(await callGemini(msg)); }
  catch (e) { status(e.message === 'NO_KEY' ? t('noKey') : t('err')); }
}

// ---------- Step by step ----------
function renderStep() {
  const s = SCHEME.steps[lang];
  $('schemeName').textContent = SCHEME.name[lang];
  $('stepCount').textContent = `${t('step')} ${step + 1} ${t('of')} ${s.length}`;
  $('stepText').textContent = s[step];
  $('prev').disabled = step === 0; $('next').disabled = step === s.length - 1;
}
function showSteps() { step = 0; $('steps').hidden = false; renderStep(); $('steps').scrollIntoView({ behavior: 'smooth' }); }

// ---------- Voice ----------
function listen() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return status(t('noMic'));
  if (listening) return rec.stop();
  rec = new SR(); rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN'; rec.interimResults = true;
  rec.onstart = () => { listening = true; $('mic').classList.add('on'); $('micLabel').textContent = t('micStop'); status(t('listening')); };
  rec.onresult = e => { $('q').value = [...e.results].map(r => r[0].transcript).join(''); };
  rec.onerror = () => status(t('micErr'));
  rec.onend = () => { listening = false; $('mic').classList.remove('on'); $('micLabel').textContent = t('mic');
    if ($('q').value.trim() && $('status').textContent === t('listening')) ask(); };
  rec.start();
}
function speak(text) {
  speechSynthesis.cancel();

  const speakNow = () => {
    const voices = speechSynthesis.getVoices();

    const tamilVoice = voices.find(v => {
      const voiceLang = (v.lang || '').replace('_', '-').toLowerCase();
      return voiceLang === 'ta-in' ||
             voiceLang.startsWith('ta-') ||
             voiceLang === 'ta';
    });

    const voice = new SpeechSynthesisUtterance(text);

    // Always tell the browser this is Tamil
    voice.lang = 'ta-IN';
    voice.rate = 0.80;
    voice.pitch = 1;
    voice.volume = 1;

    // Use Tamil voice if Chrome has one
    if (tamilVoice) {
      voice.voice = tamilVoice;
      voice.lang = tamilVoice.lang;
    }

    speechSynthesis.speak(voice);
  };

  // Chrome sometimes loads voices a little later
  const voices = speechSynthesis.getVoices();

  if (voices.length > 0) {
    speakNow();
  } else {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.onvoiceschanged = null;
      speakNow();
    };
  }
}

// ---------- Demo ----------
function runDemo() {
  demoMode = true; history = [];
  $('q').value = SCHEME.demo.question[lang];
  showAnswer(SCHEME.demo.answer[lang]);
  speak(SCHEME.demo.answer[lang]);
}

// ---------- Language + views ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('aboutText').textContent = SCHEME.name[lang] + ' — ' + SCHEME.benefit[lang];
  $('docList').innerHTML = SCHEME.documents[lang].map(d => `<li>${d}</li>`).join('');
  $('whoText').textContent = SCHEME.whoCanApply[lang];
  $('helpText').textContent = SCHEME.help[lang];
  $('officialLink').href = SCHEME.link;
  if (!$('steps').hidden) renderStep();
}
function view(v) { $('home').hidden = v !== 'home'; $('helpView').hidden = v !== 'help'; window.scrollTo(0, 0); }

$('lang').onchange = e => { lang = e.target.value; history = []; applyLang(); speechSynthesis.cancel(); };
$('navHome').onclick = () => view('home'); $('navHelp').onclick = () => view('help');
$('mic').onclick = listen;
$('askBtn').onclick = () => ask();
$('demoBtn').onclick = runDemo;
$('readAnswer').onclick = () => speak($('answerText').textContent);
$('dontGet').onclick = () => dontUnderstand();
$('showSteps').onclick = showSteps;
$('prev').onclick = () => { step--; renderStep(); };
$('next').onclick = () => { step++; renderStep(); };
$('readStep').onclick = () => speak($('stepText').textContent);
$('dontStep').onclick = () => dontUnderstand($('stepText').textContent);
if ('speechSynthesis' in window) speechSynthesis.getVoices();
applyLang();
