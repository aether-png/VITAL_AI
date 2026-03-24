# VITAL-AI: Clinical Risk Decision Support Platform

VITAL-AI is an AI-based perioperative decision support platform designed to improve patient safety by predicting intraoperative hypotension and detecting postoperative deterioration in near real-time.

## Abstract

This project presents an AI-based perioperative decision support platform to improve patient safety by predicting intraoperative hypotension and detecting postoperative deterioration in near real-time. Intraoperative hypotension and postoperative deterioration leading to unplanned ICU admission are strongly associated with acute kidney injury, myocardial injury, and increased mortality.

The system uses arterial blood pressure waveforms, vital signs, surgery characteristics, and perioperative treatments to model these risks in two stages:
1. **Intraoperative Prediction**: A 1D CNN analyzes ABP (Arterial Blood Pressure) windows to predict hypotension 10 minutes ahead, highlighting falling trends for early intervention.
2. **Postoperative Risk Scoring**: A second model (XGBoost / Logistic Regression) combines perioperative features with continuous ward vital signs for real-time deterioration risk scoring.

Both provide interpretable alerts via a React web application with a Python backend, suitable for OR monitoring and ward escalation decisions. Trained on public critical care datasets, this platform demonstrates explainable AI for preventing surgical complications through timely warnings.

## Tech Stack

### Backend
- **Framework**: Python ([FastAPI](https://fastapi.tiangolo.com/))
- **AI/ML**: PyTorch (for 1D CNN), scikit-learn, XGBoost, TensorFlow
- **Data Management**: Pandas, NumPy
- **Server**: Uvicorn

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Visuals/Charts**: Chart.js
- **Styling**: Tailwind CSS
- **Components**: Modern, responsive UI with real-time plotting capabilities.

## Key Features

- **Real-time Hypotension Prediction**: 1D CNN-powered alerts 10 minutes before actual occurrence.
- **Deterioration Alerts**: XGBoost-driven risk assessment for unplanned ICU transfers.
- **Interpretable Dashboard**: Visual aids for clinical decision-making.
- **Multi-Patient Support**: Capability to handle and monitor multiple patient streams.

## Project Structure

```text
VITAL-AI/
├── backend/                # Python FastAPI Backend
│   ├── server.py           # API Server Implementation
│   ├── requirements.txt    # Python Dependencies
│   ├── intraop_hypotension/# CNN Model files and data
│   └── postoperative/      # XGBoost Model files and data
├── src/                    # React Frontend Source
│   ├── components/         # Reusable UI Components
│   ├── views/              # Page Views (Intraoperative/Postoperative)
│   ├── hooks/              # Custom React Hooks
│   └── utils/              # Helper functions
├── public/                 # Static Assets
├── index.html              # Entry Point
└── package.json            # Frontend Dependencies
```

## Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js (Latest LTS recommended)
- npm or yarn

### 1. Backend Setup
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
python server.py
# OR
uvicorn server:app --reload
```
The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup
From the project root directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Usage

1. **Intraoperative View**: Upload a CSV file containing vital sign waveforms to generate real-time hypotension risk scores.
2. **Postoperative View**: Enter patient lab values (Creatinine, WBC, Hemoglobin, etc.) to assess the risk of ICU transfer.
3. **Alerts**: Monitor the real-time plots and alert banners for critical status notifications.

## License

*Specify license or project copyright information here.*