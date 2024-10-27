from openai import OpenAI
from dotenv import load_dotenv
import pytesseract
from PIL import Image
from database.database import get_account_transactions
import os

def run_rag(query, connection, accountno):
    try:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        client = OpenAI()
    except:
        return "provide an API key in .env"

    records = str(get_account_transactions(connection, accountno))

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"You are a knowledgeable and friendly financial assistant. Your role is to provide clear, accurate, and helpful financial guidance. You aim to help users understand financial concepts, answer questions on personal finance topics (like budgeting, saving, investing, and debt management), and offer tips for financial wellness. Always prioritize accuracy and avoid making any guarantees, giving specific investment advice, or suggesting risky financial actions. Be supportive, respectful, and encourage users to seek professional advice when needed. Do not exceed 750 characters in your response. Tell the user you will not answer questions unrelated to helping them understand their account if their question isn't. If the answer is related to their account, use the following information: {records}"},
            {"role": "user", "content": f"{text}"}
        ],
    )
    return completion.choices[0].message.content



def run_model(type, query):
    try:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
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
    elif type == "image":
        image = Image.open(query)
        text = pytesseract.image_to_string(image)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You will be given a stream of text from an image related to finances. You are to find the final sum total expense. Include only this numeric value in your response. You are not allowed to have text in your response."},
                {"role": "user", "content": f"{text}"}
            ],
        )
        return completion.choices[0].message.content

    else:
        return "incorrect 'type' argument provided. enter 'chat' or TBD"

if __name__ == "__main__":
    # print("provide a query")
    # print(run_model("chat", input()))
    print(run_model("image", "./sample/receipt.png"))