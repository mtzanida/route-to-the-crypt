"""A local-only S3 adapter. No public AWS endpoint or credential-chain fallback."""
import configparser
import json
import os
from pathlib import Path
import re

BUCKET = 'route-to-the-crypt-local'
MAX_BYTES = 32768
SCENARIOS = {'quiet-night', 'primary-fades', 'dark-regions'}
ENDPOINTS = [
    ('eu-primary', 'EU-WEST', 'Dublin', 'Primary'),
    ('us-standby', 'US-EAST', 'N. Virginia', 'Standby'),
]


def validate_snapshot(value, scenario_id):
    if not isinstance(value, dict) or scenario_id not in SCENARIOS:
        raise ValueError('Unknown scenario or invalid snapshot')
    if type(value.get('schemaVersion')) is not int or value['schemaVersion'] != 1 or value.get('modelType') != 'educational-simplification':
        raise ValueError('Unsupported snapshot format')
    if value.get('scenarioId') != scenario_id:
        raise ValueError('Snapshot does not match the selected scenario')
    endpoints = value.get('endpoints')
    if not isinstance(endpoints, list) or len(endpoints) != 2:
        raise ValueError('Snapshot must have two endpoints')
    for endpoint, expected in zip(endpoints, ENDPOINTS):
        if not isinstance(endpoint, dict) or set(endpoint) != {'id', 'region', 'city', 'role', 'healthy'}:
            raise ValueError('Invalid endpoint fields')
        if tuple(endpoint.get(key) for key in ('id', 'region', 'city', 'role')) != expected:
            raise ValueError('Endpoint does not match this teaching model')
        if type(endpoint['healthy']) is not bool:
            raise ValueError('Endpoint health must be true or false')
    active = next((e['id'] for e in endpoints if e['healthy']), None)
    if value.get('illustrativeActiveEndpointId') != active:
        raise ValueError('Snapshot outcome does not match endpoint health')
    for field in ('scenarioTitle', 'exportedAt', 'disclaimer'):
        if not isinstance(value.get(field), str) or not 0 < len(value[field]) <= 1024:
            raise ValueError('Invalid snapshot metadata')
    return value


def emulator_settings(port=None, home=None):
    port = str(port if port is not None else os.environ.get('CRYPT_EMULATOR_PORT', '9297'))
    if not re.fullmatch(r'[0-9]{1,5}', port) or not 1024 <= int(port) <= 65535:
        raise ValueError('CRYPT_EMULATOR_PORT must be a local port between 1024 and 65535')
    directory = (Path(home) if home else Path.home())/'.aws'/'emulator'/port
    credentials = configparser.ConfigParser(interpolation=None)
    if not credentials.read(directory/'emulator_credentials') or not credentials.has_section('default'):
        raise ValueError('Start AWS Emulator with authentication enabled first')
    key = credentials.get('default', 'aws_access_key_id', fallback='')
    secret = credentials.get('default', 'aws_secret_access_key', fallback='')
    certificate = directory/'ca.pem'
    if not key or not secret or not certificate.is_file():
        raise ValueError('Emulator credentials or CA certificate are missing')
    return {
        'endpoint_url': f'https://127.0.0.1:{port}',
        'aws_access_key_id': key, 'aws_secret_access_key': secret,
        'aws_session_token': None, 'region_name': 'us-east-1',
        'verify': str(certificate),
    }


def create_client():
    import boto3
    from botocore.config import Config
    settings = emulator_settings()
    # Explicit keys bypass AWS_PROFILE, environment keys, SSO and instance metadata.
    # An IP endpoint, path-style S3 and disabled proxies keep requests on loopback.
    return boto3.client('s3', **settings, config=Config(
        s3={'addressing_style': 'path'}, proxies={},
        connect_timeout=2, read_timeout=5,
        retries={'total_max_attempts': 1},
    ))


class Vault:
    def __init__(self, client):
        self.client = client

    def provision(self):
        from botocore.exceptions import ClientError
        try:
            self.client.head_bucket(Bucket=BUCKET)
        except ClientError as exc:
            if exc.response['Error']['Code'] not in ('404', 'NoSuchBucket', 'NotFound'):
                raise
            self.client.create_bucket(Bucket=BUCKET)

    def save(self, scenario_id, value):
        value = validate_snapshot(value, scenario_id)
        payload = json.dumps(value, ensure_ascii=False).encode('utf-8')
        if len(payload) > MAX_BYTES:
            raise ValueError('Snapshot is too large')
        self.client.put_object(Bucket=BUCKET, Key=f'scenarios/{scenario_id}.json',
                               Body=payload, ContentType='application/json')
        return {'operation': 'PutObject', 'key': f'scenarios/{scenario_id}.json'}

    def load(self, scenario_id):
        if scenario_id not in SCENARIOS:
            raise ValueError('Unknown scenario')
        response = self.client.get_object(Bucket=BUCKET, Key=f'scenarios/{scenario_id}.json')
        body = response['Body']
        try:
            raw = body.read(MAX_BYTES + 1)
        finally:
            body.close()
        if len(raw) > MAX_BYTES:
            raise ValueError('Stored snapshot is too large')
        value = validate_snapshot(json.loads(raw), scenario_id)
        return {'snapshot': value, 'operation': 'GetObject', 'key': f'scenarios/{scenario_id}.json'}
