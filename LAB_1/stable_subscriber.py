import paho.mqtt.client as mqtt
import time
import ssl
import threading
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MQTTSubscriber:
    def __init__(self):
        self.client = None
        self.connected = False
        self.lock = threading.Lock()
        self.should_run = True
        
        # Connection settings
        self.broker_address = "b6a46750eb7e476e91bc0e6bb56c2734.s1.eu.hivemq.cloud"
        self.broker_port = 8883
        self.username = "achi456"
        self.password = "Achi@456$123"
        self.keepalive = 45  # Optimal keep-alive for HiveMQ Cloud
        self.qos = 0
        self.topic = "TalkTopic"
        self.client_id = f"PythonSub_{int(time.time())}"  # Unique client ID
        
        self.setup_client()
    
    def setup_client(self):
        """Initialize MQTT client with proper settings"""
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, self.client_id)
            
            # Set callbacks
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            self.client.on_message = self.on_message
            self.client.on_subscribe = self.on_subscribe
            
            # Set username and password
            self.client.username_pw_set(self.username, self.password)
            
            # Configure TLS/SSL for HiveMQ Cloud
            context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            self.client.tls_set_context(context)
            
            logger.info("MQTT client configured successfully")
            
        except Exception as e:
            logger.error(f"Failed to setup client: {e}")
    
    def on_connect(self, client, userdata, flags, rc):
        """Callback for when the client connects"""
        with self.lock:
            if rc == 0:
                self.connected = True
                logger.info("Successfully connected to HiveMQ broker")
                # Subscribe to topic
                client.subscribe(self.topic, self.qos)
                logger.info(f"Subscribed to topic: {self.topic}")
            else:
                self.connected = False
                logger.error(f"Failed to connect with code: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        """Callback for when the client disconnects"""
        with self.lock:
            self.connected = False
            if rc != 0:
                logger.warning(f"Unexpected disconnection (rc: {rc})")
            else:
                logger.info("Clean disconnection")
    
    def on_message(self, client, userdata, message):
        """Callback for when a message is received"""
        try:
            decoded_message = message.payload.decode('utf-8')
            logger.info(f"📨 Message received: '{decoded_message}'")
            logger.info(f"   Topic: {message.topic}")
            logger.info(f"   QoS: {message.qos}, Retain: {message.retain}")
            print(f"\n*** NEW MESSAGE ***")
            print(f"Content: {decoded_message}")
            print(f"Topic: {message.topic}")
            print(f"******************\n")
        except UnicodeDecodeError:
            logger.warning(f"Received non-UTF8 message from {message.topic}")
    
    def on_subscribe(self, client, userdata, mid, granted_qos):
        """Callback for subscription confirmation"""
        logger.info(f"Subscription confirmed with QoS: {granted_qos[0]}")
    
    def connect(self):
        """Connect to MQTT broker with retry logic"""
        max_retries = 5
        retry_delay = 5
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Connecting to {self.broker_address}:{self.broker_port} (Attempt {attempt + 1}/{max_retries})")
                self.client.connect(self.broker_address, self.broker_port, self.keepalive)
                return True
            except Exception as e:
                logger.error(f"Connection attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
        
        logger.error("Failed to connect after all retries")
        return False
    
    def run(self):
        """Main loop to keep the subscriber running"""
        logger.info("Starting MQTT Subscriber...")
        
        if not self.connect():
            logger.error("Could not establish initial connection")
            return
        
        # Start the MQTT loop
        self.client.loop_start()
        
        logger.info("🔄 Subscriber is running. Press Ctrl+C to stop...")
        logger.info("📡 Waiting for messages...\n")
        
        # Main monitoring loop
        reconnect_count = 0
        max_reconnects = 10
        
        try:
            while self.should_run:
                time.sleep(3)  # Check connection every 3 seconds
                
                with self.lock:
                    if not self.connected and self.should_run:
                        reconnect_count += 1
                        if reconnect_count <= max_reconnects:
                            logger.warning(f"Connection lost. Reconnecting... ({reconnect_count}/{max_reconnects})")
                            self.client.loop_stop()
                            time.sleep(2)
                            
                            if self.connect():
                                self.client.loop_start()
                                reconnect_count = 0  # Reset on successful reconnection
                            else:
                                logger.error("Reconnection failed")
                        else:
                            logger.error("Maximum reconnection attempts reached")
                            break
                    elif self.connected:
                        reconnect_count = 0  # Reset counter when connected
        
        except KeyboardInterrupt:
            logger.info("Keyboard interrupt received")
        except Exception as e:
            logger.error(f"An error occurred: {e}")
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean shutdown"""
        logger.info("Shutting down subscriber...")
        self.should_run = False
        try:
            self.client.loop_stop()
            self.client.disconnect()
            logger.info("Disconnected successfully")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

if __name__ == "__main__":
    subscriber = MQTTSubscriber()
    subscriber.run()
