from paho.mqtt import client as mqtt_client
import paho.mqtt.client as mqtt
import time
import ssl
import threading

# Global flag to track connection status
connected = False
connection_lock = threading.Lock()

# Callback when the client connects to the MQTT broker
def on_connect(client, userdata, flags, rc):
    global connected
    with connection_lock:
        if rc == 0:
            connected = True
            print("Connected to HiveMQ broker\n")
            # Subscribe to the topic after successful connection
            client.subscribe(subscribe_topic, qos)
            print(f"Subscribed to topic: {subscribe_topic}\n")
        else:
            connected = False
            print(f"Connection failed with code {rc}")

# Callback when the client disconnects
def on_disconnect(client, userdata, rc):
    global connected
    with connection_lock:
        connected = False
        if rc != 0:
            print(f"Unexpected disconnection from HiveMQ broker (rc: {rc})")
        else:
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

# Create an MQTT client instance with VERSION1 for stability
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
keepalive = 30  # Reduced keep-alive for more frequent heartbeats
qos = 0
subscribe_topic = "TalkTopic"  # Same topic as publisher

# Set username and password
client.username_pw_set(username, password)

# Configure TLS/SSL with better settings
context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE
# Use more compatible TLS settings
context.set_ciphers('DEFAULT')
client.tls_set_context(context)

def connect_mqtt():
    """Function to handle MQTT connection with retry logic"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            print(f"Connecting to {broker_address}:{broker_port}... (Attempt {retry_count + 1}/{max_retries})")
            client.connect(broker_address, broker_port, keepalive)
            return True
        except Exception as e:
            retry_count += 1
            print(f"Connection attempt {retry_count} failed: {e}")
            if retry_count < max_retries:
                print(f"Retrying in 3 seconds...")
                time.sleep(3)
    
    print("Failed to connect after maximum retries")
    return False

try:
    # Connect to the HiveMQ broker with retry logic
    if not connect_mqtt():
        print("Could not establish connection to MQTT broker")
        exit(1)
    
    # Start the MQTT loop to handle network traffic and callbacks
    client.loop_start()
    
    print("Subscriber is running. Press Ctrl+C to stop...")
    print("Waiting for messages...\n")
    
    # Keep the subscriber running with connection monitoring
    reconnect_attempts = 0
    max_reconnect_attempts = 5
    
    while True:
        time.sleep(2)  # Check every 2 seconds
        
        with connection_lock:
            if not connected:
                reconnect_attempts += 1
                if reconnect_attempts <= max_reconnect_attempts:
                    print(f"Connection lost, attempting to reconnect... (Attempt {reconnect_attempts}/{max_reconnect_attempts})")
                    client.loop_stop()
                    time.sleep(3)
                    if connect_mqtt():
                        client.loop_start()
                        reconnect_attempts = 0  # Reset counter on successful reconnection
                    else:
                        print("Failed to reconnect")
                else:
                    print("Maximum reconnection attempts reached, exiting...")
                    break
            else:
                reconnect_attempts = 0  # Reset counter when connected

except KeyboardInterrupt:
    print("\nKeyboard interrupt received...")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Disconnect from the MQTT broker
    try:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from the HiveMQ broker")
    except:
        pass