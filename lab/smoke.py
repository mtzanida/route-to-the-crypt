"""Opt-in integration test against the authenticated local AWS Emulator."""
from vault import Vault, create_client
from tests.test_vault import snapshot

vault = Vault(create_client())
vault.provision()
value = snapshot()
vault.save('quiet-night', value)
assert vault.load('quiet-night')['snapshot'] == value
print('PASS: local emulator CreateBucket/HeadBucket, PutObject and GetObject round trip')
