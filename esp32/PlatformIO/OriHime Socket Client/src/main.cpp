#include <Arduino.h>

// pinout.cpp
void setupPinOut();
void outputData(uint8_t value);
void testPinOut();

// wifi.cpp
void setupWiFi();
bool isWifiAvailable();

// socket.cpp
void setupWebSocket(
    void (*data_listener)(uint8_t)
);
bool isWebSocketAvailable();

//////////////////////////////////////////////////

void onReciveData(uint8_t data) {
  Serial.printf("\n---> Received Data : %d\n", data);
  outputData(data);
}

void setup() {
  Serial.begin(115200); // monitor_speed (platformio.ini)
  delay(1000);
  while (!Serial) {
  }
  Serial.println("\n===== SETUP START ====\n");

  setupWiFi();
  setupPinOut();
  setupWebSocket(onReciveData);

  Serial.println("\n===== SETUP E N D ====\n");
}

void loop() {
  Serial.println("\n===== PROCESS START ====\n");

  while (isWifiAvailable() && isWebSocketAvailable()) {
    delay(100);
  }

  Serial.println("\n===== PROCESS E N D ====\n");

  testPinOut();
}