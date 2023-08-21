import sys
import asyncio
import os
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

sys.stdout.reconfigure(encoding='utf-8')

async def main():
    user_input = sys.argv[1]
    if user_input.strip():  # Check if user_input is not empty or just whitespace
        chat_completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": f"{user_input}"},
                {"role": "system", "content": "Rüya yorumla. Her şeyi rüya olarak algıla. Soruları da da rüya olarak algıla"}
            ]
        )
        response = chat_completion['choices'][0]['message']['content']
        print(response)
    else:
        print("Lütfen rüyanınızı yazin...")

# Run the asyncio event loop
if __name__ == "__main__":
    asyncio.run(main())
