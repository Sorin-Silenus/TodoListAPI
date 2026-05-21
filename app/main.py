# This file runs the API server, currently on local host. 
# It imports the FastAPI app and starts the server using uvicorn.
from fastapi import FastAPI
from api.routes.todo import todo_router
from tortoise.contrib.fastapi import register_tortoise
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(todo_router)
register_tortoise(
    app = app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["api.models.todo"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"status": "todo api is running"}