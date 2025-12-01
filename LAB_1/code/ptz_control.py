#!/usr/bin/env python3
"""
ptz_control.py

Lightweight CLI to control a Hikvision PTZ camera over ONVIF.

Usage examples:
  
    --host 192.168.1.100 --user admin --password 12345 --action stop
  python ptz_control.py --host 192.168.1.100 --user admin --password 12345 --action relative_move --x 0.1 --y 0.0 --z 0.0
  python ptz_control.py --host 192.168.1.100 --user admin --password 12345 --action continuous_move --x 0.5 --y 0 --z 0 --duration 2
  python ptz_control.py --host 192.168.1.100 --user admin --password 12345 --action relative_move --minimal

Notes:
- ONVIF PTZ control uses HTTP/SOAP (typically port 80 on Hikvision). RTSP 554 is for video streaming, not PTZ control.
- Use --minimal for simplified PTZ control with sensible defaults.
- If you get an ImportError, install: pip install onvif-zeep
"""
import argparse
import sys
import time

try:
    from onvif import ONVIFCamera
except ImportError:
    try:
        from onvif_zeep import ONVIFCamera
    except ImportError as e:
        print("ERROR: could not import ONVIF libraries (onvif/onvif_zeep).\nPlease install a compatible package, e.g.:\n  pip install onvif-zeep\nor\n  pip install onvif")
        raise


def get_camera(host, port, user, password, wsdl_dir=None):
    # Create ONVIF camera client. Let the package use its bundled WSDLs by default.
    camera = ONVIFCamera(host, port, user, password) if wsdl_dir is None else ONVIFCamera(host, port, user, password, wsdl_dir)
    # Optional: basic device info (helps verify auth works)
    try:
        devicemgmt = camera.create_devicemgmt_service()
        device_info = devicemgmt.GetDeviceInformation()
        print(f"Camera info: {device_info.Manufacturer} {device_info.Model}")
    except Exception as auth_test_error:
        print(f"Warning: device info not available: {auth_test_error}")
    return camera


def get_profile(media_service):
    profiles = media_service.GetProfiles()
    if not profiles:
        raise RuntimeError("No media profiles found on camera")
    return profiles[0]


def stop(ptz, profile_token):
    req = ptz.create_type('Stop')
    req.ProfileToken = profile_token
    req.PanTilt = True
    req.Zoom = True
    ptz.Stop(req)


def relative_move(ptz, profile_token, x=0.0, y=0.0, z=0.0):
    req = ptz.create_type('RelativeMove')
    req.ProfileToken = profile_token
    req.Translation = ptz.GetStatus({'ProfileToken': profile_token}).Position if False else None
    # build velocity request using simple dicts friendly to zeep
    rel = ptz.create_type('RelativeMove')
    rel.ProfileToken = profile_token
    rel.Translation = {
        'PanTilt': {'x': float(x), 'y': float(y)},
        'Zoom': {'x': float(z)}
    }
    # perform move
    ptz.RelativeMove(rel)


def absolute_move(ptz, profile_token, pan, tilt, zoom):
    req = ptz.create_type('AbsoluteMove')
    req.ProfileToken = profile_token
    req.Position = {
        'PanTilt': {'x': float(pan), 'y': float(tilt)},
        'Zoom': {'x': float(zoom)}
    }
    ptz.AbsoluteMove(req)


def continuous_move(ptz, profile_token, x=0.0, y=0.0, z=0.0, timeout=1.0):
    req = ptz.create_type('ContinuousMove')
    req.ProfileToken = profile_token
    # Velocity structure
    req.Velocity = {
        'PanTilt': {'x': float(x), 'y': float(y)},
        'Zoom': {'x': float(z)}
    }
    if timeout is None or timeout <= 0:
        ptz.ContinuousMove(req)
    else:
        # Move for duration then stop
        ptz.ContinuousMove(req)
        time.sleep(timeout)
        stop(ptz, profile_token)


def set_preset(ptz, profile_token, preset_name=None):
    req = ptz.create_type('SetPreset')
    req.ProfileToken = profile_token
    if preset_name:
        req.PresetName = preset_name
    res = ptz.SetPreset(req)
    return res


def goto_preset(ptz, profile_token, preset_token):
    req = ptz.create_type('GotoPreset')
    req.ProfileToken = profile_token
    req.PresetToken = preset_token
    ptz.GotoPreset(req)


