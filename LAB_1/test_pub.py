from paho.mqtt import client as mqtt_client
import paho.mqtt.client as mqtt
import time
import ssl

# Callback when the client connects to the MQTT broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to HiveMQ broker\n")
    else:
        print(f"Connection failed with code {rc}")

# Callback when the client disconnects
def on_disconnect(client, userdata, rc):
    print("Disconnected from HiveMQ broker")

# Callback when a message is published
def on_publish(client, userdata, mid):
    print("Message published successfully")

# Create an MQTT client instance
client = mqtt.Client(mqtt_client.CallbackAPIVersion.VERSION1, "PythonPub")

# Set the callback functions
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_publish = on_publish

# HiveMQ connection details
broker_address = "b6a46750eb7e476e91bc0e6bb56c2734.s1.eu.hivemq.cloud"
broker_port = 8883  # TLS port
username = "achi456"
password = "Achi@456$123"
keepalive = 60
qos = 0
publish_topic = "TalkTopic"

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
    
    # Start the MQTT loop to handle network traffic
    client.loop_start()
    
    # Give some time for the connection to establish
    time.sleep(2)
    
    # Publish loop
    while True:
        # Publish a message to the send topic
        value = input('Enter the message: ')
        
        if value.lower() == 'quit':
            break
            
        result = client.publish(publish_topic, value, qos)
        
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"Published message '{value}' to topic '{publish_topic}'\n")
        else:
            print(f"Failed to publish message. Error code: {result.rc}")
        
        # Wait for a moment to simulate some client activity
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