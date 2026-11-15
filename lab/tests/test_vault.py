import io
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vault import BUCKET, Vault, create_client, emulator_settings, validate_snapshot


def snapshot():
    return {'schemaVersion': 1, 'modelType': 'educational-simplification',
            'scenarioId': 'quiet-night', 'scenarioTitle': 'A quiet night',
            'exportedAt': '2026-11-15T00:00:00Z', 'disclaimer': 'Teaching model',
            'endpoints': [
                {'id': 'eu-primary', 'region': 'EU-WEST', 'city': 'Dublin', 'role': 'Primary', 'healthy': True},
                {'id': 'us-standby', 'region': 'US-EAST', 'city': 'N. Virginia', 'role': 'Standby', 'healthy': True}],
            'illustrativeActiveEndpointId': 'eu-primary'}


class S3:
    def __init__(self):
        self.calls, self.objects = [], {}

    def put_object(self, **kwargs):
        self.calls.append(kwargs)
        self.objects[kwargs['Key']] = kwargs['Body']

    def get_object(self, **kwargs):
        self.body = io.BytesIO(self.objects[kwargs['Key']])
        return {'Body': self.body}


class Tests(unittest.TestCase):
    def test_save_restore_and_stream_close(self):
        client = S3()
        vault = Vault(client)
        original = snapshot()
        vault.save('quiet-night', original)
        original['endpoints'][0]['healthy'] = False
        result = vault.load('quiet-night')
        self.assertTrue(result['snapshot']['endpoints'][0]['healthy'])
        self.assertEqual(client.calls[0]['Bucket'], BUCKET)
        self.assertEqual(client.calls[0]['Key'], 'scenarios/quiet-night.json')
        self.assertTrue(client.body.closed)

    def test_invalid_snapshot_never_reaches_s3(self):
        client = S3()
        for field, value in [('schemaVersion', 2), ('scenarioId', '../secret'),
                             ('illustrativeActiveEndpointId', 'us-standby')]:
            data = snapshot(); data[field] = value
            with self.assertRaises(ValueError):
                Vault(client).save('quiet-night', data)
        data = snapshot(); data['endpoints'][0]['healthy'] = 'false'
        with self.assertRaises(ValueError):
            Vault(client).save('quiet-night', data)
        self.assertEqual(client.calls, [])

    def test_client_errors_are_not_success(self):
        with patch.object(S3, 'put_object', side_effect=RuntimeError('not implemented')):
            with self.assertRaises(RuntimeError):
                Vault(S3()).save('quiet-night', snapshot())

    def test_missing_emulator_files_fail_closed(self):
        with tempfile.TemporaryDirectory() as home:
            with self.assertRaises(ValueError):
                emulator_settings(home=home)
        for port in ('https://s3.amazonaws.com', '0', '9297.evil', '65536'):
            with self.assertRaises(ValueError):
                emulator_settings(port=port)

    def test_real_environment_credentials_and_endpoint_are_ignored(self):
        with tempfile.TemporaryDirectory() as home:
            root = Path(home)/'.aws/emulator/9297'; root.mkdir(parents=True)
            (root/'emulator_credentials').write_text('[default]\naws_access_key_id=emulator-key\naws_secret_access_key=emulator-secret\n')
            (root/'ca.pem').write_text('certificate')
            with patch.dict('os.environ', {'AWS_ENDPOINT_URL': 'https://s3.amazonaws.com',
                                          'AWS_PROFILE': 'production',
                                          'AWS_ACCESS_KEY_ID': 'real-key'}):
                settings = emulator_settings(home=home)
                with patch('vault.emulator_settings', return_value=settings), patch('boto3.client') as client:
                    create_client()
                kwargs = client.call_args.kwargs
                self.assertEqual(kwargs['endpoint_url'], 'https://127.0.0.1:9297')
                self.assertEqual(kwargs['aws_access_key_id'], 'emulator-key')
                self.assertEqual(kwargs['config'].proxies, {})
                self.assertEqual(kwargs['verify'], str(root/'ca.pem'))

    def test_oversized_stored_file_is_rejected_and_closed(self):
        client = S3(); client.objects['scenarios/quiet-night.json'] = b'x' * 32769
        with self.assertRaises(ValueError):
            Vault(client).load('quiet-night')
        self.assertTrue(client.body.closed)


if __name__ == '__main__':
    unittest.main()
