#include <Arduino.h>

#define PINOUT_DT0 18
#define PINOUT_DT1 19
#define PINOUT_DT2 21
#define PINOUT_DT3 22
#define PINOUT_CLK 23

void setupPinOut() {
    pinMode(PINOUT_DT0, OUTPUT);
    pinMode(PINOUT_DT1, OUTPUT);
    pinMode(PINOUT_DT2, OUTPUT);
    pinMode(PINOUT_DT3, OUTPUT);
    pinMode(PINOUT_CLK, OUTPUT);
}

void outputData(uint8_t value) {
    digitalWrite(PINOUT_CLK, HIGH);
    digitalWrite(PINOUT_DT0, ((value >> 3) & 0x1) ? HIGH : LOW);
    digitalWrite(PINOUT_DT1, ((value >> 2) & 0x1) ? HIGH : LOW);
    digitalWrite(PINOUT_DT2, ((value >> 1) & 0x1) ? HIGH : LOW);
    digitalWrite(PINOUT_DT3, ((value >> 0) & 0x1) ? HIGH : LOW);
    delay(100);
    digitalWrite(PINOUT_CLK, LOW);
}

void testPinOut() {
    Serial.println("<-- pintout test loop");
    uint8_t x = 0;
    while (true) {
        outputData(x);
        x = (x + 1) % 0x10;
        delay(400);
    }
}