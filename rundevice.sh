# this should run in device's OS (rasp os)

# config.yaml must be located under ~/appconfigs/az-iot-test-device/
docker run -v ~/appconfigs/az-iot-test-device:/app/config oyesil/az-iot-test-device:0.1 -d 

