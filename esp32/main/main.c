/* ESP32 WROOM 32
 * https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf
 */

#include <stdio.h>
#include <inttypes.h>
#include <string.h>
#include "sdkconfig.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_chip_info.h"
#include "esp_flash.h"
#include "esp_system.h"
#include "jsmn.h"

// wifi.c
extern void start_wifi();
// pinout.c
extern void setupOutput();
extern void outputData(uint8_t value);
extern void pinout_test();
// socket.c
extern void websocket_start();

#define MAX_JSON_TOKENS 10
static jsmn_parser parser;
static jsmntok_t jtokens[MAX_JSON_TOKENS]; /* We expect no more than MAX_JSON_TOKENS JSON tokens */

void printChipInfo() {
    /* Print chip information */
    esp_chip_info_t chip_info;
    uint32_t flash_size;
    esp_chip_info(&chip_info);
    printf("This is %s chip with %d CPU core(s), %s%s%s%s, ",
           CONFIG_IDF_TARGET,
           chip_info.cores,
           (chip_info.features & CHIP_FEATURE_WIFI_BGN) ? "WiFi/" : "",
           (chip_info.features & CHIP_FEATURE_BT) ? "BT" : "",
           (chip_info.features & CHIP_FEATURE_BLE) ? "BLE" : "",
           (chip_info.features & CHIP_FEATURE_IEEE802154) ? ", 802.15.4 (Zigbee/Thread)" : "");

    unsigned major_rev = chip_info.revision / 100;
    unsigned minor_rev = chip_info.revision % 100;
    printf("silicon revision v%d.%d, ", major_rev, minor_rev);
    if(esp_flash_get_size(NULL, &flash_size) != ESP_OK) {
        printf("Get flash size failed");
        return;
    }

    printf("%" PRIu32 "MB %s flash\n", flash_size / (uint32_t)(1024 * 1024),
           (chip_info.features & CHIP_FEATURE_EMB_FLASH) ? "embedded" : "external");

    printf("Minimum free heap size: %" PRIu32 " bytes\n", esp_get_minimum_free_heap_size());
}

void restart() {
    for (int i = 10; i >= 0; i--) {
        printf("Restarting in %d seconds...\n", i);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    printf("Restarting now.\n");
    fflush(stdout);
    esp_restart();
}

void parse_numData(const char *strJson, int len) {
    if (len < 10) {
        return;
    }
    jsmn_init(&parser);
    int num_tokens = jsmn_parse(&parser, strJson, len, jtokens, MAX_JSON_TOKENS);
    if (num_tokens < 4) {
        return;
    }
    bool bNumDataEvent = false;
    int nValue = -1;
    bool bParseType = false;
    bool bParseData = false;
    int firstKeyIndex = -1;
    for (int i = 0; i < num_tokens; i++) {
        bool bString = (jtokens[i].type == JSMN_STRING);
        bool bPrimitive = (jtokens[i].type == JSMN_PRIMITIVE);
        bool bIsKey = false;
        if (firstKeyIndex < 0) {
            if (bString) {
                firstKeyIndex = i;
                bIsKey = true;
            } else {
                continue;
            }
        } else {
            bIsKey = ((i - firstKeyIndex) % 2 == 0);
        }

        if (bIsKey) {
            bParseType = false;
            bParseData = false;
            if (bString) {
                if (strncmp(strJson + jtokens[i].start, "type", 4) == 0) {
                    bParseType = true;
                } else if (strncmp(strJson + jtokens[i].start, "data", 4) == 0) {
                    bParseData = true;
                }
            }
            continue;
        }
        if (!bParseType && !bParseData) {
            continue;
        }
        if (bParseType) {
            if (bString) {
                if (strncmp(strJson + jtokens[i].start, "numData", 6) == 0) {
                    bNumDataEvent = true;
                }
            }
            continue;
        }
        if (!bPrimitive) {
            continue;
        }
        bool bValid = true;
        int n = 0;
        int digit_pos = 0;
        for (int p = jtokens[i].end-1; p >= jtokens[i].start; p--) {
            char c = strJson[p];
            if (c < '0' || c > '9') {
                bValid = false;
                break;
            }
            int x = c - '0';
            for (int j = 0; j < digit_pos; j++) {
                x *= 10;
            }
            n += x;
            digit_pos++;
        }
        if (bValid) {
            nValue = n;
        }
    }

    if (bNumDataEvent) {
        printf("---> Num Data: %d\n", nValue);
        outputData((uint8_t)nValue);
    }
}

void app_main() {
    printf("\n\n<--- DEVICE STARTED\n");
    printChipInfo();
    setupOutput();
    start_wifi();

    const char *testJson = "{\"type\":\"numData\",\"data\":1201}";
    parse_numData(testJson, strlen(testJson));
    
    websocket_start(parse_numData);
    pinout_test();
}
