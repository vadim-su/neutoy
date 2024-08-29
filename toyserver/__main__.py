import uvicorn

from toyserver.server import app

if __name__ == '__main__':
    uvicorn.run(app, host='app', port=8000)
