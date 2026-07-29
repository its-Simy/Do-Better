from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load the .env file
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")

#The secret key bypasses Row Level Security. That's what we want here: this is
#trusted server code, and the browser only ever reaches Supabase through us.
#The publishable key would be rejected by RLS on every write.
key: str = os.environ.get("SUPABASE_SECRET_KEY")
supabase: Client = create_client(url, key)


app = FastAPI()

#List the locations of the origins, port of front end & backend
origins = ["http://127.0.0.1:5173", "http://localhost:5173"]

#Here we are using * because we don't want specific http methods, we want everything to be allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#----------------------------------Middleware----------------------------------#

class SleepLog(BaseModel):
    date: str
    in_bed: str    # "HH:MM"
    woke_up: str

#Sleeping data
@app.post("/sleep")
async def sleep_log(log: SleepLog):
    # Convert the start and end times to datetime objects
    t1 = datetime.strptime(log.in_bed, "%H:%M:%S")
    t2 = datetime.strptime(log.woke_up, "%H:%M:%S")

    delta = t2 - t1

    #here the code assumes the interval crosses midnight
    if delta.days < 0:
        delta = timedelta(
            days=0,
            seconds=delta.seconds,
            microseconds=delta.microseconds
        )
    
    sec = delta.total_seconds()
    hours = round((sec / 3600),1)
    print(f"Hours: {hours}")
    today = datetime.now().date()
    print(f"Today: {today}")

    response = (
        supabase.table("sleep")
        #isoformat() because the JSON encoder can't serialize a date object.
        .insert({"hours": hours, "date": today.isoformat()})
        .execute()
    )

    return {"time": f"{hours} hours"}