def main():
    parser = argparse.ArgumentParser(description='Control Hikvision PTZ via ONVIF')
    parser.add_argument('--host', required=True, help='camera IP or hostname')
    parser.add_argument('--port', type=int, default=80, help='camera HTTP port for ONVIF (default: 80)')
    parser.add_argument('--user', required=True, help='username')
    parser.add_argument('--password', required=True, help='password')
    parser.add_argument('--wsdl-dir', default=None, help='optional WSDL directory for ONVIF library')
    parser.add_argument('--minimal', action='store_true', help='minimal mode: simplified PTZ control')
    parser.add_argument('--action', required=True, choices=['stop', 'relative_move', 'absolute_move', 'continuous_move', 'set_preset', 'goto_preset', 'test_connection'], help='action to perform')
    parser.add_argument('--x', type=float, default=0.0, help='pan or x velocity/position')
    parser.add_argument('--y', type=float, default=0.0, help='tilt or y velocity/position')
    parser.add_argument('--z', type=float, default=0.0, help='zoom or z velocity/position')
    parser.add_argument('--duration', type=float, default=1.0, help='duration for continuous move in seconds')
    parser.add_argument('--preset-name', help='preset name for set_preset')
    parser.add_argument('--preset-token', help='preset token for goto_preset')

    args = parser.parse_args()

    # Minimal mode: use simpler values and shorter timeouts
    if args.minimal:
        if args.action == 'continuous_move' and args.duration == 1.0:
            args.duration = 0.5  # shorter default duration
        # Use smaller movement values in minimal mode
        if args.action in ['relative_move', 'continuous_move']:
            if args.x == 0.0 and args.y == 0.0 and args.z == 0.0:
                # Set default minimal movements
                if args.action == 'relative_move':
                    args.x, args.y = 0.1, 0.0  # small pan right
                elif args.action == 'continuous_move':
                    args.x, args.y = 0.3, 0.0  # slow pan right

    try:
        print(f"Connecting to {args.host}:{args.port} as {args.user}...")
        cam = get_camera(args.host, args.port, args.user, args.password, args.wsdl_dir)
        print("Creating media service...")
        # Try Media service (v1), then Media2 as fallback
        try:
            media = cam.create_media_service()
            media_service_name = 'media'
        except Exception as _e_media_v1:
            media = cam.create_media2_service()
            media_service_name = 'media2'
        print(f"Using {media_service_name} service")
        print("Creating PTZ service...")
        ptz = None
        try:
            ptz = cam.create_ptz_service()
        except Exception as ptz_error:
            if args.action == 'test_connection':
                print(f"PTZ service creation failed: {ptz_error}")
                print("This camera may not support PTZ or PTZ may be disabled.")
            else:
                print(f"PTZ service creation failed: {ptz_error}")
                print("This camera may not support PTZ or PTZ may be disabled.")
                sys.exit(1)
        print("Getting profile...")
        try:
            profile = get_profile(media)
            token = profile.token
            print(f"Using profile token: {token}")
        except Exception as profile_error:
            print(f"Failed to get media profile: {profile_error}")
            if args.action == 'test_connection':
                print("Media service connected but no valid profiles found")
                return
            else:
                sys.exit(1)

        if args.action == 'test_connection':
            print("Connection successful!")
            print(f"Camera capabilities: Media service available")
            if ptz:
                try:
                    ptz_status = ptz.GetStatus({'ProfileToken': token})
                    print(f"PTZ Status: {ptz_status}")
                    print("PTZ service is available and working")
                except Exception as e:
                    print(f"PTZ status check failed: {e}")
            else:
                print("PTZ service not available")
            return

        if not ptz:
            print("PTZ service required but not available")
            sys.exit(1)

        if args.action == 'stop':
            stop(ptz, token)
            print('Stopped movement')
        elif args.action == 'relative_move':
            relative_move(ptz, token, x=args.x, y=args.y, z=args.z)
            print('Relative move requested')
        elif args.action == 'absolute_move':
            absolute_move(ptz, token, pan=args.x, tilt=args.y, zoom=args.z)
            print('Absolute move requested')
        elif args.action == 'continuous_move':
            continuous_move(ptz, token, x=args.x, y=args.y, z=args.z, timeout=args.duration)
            print('Continuous move for', args.duration, 'seconds')
        elif args.action == 'set_preset':
            res = set_preset(ptz, token, preset_name=args.preset_name)
            print('Set preset:', res)
        elif args.action == 'goto_preset':
            if not args.preset_token:
                print('preset-token is required for goto_preset')
                sys.exit(2)
            goto_preset(ptz, token, args.preset_token)
            print('Goto preset requested')

    except Exception as e:
        print('Error communicating with camera:', e)
        sys.exit(1)


if __name__ == '__main__':
    main()
