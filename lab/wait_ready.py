"""Wait briefly for a local emulator without contacting AWS."""
import ssl
import time
import urllib.request
from vault import emulator_settings

for attempt in range(30):
    try:
        settings = emulator_settings()
        context = ssl.create_default_context(cafile=settings['verify'])
        # Disable ambient proxies for this local health check too.
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}),
                                            urllib.request.HTTPSHandler(context=context))
        with opener.open(settings['endpoint_url']+'/__admin/health', timeout=1) as response:
            if response.status == 200:
                print('Local emulator ready')
                break
    except Exception:
        time.sleep(.5)
else:
    raise SystemExit('Local emulator did not become ready')
