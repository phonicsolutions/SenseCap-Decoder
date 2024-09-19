# SenseCap T1000 Payload Decoder and Format

## 6.1 Decoder Code – GitHub Links

- GitHub Link: [SenseCAP-Decoder Repository](https://github.com/Seeed-Solution/SenseCAP-Decoder/tree/main/T1000)

The following are the decoder scripts for various platforms:

- **The Things Network (TTN/TTS) payload decoding script**:  
  [SenseCAP T1000 TTN Decoder](https://github.com/Seeed-Solution/SenseCAP-Decoder/blob/main/T1000/TTN/SenseCAP_T1000_TTN_Decoder.js)

- **Helium decoder**:  
  [SenseCAP T1000 Helium Decoder](https://github.com/Seeed-Solution/SenseCAP-Decoder/blob/main/T1000/Helium/SenseCAP_T1000_Helium_Decoder.js)

- **AWS decoder**:  
  [SenseCAP T1000 AWS Decoder](https://github.com/Seeed-Solution/SenseCAP-Decoder/blob/main/T1000/AWS/SenseCAP_T1000_AWS_Decoder.js)

- **Chirpstack V3 decoder (Chirpstack V4 use TTN decoder)**:  
  [SenseCAP T1000 ChirpStackV3 Decoder](https://github.com/Seeed-Solution/SenseCAP-Decoder/blob/main/T1000/ChirpStack/SenseCAP_T1000_ChirpStackV3_Decoder.js)

---

## 6.2 Uplink Packet Parsing

The tracker data protocol provides different packets to correspond to different information, and the number of bytes in each packet may vary. The structure of the frame is shown below. The frame content is sent in big-endian byte order.

| **Data ID** | **Data Value**  |
|-------------|-----------------|
| 1 byte      | 50 bytes (Max)  |

- **Data ID**: Function number.  
- **Data Value**: Position, sensor data, and other information.

---

### 6.2.1 Device Status Packet - Event Mode (0x01)

The Device Status Packet is uploaded when the device joins the LoRaWAN network. The Device Status packet has two formats depending on the working mode:

1. Event Mode (ID=0x01)
2. Periodic Mode (ID=0x02)

#### Device Status Packet - Event Mode: 0x01

| Byte        | Value                                  | Description                                     |
|-------------|----------------------------------------|-------------------------------------------------|
| 1           | `0x01`                                 | Packet ID                                       |
| 2           | Battery level                          | e.g., `0x53` (83%)                              |
| 3-4         | Software version                       | e.g., `0x0105` (v1.5)                           |
| 5-6         | Hardware version                       | e.g., `0x0105` (v1.5)                           |
| 7           | Work mode                              | e.g., `0x02` (Event mode)                       |
| 8           | Positioning strategy                   | e.g., `0x07` (Bluetooth + Wi-Fi + GNSS)         |
| 9-10        | Heartbeat interval (minutes)           | e.g., `0x001E` (30 minutes)                     |
| 11-12       | Uplink interval (minutes)              | e.g., `0x0005` (5 minutes)                      |
| 13-14       | Event mode uplink interval (minutes)   | e.g., `0x0005` (5 minutes)                      |
| 15          | Temp & light switch                    | e.g., `0x01` (enabled)                          |
| 16          | SOS mode                               | e.g., `0x00` (single mode)                      |
| 17          | Enable motion event                    | e.g., `0x00` (disabled)                         |
| 18-19       | 3-Axis motion threshold (mg)           | e.g., `0x001E` (30mg)                           |
| 20-21       | Motion start interval (minutes)        | e.g., `0x0005` (5 minutes)                      |
| 22          | Enable motionless event                | e.g., `0x00` (disabled)                         |
| 23-24       | Motionless timeout (minutes)           | e.g., `0x0168` (360 minutes)                    |
| 25          | Enable shock event                     | e.g., `0x01` (enabled)                          |
| 26-27       | 3-Axis shock threshold (mg)            | e.g., `0x012C` (300mg)                          |
| 28          | Enable temperature event               | e.g., `0x00` (disabled)                         |
| 29-30       | Temperature event uplink interval      | e.g., `0x0005` (5 minutes)                      |
| 31-32       | Temperature sample interval (seconds)  | e.g., `0x001E` (30 seconds)                     |
| 33-34       | Temperature threshold max              | e.g., `0x0258` (60.0°C)                         |
| 35-36       | Temperature threshold min              | e.g., `0x0000` (0.0°C)                          |
| 37          | Temperature warning type               | e.g., `0x00` (≤ min threshold)                  |
| 38          | Enable light event                     | e.g., `0x00` (disabled)                         |
| 39-40       | Light event uplink interval (minutes)  | e.g., `0x0005` (5 minutes)                      |
| 41-42       | Light sample interval (seconds)        | e.g., `0x0001` (1 second)                       |
| 43-44       | Light threshold max                    | e.g., `0x0064` (100%)                           |
| 45-46       | Light threshold min                    | e.g., `0x0000` (0%)                             |
| 47          | Light warning type                     | e.g., `0x00` (≤ min threshold)                  |

---

### 6.2.2 Device Status Packet - Periodic Mode (0x02)

The device uploads the status packet when it joins the LoRaWAN network. Here is an example of the structure for **Periodic Mode** (ID=0x02).

| Byte        | Value                                  | Description                                     |
|-------------|----------------------------------------|-------------------------------------------------|
| 1           | `0x02`                                 | Packet ID                                       |
| 2           | Battery level                          | e.g., `0x56` (86%)                              |
| 3-4         | Software version                       | e.g., `0x0105` (v1.5)                           |
| 5-6         | Hardware version                       | e.g., `0x0105` (v1.5)                           |
| 7           | Work mode                              | e.g., `0x01` (Periodic mode)                    |
| 8           | Positioning strategy                   | e.g., `0x00` (Only GNSS)                        |
| 9-10        | Heartbeat interval (minutes)           | e.g., `0x02D0` (720 minutes)                    |
| 11-12       | Uplink interval (minutes)              | e.g., `0x003C` (60 minutes)                     |
| 13-14       | Event mode uplink interval (minutes)   | e.g., `0x003C` (60 minutes)                     |
| 15          | Temp & light switch                    | e.g., `0x00` (disabled)                         |
| 16          | SOS mode                               | e.g., `0x00` (single mode)                      |

---

### 6.2.3 Heartbeat Packet (0x05)

When no data is uploaded within the heartbeat interval, a heartbeat packet is triggered, containing only battery information.

| Byte        | Value                                  | Description                                     |
|-------------|----------------------------------------|-------------------------------------------------|
| 1           | `0x05`                                 | Packet ID                                       |
| 2           | Battery level                          | e.g., `0x64` (100%)                             |
| 3           | Work mode                              | e.g., `0x01` (Periodic mode)                    |
| 4           | Positioning strategy                   | e.g., `0x00` (Only GNSS)                        |
| 5           | SOS mode                               | e.g., `0x00` (single mode)                      |

### 6.2.4 GNSS Location and Sensor Packet (0x06)

ID 0x06 is used to upload GNSS location, sensor data, and battery status.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x06` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000008`: Shock event triggered)                  |
| 5           | `uint8`        | Motion segment number (`0x00`: no movement)                       |
| 6-9         | `uint32`       | UTC timestamp (e.g., `0x6462248d`, corresponds to a specific time)|
| 10-13       | `int32`        | Longitude (e.g., `0x06ca5028`, converted to 113.922088)           |
| 14-17       | `int32`        | Latitude (e.g., `0x01587ec6`, converted to 22.576838)             |
| 18-19       | `int16`        | Temperature (e.g., `0x00fe`, converted to 25.4°C)                 |
| 20-21       | `uint16`       | Light (e.g., `0x0000`, 0% light detected)                         |
| 22          | `uint8`        | Battery level (`0x57`, converted to 87%)                          |

**Raw Payload Example:**

`06000008006462248d06ca502801587ec600fe000057`

---

### 6.2.5 Wi-Fi Location and Sensor Packet (0x07)

ID 0x07 is used to upload Wi-Fi MAC addresses, sensor data, and battery information.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x07` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000008`: Shock event triggered)                  |
| 5           | `uint8`        | Motion segment number (`0x00`: no movement)                       |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-15       | `MAC Address`  | MAC Address 1 (e.g., `0x487397162234`)                            |
| 16          | `int8`         | RSSI for MAC Address 1 (e.g., `0xBB`, converted to -69 dBm)        |
| 17-22       | `MAC Address`  | MAC Address 2 (e.g., `0x3ccd5798fd2e`)                            |
| 23          | `int8`         | RSSI for MAC Address 2 (e.g., `0xBC`, converted to -68 dBm)        |
| 24-29       | `MAC Address`  | MAC Address 3 (e.g., `0x74cf002f3ad0`)                            |
| 30          | `int8`         | RSSI for MAC Address 3 (e.g., `0xA9`, converted to -87 dBm)        |
| 31-36       | `MAC Address`  | MAC Address 4 (e.g., `0xec26ca022958`)                            |
| 37          | `int8`         | RSSI for MAC Address 4 (e.g., `0xB9`, converted to -71 dBm)        |
| 38-39       | `int16`        | Temperature (e.g., `0x00fe`, converted to 25.4°C)                 |
| 40-41       | `uint16`       | Light (e.g., `0x0000`, 0% light detected)                         |
| 42          | `uint8`        | Battery level (`0x57`, converted to 87%)                          |

**Raw Payload Example:**

`070000080064622472487397162234bb3ccd5798fd2ebc74cf002f3ad0a9ec26ca022958b900fe000057`

---

### 6.2.6 Bluetooth Location and Sensor Packet (0x08)

ID 0x08 is used to upload Bluetooth Beacon MAC addresses, sensor data, and battery.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x08` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000008`: Shock event triggered)                  |
| 5           | `uint8`        | Motion segment number (`0x00`: no movement)                       |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-15       | `MAC Address`  | MAC Address 1                                                     |
| 16          | `int8`         | RSSI for MAC Address 1                                            |
| 17-22       | `MAC Address`  | MAC Address 2                                                     |
| 23          | `int8`         | RSSI for MAC Address 2                                            |
| 24-29       | `MAC Address`  | MAC Address 3                                                     |
| 30          | `int8`         | RSSI for MAC Address 3                                            |
| 31-32       | `int16`        | Temperature                                                      |
| 33-34       | `uint16`       | Light                                                            |
| 35          | `uint8`        | Battery level                                                    |

**Raw Payload Example:**

`0800000800646225bb5162d2c1b9d3ca1b5bd2afeae5c0d0e2d70529e8c900fa000057`

---

### 6.2.7 GNSS Location Only Packet (0x09)

When the sensor is turned off, the device only uploads location data without the sensor measurements.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x09` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000000`: no event triggered)                     |
| 5           | `uint8`        | Motion segment number (`0x00`: no movement)                       |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-13       | `int32`        | Longitude                                                         |
| 14-17       | `int32`        | Latitude                                                          |
| 18          | `uint8`        | Battery level                                                    |

**Raw Payload Example:**

`09000000006463186806ca506801587e4c56`

---

### 6.2.8 Wi-Fi Location Only Packet (0x0A)

This packet is used to upload only Wi-Fi MAC addresses and battery level without sensor data.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x0A` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000008`: Shock event triggered)                  |
| 5           | `uint8`        | Motion segment number (`0x00`: no movement)                       |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-15       | `MAC Address`  | MAC Address 1                                                     |
| 16          | `int8`         | RSSI for MAC Address 1                                            |
| 17-22       | `MAC Address`  | MAC Address 2                                                     |
| 23          | `int8`         | RSSI for MAC Address 2                                            |
| 24-29       | `MAC Address`  | MAC Address 3                                                     |
| 30          | `int8`         | RSSI for MAC Address 3                                            |
| 31-36       | `MAC Address`  | MAC Address 4                                                     |
| 37          | `int8`         | RSSI for MAC Address 4                                            |
| 38-39       | `int16`        | Temperature                                                      |
| 40-41       | `uint16`       | Light                                                            |
| 42          | `uint8`        | Battery level                                                    |

