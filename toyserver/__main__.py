from argparse import ArgumentParser

import uvicorn

from toyserver.server import app


def main() -> None:
    """Run the server."""
    parser = ArgumentParser()
    parser.add_argument('--host', type=str, default='0.0.0.0')  # noqa: S104
    parser.add_argument('--port', type=int, default=8081)
    args = parser.parse_args()
    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == '__main__':
    main()
