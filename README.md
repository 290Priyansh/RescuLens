# T.A.L.O.N.: AI-First Emergency Dispatch & Triage System 🦅

> **T.A.L.O.N.** — *Triage & Automated Logistics Operations Network*

**Submitted for VITB-JHU Health-Hack 2025**
*Theme: Emergency Care Systems / Resource Optimization*

**T.A.L.O.N.** is an intelligent "Copilot" for emergency dispatchers. It addresses the critical bottleneck of manual triage during mass-casualty events by automating the ingestion, analysis, and routing of emergency calls using Multi-Agent AI.

## 🌟 Key Features

### 1. 🗣️ Voice-to-Action Pipeline
- **Live Call Handling:** Integrates with **Twilio** to receive real-time emergency calls.
- **AI Transcription:** Uses **OpenAI Whisper** (ASR) to transcribe noisy, emotional audio into accurate text.
- **Medical NLP:** Extracts symptoms (e.g., "dyspnea", "cardiac arrest") using a hybrid of **Spacy** and custom clinical rules.

### 2. 🧠 Intelligent Triage Engine
- **Deterministic Logic:** Classifies incidents into **CRITICAL**, **HIGH**, **MEDIUM**, or **LOW** priority.
- **Clinical Safety:** Hard-coded "Red Flag" rules ensure life-threatening symptoms (e.g., "not breathing") trigger immediate critical alerts, bypassing lower-confidence AI predictions.

### 3. 🗺️ Smart Dispatch Routing
- **Resource Balancing:** Routes ambulances not just to the *nearest* hospital, but to the *nearest capable* hospital with available beds.
- **Haversine Algorithm:** Calculates precise distances to optimize fleet fuel consumption and response time.

### 4. 💻 Real-Time Command Center
- **React Dashboard:** A live, modern interface for dispatchers to view incoming incidents.
- **Map Visualization:** Visualizes incident locations and hospital status on an interactive map.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python, FastAPI, SQLAlchemy |
| **AI / ML** | OpenAI Whisper (Speech-to-Text), Spacy (NER), Custom Triage Rules |
| **Database** | SQLite (Prototyping) / PostgreSQL (Production ready) |
| **Infrastructure** | Twilio (Voice/SMS), ngrok (Tunneling) |

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js & npm
- [Twilio Account](https://www.twilio.com/) (for voice testing)
- [OpenAI API Key](https://platform.openai.com/)

### 1. Clone the Repository
```
git clone [https://github.com/VipranshOjha/RescuLens.git](https://github.com/VipranshOjha/RescuLens.git)
cd RescuLens
```
### 2. Backend Setup
```
cd app
```
Create virtual environment
```
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```
Install dependencies
```
pip install -r requirements.txt
```
Start the API server
```
uvicorn main:app --reload
The backend runs on http://localhost:8000
```
### 3. Frontend Setup
```
cd ../frontend
npm install
npm run dev
The dashboard runs on http://localhost:5173
```
### 4. Environment Variables
Create a .env file in the root directory:

Code snippet
OPENAI_API_KEY=sk-proj-your-key-here
DATABASE_URL=sqlite:///./resculens.db

---

### Method A: Full End-to-End Voice Test (Requires Twilio)
1.  **Run the backend with ngrok** to expose it to the internet:
    ```bash
    ngrok http 8000
    ```
2.  **Copy the HTTPS URL** (e.g., `https://xyz.ngrok-free.app`).
3.  **Configure Twilio:**
    * Go to **Twilio Console** > **Phone Numbers** > **Manage** > **Active Numbers**.
    * Under **Voice & Fax**, set "A Call Comes In" to **Webhook**.
    * Paste: `https://your-ngrok-url.app/webhooks/voice`
4.  **Call your Twilio number!** Speak a medical emergency (e.g., *"My father is having chest pain and can't breathe"*).
5.  **Watch the incident** appear on your React Dashboard automatically.

### Method B: Text Simulation (No Twilio required)
You can simulate an incident via the API docs:
1.  Go to `http://localhost:8000/docs`.
2.  Find the `POST /api/webhooks/sms` endpoint.
3.  Execute with:
    * **Body:** `"Severe car accident, two people unconscious"`
    * **From:** `"+1234567890"`
4.  Check the dashboard to see the new critical incident.

---

## 📂 Project Structure

```text
RescuLens/
├── app/                  # FastAPI Backend
│   ├── api/              # Routes (Webhooks, Incident API)
│   ├── dispatch/         # Hospital Assignment Logic
│   ├── incident/         # Database Models & Services
│   ├── medical_nlp/      # Entity Extraction & Whisper Integration
│   ├── routing/          # Geospatial & Distance Logic
│   └── triage/           # Clinical Rule Engine
├── frontend/             # React Dashboard
│   ├── src/
│   │   ├── components/   # Maps, Incident Cards, Sidebar
│   │   ├── pages/        # Dashboard, Analytics, Settings
│   │   └── context/      # Theme & State Management
└── requirements.txt      # Python Dependencies
```
---

👥 Team WizX3

[Vipransh Ojha](https://github.com/VipranshOjha) - Full Stack & AI Architecture

[Priyansh Vaish](https://github.com/290Priyansh)- Twilio Integration & Telephony

[Khushi Gupta](https://github.com/kg7825881) - Frontend & Design

Built with ❤️ for the VITB-JHU Health-Hack 2025.
