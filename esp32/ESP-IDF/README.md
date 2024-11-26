## How to use

### Configure the project

Open the project configuration menu (`idf.py menuconfig`).

In the `Example Configuration` menu:

* Set the Wi-Fi configuration.
    * Set `WiFi SSID`.
    * Set `WiFi Password`.

* Set the pin-out configuration.
    * Set `GPIO_OUTPUT_DATA0` ~ `GPIO_OUTPUT_DATA3`.
    * Set `GPIO_OUTPUT_CLOCK`.

* Set the WebSocket configuration.
    * Set `WEBSOCKET_URI`.
    * Set `WEBSOCKET_ROOM`.

Optional: If you need, change the other options according to your requirements.

### Build and Flash

Install the dependencies (`idf.py reconfigure`).
- [ESP-IDF IDF Component Manager](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/tools/idf-component-manager.html)
- Refer `main/idf_component.yml`

Build the project and flash it to the board, then run the monitor tool to view the serial output:

Run `idf.py -p PORT flash monitor` to build, flash and monitor the project.

(To exit the serial monitor, type ``Ctrl-]``.)

See the Getting Started Guide for all the steps to configure and use the ESP-IDF to build projects.

* [ESP-IDF Getting Started Guide on ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html)
* [ESP-IDF Getting Started Guide on ESP32-S2](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s2/get-started/index.html)
* [ESP-IDF Getting Started Guide on ESP32-C3](https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/get-started/index.html)
