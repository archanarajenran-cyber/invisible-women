// ONE scheme lives here. Replace this object to support another scheme.
// IMPORTANT: sample details below are from general knowledge. VERIFY on the official site before the demo.
const SCHEME = {
  name: { ta: 'கலைஞர் மகளிர் உரிமைத் தொகை திட்டம்', en: 'Kalaignar Magalir Urimai Thogai Thittam' },
  whoCanApply: {
    ta: 'தமிழ்நாட்டில் குடும்ப அட்டை உள்ள குடும்பத் தலைவியாக இருக்கும் பெண்கள்.',
    en: 'Women who are the head of a family with a ration card in Tamil Nadu.'
  },
  benefit: { ta: 'தகுதியுள்ளவர்களுக்கு மாதம் ரூ.1,000 வங்கிக் கணக்கில் கிடைக்கும்.', en: 'Eligible women get Rs 1,000 per month in their bank account.' },
  eligibility: {
    ta: ['குடும்ப அட்டை இருக்க வேண்டும்', 'குடும்பத்தின் ஆண்டு வருமானம் குறைவாக இருக்க வேண்டும்', 'நிலம் மற்றும் மின்சாரப் பயன்பாடு குறிப்பிட்ட அளவுக்குள் இருக்க வேண்டும்', 'அரசுப் பணியில் உள்ளவர்கள் தகுதியில்லை'],
    en: ['Must have a ration card', 'Family yearly income must be low', 'Land and electricity use must be within set limits', 'Government employees are not eligible']
  },
  documents: {
    ta: ['குடும்ப அட்டை', 'ஆதார் அட்டை', 'வங்கிக் கணக்குப் புத்தகம்', 'ஆதாருடன் இணைந்த கைபேசி எண்'],
    en: ['Ration card', 'Aadhaar card', 'Bank passbook', 'Mobile number linked to Aadhaar']
  },
  steps: {
    ta: [
      'முதலில் இந்த ஆவணங்களை எடுத்து வையுங்கள்: குடும்ப அட்டை, ஆதார் அட்டை, வங்கிக் கணக்குப் புத்தகம்.',
      'உங்கள் பகுதியில் உள்ள ரேஷன் கடை அல்லது விண்ணப்ப முகாமுக்குச் செல்லுங்கள்.',
      'அங்குள்ள தன்னார்வலரிடம் விண்ணப்பப் படிவம் வாங்குங்கள். நிரப்ப அவரிடம் உதவி கேளுங்கள்.',
      'விண்ணப்பத்தைக் கொடுத்து, ஒப்புகைச் சீட்டை வாங்கிப் பத்திரமாக வைத்துக்கொள்ளுங்கள்.',
      'விண்ணப்ப நிலையை அறிய உதவி எண்ணை அழைக்கலாம் அல்லது அதிகாரப்பூர்வ இணையதளத்தைப் பாருங்கள்.'
    ],
    en: [
      'First keep these ready: ration card, Aadhaar card, bank passbook.',
      'Go to your nearest ration shop or application camp.',
      'Ask the volunteer there for the application form. Ask them to help you fill it.',
      'Submit it, take the receipt slip, and keep it safe.',
      'To check your status, call the helpline or visit the official website.'
    ]
  },
  link: 'https://kmut.tn.gov.in',
  helpline: '1100',
  help: {
    ta: 'உதவி வேண்டுமா? உதவி எண் 1100-ஐ அழைக்கலாம் அல்லது உங்கள் ரேஷன் கடையில் கேளுங்கள். எப்போதும் அதிகாரப்பூர்வ இணையதளத்தில் விவரங்களை உறுதி செய்யுங்கள்.',
    en: 'Need help? Call 1100 or ask at your ration shop. Always confirm details on the official website.'
  },
  // Used by "Try Demo" and as offline fallback (no API key needed)
  demo: {
    question: { ta: 'எனக்கு இந்த அரசு திட்டத்திற்கு எப்படி விண்ணப்பிப்பது?', en: 'How do I apply for this government scheme?' },
    answer: {
      ta: 'வணக்கம்! இது கலைஞர் மகளிர் உரிமைத் தொகை திட்டம். தகுதியுள்ள குடும்பத் தலைவிகளுக்கு மாதம் ரூ.1,000 கிடைக்கும். முதல் படி: குடும்ப அட்டை, ஆதார் அட்டை, வங்கிக் கணக்குப் புத்தகம் ஆகியவற்றை எடுத்து வையுங்கள். இவை உங்களிடம் இருக்கிறதா? (தகுதியை அதிகாரப்பூர்வ இணையதளத்தில் உறுதி செய்யுங்கள்.)',
      en: 'Hello! This is the Kalaignar Magalir Urimai Thogai scheme. Eligible women heads of family get Rs 1,000 a month. Step 1: keep your ration card, Aadhaar card and bank passbook ready. Do you have them? (Please confirm eligibility on the official website.)'
    },
    simpler: {
      ta: 'சரி, இன்னும் எளிதாகச் சொல்கிறேன். மூன்று அட்டைகள் வேண்டும்: ரேஷன் அட்டை, ஆதார் அட்டை, வங்கிப் புத்தகம். இவற்றை ஒரு பையில் ஒன்றாக வையுங்கள். அவ்வளவுதான்!',
      en: 'Let me say it more simply. You need three things: ration card, Aadhaar card, bank book. Put them together in one bag. That is all!'
    }
  }
};
