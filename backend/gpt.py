from openai import OpenAI
from dotenv import load_dotenv
import os

def run_model(type, query):
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")

    try:
        client = OpenAI()
    except:
        return "provide an API key in .env"

    if type == "chat":
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a knowledgeable and friendly financial assistant. Your role is to provide clear, accurate, and helpful financial guidance. You aim to help users understand financial concepts, answer questions on personal finance topics (like budgeting, saving, investing, and debt management), and offer tips for financial wellness. Always prioritize accuracy and avoid making any guarantees, giving specific investment advice, or suggesting risky financial actions. Be supportive, respectful, and encourage users to seek professional advice when needed. Do not exceed 500 characters in your response. Tell the user you will not answer questions unrelated to helping them understand their account if their question isn't."},
                {
                    "role": "user",
                    "content": f"{query}"
                }
            ]
        )
        return completion.choices[0].message.content
    else:
        return "incorrect 'type' argument provided. enter 'chat' or TBD"

if __name__ == "__main__":
    print("provide a query")
    print(run_model("chat", input()))