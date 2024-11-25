#include <Arduino.h>

// pinout.cpp
void setupPinOut();
void outputData(uint8_t value);
void testPinOut();

void setup() {
  setupPinOut();
}

void loop() {
  testPinOut();
}