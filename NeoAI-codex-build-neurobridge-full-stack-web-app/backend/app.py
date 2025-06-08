import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai



    
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "✅ NeuroBridge backend is running!"

SYSTEM_PROMPT_TEXT = (
    "You are a clinical AI assistant that checks for disorganized thinking, "
    "word confusion, or cognitive instability in user responses. Flag any "
    "signs of confusion, repetition, or incoherence."
)


@app.post("/analyze-voice")
def analyze_voice():
    data = request.get_json()
    transcript = data.get("transcript", "")
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_TEXT},
            {"role": "user", "content": transcript},
        ],
    )
    analysis = response.choices[0].message.content
    return jsonify({"analysis": analysis})


@app.post("/analyze-text")
def analyze_text():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_TEXT},
            {"role": "user", "content": text},
        ],
    )
    analysis = response.choices[0].message.content
    return jsonify({"analysis": analysis})


@app.post("/evaluate-risk")
def evaluate_risk():
    data = request.get_json()
    text = data.get("text", "")
    transcript = data.get("transcript", "")
    combined = f"Voice transcript: {transcript}\nText response: {text}"

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You evaluate cognitive stability based on user inputs and "
                    "return a JSON object with a risk_level (low, medium, high), "
                    "flags, and summary."
                ),
            },
            {"role": "user", "content": combined},
        ],
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content
    return jsonify(content)


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, host="127.0.0.1", port=5050)
