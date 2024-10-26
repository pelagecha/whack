from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from data_handler import load_data, get_categories, filter_data, to_json
from datetime import datetime
import uvicorn
import uuid
from processors.image_classification import classify_image
from database import create_connection, DATABASE_FILE, get_account_transactions#, add_file_account_data, add_transaction

app = FastAPI()
database_connection = None

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for sessions (use a database for production)
data_storage = {}

#Connect to the database on app startup
@app.on_event("startup")
def start_db():
    global database_connection
    database_connection = create_connection(f'database{DATABASE_FILE}')

#Close database connection on shutdown
@app.on_event("shutdown")
def close_db():
    if database_connection:
        database_connection.close()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a CSV file and initialize a session.
    """
    df = load_data(file.file)
    session_id = str(uuid.uuid4())
    data_storage[session_id] = df
    categories = get_categories(df)
    return {"session_id": session_id, "categories": categories}

@app.post("/filter")
async def filter_data_endpoint(
    session_id: str,
    start_date: str = None,
    end_date: str = None,
    categories: str = None
):
    """
    Endpoint to filter data based on session, date range, and categories.
    """
    df = data_storage.get(session_id)
    if df is None:
        return {"error": "Session not found"}
    
    # Parse dates and categories
    start_date_parsed = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    end_date_parsed = datetime.strptime(end_date, "%Y-%m-%d") if end_date else None
    categories_list = categories.split(",") if categories else None
    
    # Filter data
    filtered_df = filter_data(df, start_date=start_date_parsed, end_date=end_date_parsed, categories=categories_list)
    
    # Convert to JSON
    data_json = to_json(filtered_df)
    
    return {"data": data_json}

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    # Placeholder for image processing
    result = classify_image(file.file)
    return result

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)