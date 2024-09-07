import uvicorn

from toyserver.server import app

if __name__ == '__main__':
    uvicorn.run(app, port=8081)
