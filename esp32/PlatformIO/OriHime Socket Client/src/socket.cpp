#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

const char* WEBSOCKET_URL = "15.164.244.8";
const int   WEBSPCKET_PORT  = 3001;
const char* WEBSOCKET_ROOM  = "Usagi";

websockets::WebsocketsClient client;
bool isJoinedIntoRoom = false;

void setupWebSocket(
    void (*data_listener)(uint8_t)
) {
    Serial.println("[WS] Connecting to WebSocket server...");
    
    client.onMessage([
        data_listener
    ](websockets::WebsocketsMessage message) {
        Serial.print("[WS] Message received: \n");
        Serial.println(message.data());
        Serial.println("");

        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, message.data());
        if (error) {
            // Serial.print("deserializeJson() failed: ");
            // Serial.println(error.c_str());
            return;
        }
        
        const char* type = doc["type"];
        if (strcmp(type, "numData") == 0) {
            uint8_t dataValue = doc["data"];
            if (data_listener != nullptr) {
                data_listener(dataValue);
            }
        }
    });

    client.onEvent([](websockets::WebsocketsEvent event, String data) {
        if (event == websockets::WebsocketsEvent::ConnectionOpened) {
            Serial.println("[WS] WebSocket connection opened");
        } else if (event == websockets::WebsocketsEvent::ConnectionClosed) {
            Serial.println("[WS] WebSocket connection closed");
        } else if (event == websockets::WebsocketsEvent::GotPing) {
            Serial.println("[WS] Ping received!");
        } else if (event == websockets::WebsocketsEvent::GotPong) {
            Serial.println("[WS] Pong received!");
        }
    });

    Serial.printf("[WS] Server : '%s'\n", WEBSOCKET_URL);
    Serial.printf("[WS] Port   : %d", WEBSPCKET_PORT);
    while (!client.connect(WEBSOCKET_URL, WEBSPCKET_PORT, "/")) {
        Serial.println("[WS] WebSocket connection failed!");
        delay(1000);
    }
    Serial.println("[WS] WebSocket connected!");

    Serial.printf("[WS] Joining the Room '%s'...", WEBSOCKET_ROOM);
    char data[128];
    int len = sprintf(data, "{\"type\":\"moveToRoom\", \"roomId\":\"%s\"}", WEBSOCKET_ROOM);
    client.send(data);
}

bool isWebSocketAvailable() {
    if (client.available()) {
        client.poll();
        return true;
    }
    return false;
}
