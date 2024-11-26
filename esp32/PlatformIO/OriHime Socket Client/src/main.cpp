#include <Arduino.h>

// pinout.cpp
void setupPinOut();
void outputData(uint8_t value);
void testPinOut();

// wifi.cpp
void setupWiFi();
bool isWifiAvailable();

void setup() {
  Serial.begin(115200); // monitor_speed (platformio.ini)
  delay(1000);
  while (!Serial) {
  }
  Serial.println("\n===== SETUP START ====\n");

  setupWiFi();
  setupPinOut();

  Serial.println("\n===== SETUP E N D ====\n");
}

void loop() {
  // while (isWifiAvailable()) {
  // }

  // wifi disconnected
  testPinOut();
}