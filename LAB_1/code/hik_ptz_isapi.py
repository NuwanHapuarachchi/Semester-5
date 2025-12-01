#!/usr/bin/env python3
"""
Hikvision PTZ control via ISAPI (HTTP Digest Auth).

Why: Some Hikvision cameras are set to ONVIF auth = Digest only, which can
block WS-UsernameToken used by common ONVIF Python clients. ISAPI endpoints
work with simple HTTP Digest Auth and are reliable for PTZ.

Examples:
  python hik_ptz_isapi.py --host 192.168.1.64 --user admin --password "pass" --action stop
  python hik_ptz_isapi.py --host 192.168.1.64 --user admin --password "pass" --action move --x 40 --y 0 --z 0 --duration 500

Notes:
- x,y,z are integer speeds -100..100 for pan/tilt/zoom.
- duration in milliseconds (Hikvision expects ms). Use 0 for continuous until stop.
"""
import argparse
import sys
import time
import requests
from requests.auth import HTTPDigestAuth


def isapi_ptz_move(host, user, password, x=0, y=0, z=0, duration_ms=500, port=80, https=False):
    scheme = 'https' if https else 'http'
    url = f"{scheme}://{host}:{port}/ISAPI/PTZCtrl/channels/1/continuous"
    # Hikvision expects -100..100; xml body for continuous move
    xml = f"""
<PTZData version="2.0" xmlns="http://www.hikvision.com/ver20/XMLSchema">
  <pan>{int(x)}</pan>
  <tilt>{int(y)}</tilt>
  <zoom>{int(z)}</zoom>
  <PanTiltZoomTime>{int(duration_ms)}</PanTiltZoomTime>
</PTZData>
""".strip()
    r = requests.put(url, data=xml, auth=HTTPDigestAuth(user, password), headers={'Content-Type':'application/xml'}, timeout=5, verify=False)
    if r.status_code not in (200, 201, 202, 204):
        raise RuntimeError(f"ISAPI move failed: {r.status_code} {r.text}")


def isapi_ptz_stop(host, user, password, port=80, https=False):
    scheme = 'https' if https else 'http'
    url = f"{scheme}://{host}:{port}/ISAPI/PTZCtrl/channels/1/stop"
    r = requests.put(url, auth=HTTPDigestAuth(user, password), timeout=5, verify=False)
    if r.status_code not in (200, 201, 202, 204):
        raise RuntimeError(f"ISAPI stop failed: {r.status_code} {r.text}")


def main():
    p = argparse.ArgumentParser(description='Hikvision PTZ via ISAPI (HTTP Digest)')
    p.add_argument('--host', required=True)
    p.add_argument('--port', type=int, default=80)
    p.add_argument('--https', action='store_true', help='use https (default http)')
    p.add_argument('--user', required=True)
    p.add_argument('--password', required=True)
    p.add_argument('--action', required=True, choices=['move','stop'])
    p.add_argument('--x', type=int, default=0, help='pan speed -100..100')
    p.add_argument('--y', type=int, default=0, help='tilt speed -100..100')
    p.add_argument('--z', type=int, default=0, help='zoom speed -100..100')
    p.add_argument('--duration', type=int, default=500, help='move duration in ms; 0 = continuous until stop')
    args = p.parse_args()

    try:
        if args.action == 'stop':
            isapi_ptz_stop(args.host, args.user, args.password, port=args.port, https=args.https)
            print('PTZ stopped')
        else:
            isapi_ptz_move(args.host, args.user, args.password, x=args.x, y=args.y, z=args.z, duration_ms=args.duration, port=args.port, https=args.https)
            print(f"Moved x={args.x} y={args.y} z={args.z} for {args.duration}ms")
    except Exception as e:
        print('Error:', e)
        sys.exit(1)


if __name__ == '__main__':
    main()
