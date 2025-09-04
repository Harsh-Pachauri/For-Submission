from flask import Flask, request, jsonify, session
from flask_cors import CORS
from langchain_groq import ChatGroq
import os, random, datetime

app = Flask(__name__)
CORS(app)  # Allow frontend requests
app.secret_key = 'super_secret_rotten_shoe_key_123'  # Needed for session memory

# Set your Groq API Key (store securely in environment variables)
os.environ["GROQ_API_KEY"]

# Initialize LLM model
llm = ChatGroq(model_name='llama-3.3-70b-versatile')

# Roast system prompt
roast_prompt = """
You are RoastMaster3000, a savage, sarcastic, meta, comedic, relatable, Indian (but not stereotyped) AI comedian who roasts people's faces.
Rules for roasting:
- Be SHORT, 1 sentence max.
- Be SAVAGE, sarcastic, and meme-worthy.
- Use at least ONE funny emoji (💀 🤡 🔥 🥴 🚨 🌊 etc.).
- Always exaggerate how tragic, goofy, or cursed their face looks.
- Mention the user's age or gender only if it makes the roast funnier.
- Style: Internet roast / Twitter meme / dark humor.

User Info:
- Name: {name}
- Age: {age}
- Gender: {gender}

Now generate ONE roast in this style, for example:
"🤡 Bro’s face got the loading screen vibes… still buffering since 2005 💀"
"""


@app.route('/roast', methods=['POST'])
def roast():
    data = request.get_json()
    name = data.get('name', 'Anonymous')
    age = data.get('age', 'Unknown')
    gender = data.get('gender', 'Unknown')

    # Build the roast prompt
    prompt = roast_prompt.format(name=name, age=age, gender=gender)
    
    # Call the LLM
    response = llm.predict(prompt)

    # Generate random smell score (0–100)
    smell_score = random.randint(0, 100)

    # Generate death countdown (random within next 20 minutes)
    minutes = random.randint(1, 20)
    death_time = datetime.datetime.now() + datetime.timedelta(minutes=minutes)
    death_countdown = f"You have {minutes} minutes before your shoes gas out the room ({death_time.strftime('%H:%M:%S')})."

    return jsonify({
        'roast': response.strip(),
        'certificate': f"Certified Rotten: {name}, Age {age}, Gender {gender} - Your face have been declared a public health hazard.",
        'smellScore': smell_score,
        'deathCountdown': death_countdown
    })


if __name__ == '__main__':
    app.run(debug=True)
