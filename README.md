# GoMed - AI-Powered Medication Delivery

An intelligent medication delivery platform with AI chatbot assistance, prescription management, and seamless ordering.

## Features

- 🤖 **AI Chatbot** - Get medical advice and medication recommendations
- 💊 **Prescription Upload** - Upload and manage prescriptions
- 🛒 **Online Ordering** - Browse and order medications with cart functionality
- 🏥 **Pharmacy Collection** - Collect medications from nearby pharmacies
- 🔒 **Secure** - Safe and transparent payment system
- 📦 **Real-time Tracking** - Track deliveries from pharmacy to doorstep

## Project Structure

```
GoMed/
├── index.html              # Main landing page
├── choose-option.html      # Service selection (chatbot/prescription/order)
├── chatbot.html           # AI medical chatbot interface
├── prescription.html      # Prescription upload page
├── place-order.html       # Medication ordering page
├── cart.html              # Shopping cart
├── collection.html        # Pharmacy collection page
├── *.css                  # Styling for each page
├── *.js                   # JavaScript functionality
├── meds/                  # Medication images
├── server.js              # Backend API (Gemini AI integration)
└── old-react-code/        # Previous React implementation (archived)
```

## Getting Started

### Option 1: Direct File Access
Simply open `index.html` in your browser.

### Option 2: Local Server (Recommended)
```bash
# Using Node.js serve
npx serve

# Or using Python
python -m http.server 8000
```

Then open http://localhost:8000

## Backend API

The chatbot uses Google Gemini AI for medical assistance.

### Setup
1. Install dependencies:
```bash
npm install dotenv express cors body-parser @google/generative-ai
```

2. Create `.env` file:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

3. Run backend server:
```bash
node server.js
```

## Technologies

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: Google Gemini 2.5 Flash
- **Storage**: localStorage for cart persistence

## Color Theme

- Primary Blue: `#0b6ef6`
- Dark Blue: `#3455a3`
- Light Blue: `rgb(83, 187, 236)`
- Background: Linear gradient `#bdf0fd` to `#BEE9F2`

## License

See LICENSE file for details.
