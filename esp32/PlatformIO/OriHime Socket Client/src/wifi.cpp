#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "KT_GiGA_1346";
const char* WIFI_PASS = "5cea1zh557";
const char* TEST_URL = "http://172.30.1.81:3000";

void setupWiFi() {
    Serial.print("*** Connecting to Wi-Fi ");
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println(" Connected!");
    Serial.print("*** IP Address: ");
    Serial.println(WiFi.localIP());

    HTTPClient http;
    int httpCode = -999;
    int testCount = 0;
    Serial.print("*** HTTP Request Test '");
    Serial.print(TEST_URL);
    Serial.println("' :");
    while (httpCode <= 0) {
        delay(500);
        if (testCount > 0) {
            Serial.printf("Error!\n%s\n", http.errorToString(httpCode).c_str());
        }
        http.begin(TEST_URL);
        httpCode = http.GET();
        http.end();
        testCount++;
        Serial.printf("\tTrying (%d) ... ", testCount);
    }
    Serial.printf("Success! (%d)\n", httpCode);
}

bool isWifiAvailable() {
    return WiFi.status() == WL_CONNECTED;
}