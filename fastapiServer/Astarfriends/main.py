import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import table
from twilio.rest import Client
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
print(os.getenv('TWILIO_ACCOUNT_SID'))
print(os.getenv('TWILIO_AUTH_TOKEN'))
print(os.getenv('FROM_WHATSAPP_NUMBER'))
print(os.getenv('TO_WHATSAPP_NUMBER'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(table.router)

class MessageRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/sms")
async def send_sms():
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    from_whatsapp_number = os.getenv('FROM_WHATSAPP_NUMBER')
    to_whatsapp_number = os.getenv('TO_WHATSAPP_NUMBER')

    message = client.messages.create(
        from_=from_whatsapp_number,
        body='Your appointment is coming up on July 21 at 3PM',
        to=to_whatsapp_number
    )

    print(message.sid)

    return {"message": "SMS sent successfully"}

@app.post("/user")
async def user_initiated(request: MessageRequest):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    from_whatsapp_number = os.getenv('FROM_WHATSAPP_NUMBER')
    to_whatsapp_number = os.getenv('TO_WHATSAPP_NUMBER')

    try:
        message = client.messages.create(
            from_=from_whatsapp_number,
            body=request.message,
            to=to_whatsapp_number
        )
        print(message.sid)
        return {"message": "SMS sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
