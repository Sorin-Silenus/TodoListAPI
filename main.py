# This file hosts the server, currently local host
# that the api will run on
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)