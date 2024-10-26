from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from data_handler import load_data, get_categories, filter_data, to_json
from datetime import datetime
import uvicorn
import uuid

app = FastAPI()

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
    session_id: str = Form(...),
    start_date: str = Form(None),
    end_date: str = Form(None),
    categories: str = Form(None)
):
    """
    Endpoint to filter data based on session, date range, and categories.
    """
    df = data_storage.get(session_id)
    if df is None:
        return {"error": "Session not found"}
    
    # Parse dates
    start_date_parsed = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    end_date_parsed = datetime.strptime(end_date, "%Y-%m-%d") if end_date else None
    
    # Parse categories
    categories_list = categories.split(",") if categories else None
    
    # Filter data
    filtered_df = filter_data(df, start_date=start_date_parsed, end_date=end_date_parsed, categories=categories_list)
    
    # Convert to JSON
    data_json = to_json(filtered_df)
    
    return {"data": data_json}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
