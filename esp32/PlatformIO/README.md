## How to use


### Refer Developer Guides

- [ESPRESSIF](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/third-party-tools/platformio.html)

- [VSCode IDE](https://docs.platformio.org/en/latest/integration/ide/vscode.html#installation)

- [WROOM32](https://docs.platformio.org/en/latest/boards/espressif32/denky32.html?utm_source=platformio&utm_medium=piohome)


### Configure the project

* Edit `platformio.ini` for your device.

* Set the Wi-Fi configuration. (`src/wifi.cpp`)
    * Set `WIFI_SSID`.
    * Set `WIFI_PASS`.
    * Set `TEST_URL`.

* Set the pin-out configuration. (`src/pintout.cpp`)
    * Set `PINOUT_DT0` ~ `PINOUT_DT3`.
    * Set `PINOUT_CLK`.

* Set the WebSocket configuration. (`src/socket.cpp`)
    * Set `WEBSOCKET_URL`.
    * Set `WEBSPCKET_PORT`.
    * Set `WEBSOCKET_ROOM`.


### Run the project

You can run this project using VSCode PlatformIO sidebar.

1. Project Tasks - General - Build

2. Project Tasks - General - Upload and Monitor
