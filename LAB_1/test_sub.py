from paho.mqtt import client as mqtt_client
import paho.mqtt.client as mqtt
import time
import ssl

# Callback when the client connects to the MQTT broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to HiveMQ broker\n")
        # Subscribe to the topic after successful connection
        client.subscribe(subscribe_topic, qos)
        print(f"Subscribed to topic: {subscribe_topic}\n")
    else:
        print(f"Connection failed with code {rc}")

# Callback when the client disconnects
def on_disconnect(client, userdata, rc):
    print("Disconnected from HiveMQ broker")

# Callback when a message is received
def on_message(client, userdata, message):
    try:
        decoded_message = message.payload.decode('utf-8')
        print(f"Received message: '{decoded_message}' from topic: '{message.topic}'")
        print(f"QoS: {message.qos}, Retain: {message.retain}\n")
    except UnicodeDecodeError:
        print(f"Received non-UTF8 message from topic: '{message.topic}'")
        print(f"Raw payload: {message.payload}\n")

# Callback when subscription is confirmed
def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Subscription confirmed with QoS: {granted_qos[0]}\n")

# Create an MQTT client instance
client = mqtt.Client(mqtt_client.CallbackAPIVersion.VERSION1, "PythonSub")

# Set the callback functions
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
client.on_subscribe = on_subscribe

# HiveMQ connection details
broker_address = "b6a46750eb7e476e91bc0e6bb56c2734.s1.eu.hivemq.cloud"
broker_port = 8883  # TLS port
username = "achi456"
password = "Achi@456$123"
keepalive = 60
qos = 0
subscribe_topic = "TalkTopic"  # Same topic as publisher

# Set username and password
client.username_pw_set(username, password)

# Configure TLS/SSL
context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE
client.tls_set_context(context)

try:
    # Connect to the HiveMQ broker
    print(f"Connecting to {broker_address}:{broker_port}...")
    client.connect(broker_address, broker_port, keepalive)
    
    # Start the MQTT loop to handle network traffic and callbacks
    client.loop_start()
    
    print("Subscriber is running. Press Ctrl+C to stop...")
    print("Waiting for messages...\n")
    
    # Keep the subscriber running
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\nKeyboard interrupt received...")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Disconnect from the MQTT broker
    client.loop_stop()
    client.disconnect()
    print("Disconnected from the HiveMQ broker")