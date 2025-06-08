# NeoAI
NeuroBridgeAI

## Running the backend

```bash
cd backend
pip install -r requirements.txt

cp .env.example .env  # add your OpenAI key
python app.py
```

The API server listens on `http://localhost:5000` by default. Set
`OPENAI_API_KEY` in `.env` or as an environment variable so the backend can
access OpenAI services.


## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` to the backend URL if you serve them separately.


The frontend accesses the webcam and microphone during a check-in to
capture voice and facial expressions. Grant permissions when prompted.

