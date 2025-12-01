# -*- coding: utf-8 -*-
# @Time    : 2021/4/20 10:53
# @Author  : RichardoMu
# @File    : move.py
# @Software: PyCharm

from time import sleep

from onvif import ONVIFCamera
import zeep
from zeep.transports import Transport
import requests
from requests.auth import HTTPDigestAuth

XMAX = 1
XMIN = -1
YMAX = 1
YMIN = -1


def zeep_pythonvalue(self, xmlvalue):
    return xmlvalue


def perform_move(ptz, request, timeout):
    # Start continuous move
    ptz.ContinuousMove(request)
    # Wait a certain time
    sleep(timeout)
    # Stop continuous move
    ptz.Stop({'ProfileToken': request.ProfileToken})


def move_up(ptz, request, timeout=1):
    print('move up...')
    request.Velocity.PanTilt.x = 0
    request.Velocity.PanTilt.y = YMAX
    perform_move(ptz, request, timeout)


def move_down(ptz, request, timeout=1):
    print('move down...')
    request.Velocity.PanTilt.x = 0
    request.Velocity.PanTilt.y = YMIN
    perform_move(ptz, request, timeout)


def move_right(ptz, request, timeout=1):
    print('move right...')
    request.Velocity.PanTilt.x = XMAX
    request.Velocity.PanTilt.y = 0

    perform_move(ptz, request, timeout)


def move_left(ptz, request, timeout=1):
    print('move left...')
    request.Velocity.PanTilt.x = XMIN
    request.Velocity.PanTilt.y = 0
    perform_move(ptz, request, timeout)


def zoom_up(ptz,request,timeout=1):
    print('zoom up')
    request.Velocity.Zoom.x = 1
    request.Velocity.PanTilt.x = 0
    request.Velocity.PanTilt.y = 0
    perform_move(ptz,request,timeout)


def zoom_dowm(ptz,request,timeout=1):
    print('zoom down')
    request.Velocity.Zoom.x = -1
    request.Velocity.PanTilt.x = 0
    request.Velocity.PanTilt.y = 0
    perform_move(ptz, request, timeout)


def make_camera(host, port, user, password):
    """Create an ONVIFCamera with WS-UsernameToken auth first; if the camera
    requires HTTP Digest only, retry with a Digest-auth transport."""
    # First try default (WS-UsernameToken) path
    try:
        cam = ONVIFCamera(host, port, user, password)
        # quick auth test
        dev = cam.create_devicemgmt_service()
        dev.GetDeviceInformation()
        return cam
    except Exception as e:
        msg = str(e).lower()
        # Common Hikvision case when ONVIF is set to Digest-only
        if 'requires authorization' in msg or 'not authorized' in msg or '401' in msg:
            session = requests.Session()
            session.auth = HTTPDigestAuth(user, password)
            transport = Transport(session=session, timeout=10)
            cam = ONVIFCamera(host, port, user, password, transport=transport)
            # test again; raise if still failing
            dev = cam.create_devicemgmt_service()
            dev.GetDeviceInformation()
            return cam
        raise


def continuous_move():
    mycam = make_camera('192.168.1.64', 80, 'admin', 'Rysera@12')
    # Create media service object with fallback to Media2 if needed
    try:
        media = mycam.create_media_service()
    except Exception:
        media = mycam.create_media2_service()
    # Create ptz service object
    ptz = mycam.create_ptz_service()

    # Get target profile
    zeep.xsd.simple.AnySimpleType.pythonvalue = zeep_pythonvalue
    media_profile = media.GetProfiles()[0]

    # Get PTZ configuration options for getting continuous move range
    request = ptz.create_type('GetConfigurationOptions')
    request.ConfigurationToken = media_profile.PTZConfiguration.token
    ptz_configuration_options = ptz.GetConfigurationOptions(request)

    request = ptz.create_type('ContinuousMove')
    request.ProfileToken = media_profile.token
    ptz.Stop({'ProfileToken': media_profile.token})

    if request.Velocity is None:
        request.Velocity = ptz.GetStatus({'ProfileToken': media_profile.token}).Position
        request.Velocity = ptz.GetStatus({'ProfileToken': media_profile.token}).Position
        request.Velocity.PanTilt.space = ptz_configuration_options.Spaces.ContinuousPanTiltVelocitySpace[0].URI
        request.Velocity.Zoom.space = ptz_configuration_options.Spaces.ContinuousZoomVelocitySpace[0].URI

    # Get range of pan and tilt
    # NOTE: X and Y are velocity vector
    global XMAX, XMIN, YMAX, YMIN
    XMAX = ptz_configuration_options.Spaces.ContinuousPanTiltVelocitySpace[0].XRange.Max
    XMIN = ptz_configuration_options.Spaces.ContinuousPanTiltVelocitySpace[0].XRange.Min
    YMAX = ptz_configuration_options.Spaces.ContinuousPanTiltVelocitySpace[0].YRange.Max
    YMIN = ptz_configuration_options.Spaces.ContinuousPanTiltVelocitySpace[0].YRange.Min


    for i in range(10):
        zoom_up(ptz,request)

    for i in range(10):
        zoom_dowm(ptz,request)
    # move right
    for i in range(10):
        move_right(ptz, request)

    # move left
    for i in range(10):

        move_left(ptz, request)

    # Move up
    for i in range(10):
        move_up(ptz, request)

    # move down
    for i in range(10):
        move_down(ptz, request)


if __name__ == '__main__':
    continuous_move()
