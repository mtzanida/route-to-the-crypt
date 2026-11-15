"""Opt-in local end-to-end API check through the Vite development proxy."""
import json
import urllib.error
import urllib.request
from tests.test_vault import snapshot

opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def request(path, value=None, expected=200, origin=None):
    headers = {}
    if value is not None:
        headers['Content-Type'] = 'application/json'
    if origin:
        headers['Origin'] = origin
    req = urllib.request.Request('http://127.0.0.1:5173/api/vault/'+path,
                                 data=json.dumps(value).encode() if value is not None else None,
                                 headers=headers)
    try:
        response = opener.open(req, timeout=10)
    except urllib.error.HTTPError as exc:
        response = exc
    with response:
        assert response.status == expected, (response.status, expected, response.read())
        return json.load(response)


assert request('status')['storage'] == 'aws-emulator'
value = snapshot()
assert request('quiet-night', value)['operation'] == 'PutObject'
assert request('quiet-night')['snapshot'] == value
value['endpoints'][0]['healthy'] = False
value['illustrativeActiveEndpointId'] = 'us-standby'
request('quiet-night', value)
assert request('quiet-night')['snapshot']['endpoints'][0]['healthy'] is False
request('dark-regions', expected=404)
value['endpoints'][0]['healthy'] = 'false'
request('quiet-night', value, expected=400)
request('status', expected=403, origin='https://example.org')
print('PASS: Vite proxy → bridge → emulator S3 → response; save/restore, missing, invalid and foreign-origin cases')
