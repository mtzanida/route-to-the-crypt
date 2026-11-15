"""Local Scenario Vault bridge; start explicitly with python3 lab/server.py."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlsplit

from vault import MAX_BYTES, SCENARIOS, Vault, create_client


class Handler(BaseHTTPRequestHandler):
    vault = None

    def reply(self, status, value):
        payload = json.dumps(value).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def handle_request(self):
        # No CORS. Mutations require JSON and a same-machine Vite origin.
        if self.headers.get('Host') not in ('127.0.0.1:8787', 'localhost:8787'):
            return self.reply(403, {'error': 'Local host required'})
        origin = self.headers.get('Origin')
        if origin not in (None, 'http://127.0.0.1:5173', 'http://localhost:5173'):
            return self.reply(403, {'error': 'Local development origin required'})
        path = urlsplit(self.path).path
        if self.command == 'GET' and path == '/api/vault/status':
            return self.reply(200, {'storage': 'aws-emulator', 'bucket': 'route-to-the-crypt-local',
                                    'ephemeral': True})
        scenario_id = path.removeprefix('/api/vault/')
        if not path.startswith('/api/vault/') or scenario_id not in SCENARIOS:
            return self.reply(404, {'error': 'Unknown scenario'})
        try:
            if self.command == 'GET':
                result = self.vault.load(scenario_id)
            else:
                if self.headers.get('Content-Type') != 'application/json':
                    return self.reply(415, {'error': 'Use application/json'})
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= MAX_BYTES:
                    return self.reply(413, {'error': 'Invalid snapshot size'})
                value = json.loads(self.rfile.read(length))
                result = self.vault.save(scenario_id, value)
            return self.reply(200, {**result, 'storage': 'aws-emulator'})
        except (ValueError, UnicodeError) as exc:
            return self.reply(400, {'error': str(exc)})
        except Exception as exc:
            from botocore.exceptions import ClientError
            if isinstance(exc, ClientError) and exc.response['Error']['Code'] in ('NoSuchKey', '404'):
                return self.reply(404, {'error': 'No saved snapshot for this scenario. Save one first.'})
            # Unsupported emulator operations and outages are never reported as a successful save.
            return self.reply(503, {'error': 'Local emulator request failed. Check the emulator and its API support.'})

    do_GET = handle_request
    do_POST = handle_request


if __name__ == '__main__':
    try:
        Handler.vault = Vault(create_client())
        Handler.vault.provision()
    except Exception as exc:
        raise SystemExit(f'Local vault could not start ({type(exc).__name__}). '
                         'Start authenticated AWS Emulator first; no AWS fallback is available.') from None
    print('Scenario Vault: http://127.0.0.1:8787 (local emulator only)', flush=True)
    server = HTTPServer(('127.0.0.1', 8787), Handler)
    server.timeout = 10
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
