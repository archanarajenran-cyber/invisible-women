# The Invisible Woman

A Tamil voice/text helper that guides a first-time user through ONE government scheme, one simple step at a time.
Uses Gemini for answers and the browser's Web Speech API for speaking and listening.

## Files
- `index.html`, `style.css`, `script.js` - the website
- `scheme.js` - the scheme data (replace this object to support another scheme)
- `server.js` - tiny Node server that serves the site and calls Gemini (keeps the key secret)
- `.env` - holds your Gemini key (you create it; never share it)

## Run it (Windows CMD)
1. Install Node.js 18 or newer from https://nodejs.org, then check: `node -v`
2. Open the folder: `cd path\to\invisible-woman` then `code .`
3. Create the key file: `copy .env.example .env`
4. Open `.env` and replace `PASTE_YOUR_KEY_HERE` with your key from https://aistudio.google.com/apikey
5. Start: `node server.js`
6. Open **http://localhost:3000** in Chrome or Edge.

No `npm install` is needed. Press Ctrl+C in the terminal to stop.

## Test without a key
Press **Try Demo**. It shows a ready Tamil answer and works even without an API key.

## Test the microphone
Use Chrome or Edge on http://localhost:3000. Press the big mic, click **Allow**, speak Tamil.
If the text does not appear: check the lock icon in the address bar, Windows Settings > Privacy > Microphone, and your internet (Chrome speech recognition is online).

## If Tamil read-aloud is silent
Your device may lack a Tamil voice. Windows: Settings > Time & language > Language > add Tamil (speech). Android Chrome usually has one.

## Before the demo
The sample scheme details in `scheme.js` are written from general knowledge. Verify every detail (eligibility, documents, link, helpline) on the official government site.