**Raw Payload Example:**

`0A0000080064622472487397162234bb3ccd5798fd2ebc74cf002f3ad0a9ec26ca022958b957`

---

### 6.2.9 Bluetooth Location Only Packet (0x0B)

Similar to the Wi-Fi location-only packet, this is used to upload Bluetooth Beacon MAC addresses and battery level without sensor data.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x0B` is the packet ID)                                |
| 2-4         | `uint24`       | Event status (`0x000008`: Shock event triggered)                  |
| 5           | `uint8`        | Motion segment number                                             |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-15       | `MAC Address`  | MAC Address 1                                                     |
| 16          | `int8`         | RSSI for MAC Address 1                                            |
| 17-22       | `MAC Address`  | MAC Address 2                                                     |
| 23          | `int8`         | RSSI for MAC Address 2                                            |
| 24-29       | `MAC Address`  | MAC Address 3                                                     |
| 30          | `int8`         | RSSI for MAC Address 3                                            |
| 31-32       | `int16`        | Temperature                                                      |
| 33-34       | `uint16`       | Light                                                            |
| 35          | `uint8`        | Battery level                                                    |

**Raw Payload Example:**

`0B00000800646225bb5162d2c1b9d3ca1b5bd2afeae5c0d0e2d70529e8c957`

---

### 6.2.10 Error Code Packet (0x0D)

This packet is used to upload error codes.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x0D` is the packet ID)                                |
| 2-5         | `uint32`       | Error code (e.g., `0x00000001`: UTC time acquisition failed)      |

**Raw Payload Example:**

`0D00000001`

**Error Codes:**

- `0x00000001`: UTC time acquisition failed
- `0x00000002`: Almanac too old
- `0x00000003`: Doppler error

---

### 6.2.11 Positioning Status and Sensor Packet (0x11)

This packet is used to upload the positioning status, sensor data, and battery level.

**Byte Breakdown:**

| Byte        | Value Type     | Description                                                       |
|-------------|----------------|-------------------------------------------------------------------|
| 1           | `uint8`        | Frame ID (`0x11` is the packet ID)                                |
| 2           | `uint8`        | Positioning status (e.g., `0x01`: GNSS scan timed out)             |
| 3-5         | `uint24`       | Event status (no event in this case)                              |
| 6-9         | `uint32`       | UTC timestamp                                                     |
| 10-11       | `int16`        | Temperature (e.g., `0x0141`: 32.1°C)                              |
| 12-13       | `uint16`       | Light (e.g., `0x0000`: no light)                                  |
| 14          | `uint8`        | Battery level (`0x2F`: 47%)                                       |

**Raw Payload Example:**

`110100000064a763a0014100002f`

---

This completes the payload decoder documentation for the SenseCap T1000.

