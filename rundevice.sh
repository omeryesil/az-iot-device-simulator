# this should run in device's OS (rasp os)

# config.yaml must be located under ~/appconfigs/az-iot-test-device/
docker run -v ~/appconfigs/az-iot-device-simulator:/app/config oyesil/az-iot-device-simulator:0.2 -d 

