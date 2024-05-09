#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <inttypes.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"

#define GPIO_DT0 CONFIG_GPIO_OUTPUT_DATA0
#define GPIO_DT1 CONFIG_GPIO_OUTPUT_DATA1
#define GPIO_DT2 CONFIG_GPIO_OUTPUT_DATA2
#define GPIO_DT3 CONFIG_GPIO_OUTPUT_DATA3
#define GPIO_CLK CONFIG_GPIO_OUTPUT_CLOCK
#define GPIO_OUTPUT_PIN_SEL  ((1ULL<<CONFIG_GPIO_OUTPUT_DATA0) | (1ULL<<CONFIG_GPIO_OUTPUT_DATA1) | (1ULL<<CONFIG_GPIO_OUTPUT_DATA2)  | (1ULL<<CONFIG_GPIO_OUTPUT_DATA3)  | (1ULL<<CONFIG_GPIO_OUTPUT_CLOCK))
/*
 * Let's say, GPIO_OUTPUT_IO_0=18, GPIO_OUTPUT_IO_1=19
 * In binary representation,
 * 1ULL<<GPIO_OUTPUT_IO_0 is equal to 0000000000000000000001000000000000000000 and
 * 1ULL<<GPIO_OUTPUT_IO_1 is equal to 0000000000000000000010000000000000000000
 * GPIO_OUTPUT_PIN_SEL                0000000000000000000011000000000000000000
 * */

void setupOutput() {
    printf("GPIO_DT0=%d, GPIO_DT1=%d, GPIO_DT2=%d, GPIO_DT3=%d, GPIO_CLK=%d\n", GPIO_DT0, GPIO_DT1, GPIO_DT2, GPIO_DT3, GPIO_CLK);
    gpio_config_t io_conf = {};
    io_conf.intr_type = GPIO_INTR_DISABLE;
    io_conf.mode = GPIO_MODE_OUTPUT;
    io_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL;
    io_conf.pull_down_en = 0;
    io_conf.pull_up_en = 0;
    gpio_config(&io_conf);
    gpio_set_level(GPIO_DT0, 0);
    gpio_set_level(GPIO_DT1, 0);
    gpio_set_level(GPIO_DT2, 0);
    gpio_set_level(GPIO_DT3, 0);
    gpio_set_level(GPIO_CLK, 0);
}

void outputData(uint8_t value) {
    gpio_set_level(GPIO_CLK, 1);
    gpio_set_level(GPIO_DT0, (value >> 0) & 0x1);
    gpio_set_level(GPIO_DT1, (value >> 1) & 0x1);
    gpio_set_level(GPIO_DT2, (value >> 2) & 0x1);
    gpio_set_level(GPIO_DT3, (value >> 3) & 0x1);
    gpio_set_level(GPIO_CLK, 0);
}

void pinout_test() {
    setupOutput();
    printf("<-- pintout_test start\n");
    // gpio_set_level(GPIO_DT0, 1);
    // gpio_set_level(GPIO_DT1, 1);
    // gpio_set_level(GPIO_DT2, 1);
    // gpio_set_level(GPIO_DT3, 1);
    // gpio_set_level(GPIO_CLK, 1);
    // printf("--> pintout_test end\n");
    uint8_t x = 0;
    while (true) {
        outputData(x);
        x = (x + 1) % 0x10;
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}