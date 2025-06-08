import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import base64
import io
import json

from typing import Optional

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

SYSTEM_PROMPT_TEXT = (
    "You are a clinical AI assistant that checks for disorganized thinking, "
    "word confusion, or cognitive instability in user responses. Flag any "
    "signs of confusion, repetition, or incoherence."
)


@app.post("/analyze-voice")
def analyze_voice():
    data = request.get_json()
    audio_b64 = data.get("audio")
    if not audio_b64:
        return jsonify({"error": "No audio provided"}), 400

    try:
        audio_bytes = base64.b64decode(audio_b64)
    except Exception:
        return jsonify({"error": "Invalid audio"}), 400

    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = "audio.webm"

    transcription = openai.audio.transcriptions.create(
        model="whisper-1", file=audio_file
    )
    transcript = transcription.text

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_TEXT},
            {"role": "user", "content": transcript},
        ],
    )
    analysis = response.choices[0].message.content
    return jsonify({"analysis": analysis, "transcript": transcript})


@app.post("/analyze-face")
def analyze_face():
    data = request.get_json()
    img_b64: Optional[str] = data.get("image")
    if not img_b64:
        return jsonify({"error": "No image provided"}), 400

    system_prompt = (
        "You examine a patient's facial expression and point out any signs of "
        "drooping, asymmetry, or expressions indicating confusion or distress."
    )

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"},
                    }
                ],
            },
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
    face = data.get("face_analysis", "")
    combined = (
        f"Voice transcript: {transcript}\nText response: {text}\n"
        f"Face analysis: {face}"
    )

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
    try:
        parsed = json.loads(content)
    except Exception:
        parsed = {"error": "Malformed response", "raw": content}
    return jsonify(parsed)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
