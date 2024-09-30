// Device SenseCap T1000 - ChirpStack
// Staging Code.

function Decode(fport, payload) {
  var bytes = Bytes2HexString(payload);
  var fport = parseInt(fport);

  var decoded = {
    valid: true,
    fport: fport,
    errors: "",
    messages: [],
  };

  if (fport === 199 || fport === 192) {
    decoded.messages.push({
      fport: fport,
      payload: bytes,
    });
    return {
      data: decoded,
    };
  }

  if (fport != 5) {
    decoded.valid = false;
    return {
      data: decoded,
    };
  }

  if (bytes.length <= 0) {
    decoded.valid = false;
    return decoded;
  }

  const id = GetFrameID(bytes.slice(0, 1));

  decoded.frameID = id;

  decoded.data = unpack(decoded.frameID, bytes);

  return decoded;
}

// unpack grabs the remaining bytres and transforms them into their respective data type.
const unpack = (frameID, payload) => {
  let result = {};

  switch (frameID) {
    case "01": // Device Status Packet - Event Mode
      result = {
        packetID: payload[0],
        batteryLevel: HexStringToDecimal(payload[1]), // Battery level in percentage
        softwareVersion: BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: BytesToVersion(payload.slice(4, 6)), // Hardware version
        workMode: GetDeviceMode(payload[6]), // Work mode
        positioningStrategy: BytesToPositioningStrategy(payload[7]), // Positioning strategy
        heartbeatInterval: BytesToInterval(payload.slice(8, 10)), // Heartbeat interval
        uplinkInterval: BytesToInterval(payload.slice(10, 12)), // Uplink interval
        eventModeUplinkInterval: BytesToInterval(payload.slice(12, 14)), // Event mode Uplink interval
        tempLightSwitch:
          payload[14] === "01"
            ? "Open the temperature and light sensor"
            : "Close the temperature and light sensor",
        sosMode:
          payload[15] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
        enableMotionEvent: payload[16] === "01" ? "Enabled" : "Disabled",
        axisMotionThreshold: HexStringToDecimal(payload.slice(17, 19)),
        motionStartInterval: HexStringToDecimal(payload.slice(19, 21)),
        enableMotionlessEvent: payload[21] === "01" ? "Enabled" : "Disabled",
        motionlessTimeout: HexStringToDecimal(payload.slice(22, 24)),
        enableShockEvent: payload[24] === "01" ? "Enabled" : "Disabled",
        axisShockThreshold: HexStringToDecimal(payload.slice(25, 27)),
        enableTemperatureEvent: payload[27] === "01" ? "Enabled" : "Disabled",
        temperatureEventUplinkInterval: HexStringToDecimal(
          payload.slice(28, 30)
        ),
        temperatureSampleInterval: HexStringToDecimal(payload.slice(30, 32)),
        temperatureMaxThreshold: HexStringToDecimal(payload.slice(32, 34)) / 10,
        temperatureMinThreshold: HexStringToDecimal(payload.slice(34, 36)) / 10,
        temperatureWarningType: ByteThresholdWarning(payload[36]),
        enableLightEvent: payload[37] === "01" ? "Enabled" : "Disabled",
        lightEventUplinkInterval: HexStringToDecimal(payload.slice(38, 40)),
        lightSampleInterval: HexStringToDecimal(payload.slice(40, 42)),
        lightMaxThreshold: HexStringToDecimal(payload.slice(42, 44)),
        lightMinThreshold: HexStringToDecimal(payload.slice(44, 46)),
        lightWarningType: ByteThresholdWarning(payload[46]),
      };
      break;

    case "02": // Device Status Packet - Periodic Modee - 0x02
      result = {
        packetID: payload[0],
        batteryLevel: HexStringToDecimal(payload[1]), // Battery level in percentage
        softwareVersion: BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: BytesToVersion(payload.slice(4, 6)), // Hardware version
        workMode: GetDeviceMode(payload[6]), // Work mode
        positioningStrategy: BytesToPositioningStrategy(payload[7]), // Positioning strategy
        heartbeatInterval: BytesToInterval(payload.slice(8, 10)), // Heartbeat interval
        uplinkInterval: BytesToInterval(payload.slice(10, 12)), // Uplink interval
        eventModeUplinkInterval: BytesToInterval(payload.slice(12, 14)), // Event mode Uplink interval
        tempLightSwitch:
          payload[14] === "01"
            ? "Open the temperature and light sensor"
            : "Close the temperature and light sensor",
        sosMode:
          payload[15] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
      };
      break;

    case "05": // Heartbeat Packet -0x05
      result = {
        packetID: payload[0],
        batteryLevel: HexStringToDecimal(payload[1]), // Battery level in percentage
        workMode: GetDeviceMode(payload[2]), // Work mode
        positioningStrategy: BytesToPositioningStrategy(payload[3]), // Positioning strategy
        sosMode:
          payload[4] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
      };
      break;

    case "06": // GNSS Location and Sensor Packet-0x06
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        longitude: HexStringToDecimal(payload.slice(9, 13)) / 1000000,
        latitude: HexStringToDecimal(payload.slice(13, 17)) / 1000000,
        temperature: HexStringToDecimal(payload.slice(17, 19)) / 10,
        light: HexStringToDecimal(payload.slice(19, 21)),
        batteryLevel: HexStringToDecimal(payload[21]), // Battery level in percentage
      };
      break;

    case "07": // Wi-Fi Location and Sensor Packet-0x07
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: ByteRSSIMacAddress(payload[15]),
        macAddressTwo: ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: ByteRSSIMacAddress(payload[22]),
        macAddressThree: ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: ByteRSSIMacAddress(payload[29]),
        macAddressFour: ByteMacAddress(payload.slice(30, 36)),
        rssiMacAddressFour: ByteRSSIMacAddress(payload[36]),
        temperature: HexStringToDecimal(payload.slice(37, 39)) / 10,
        light: HexStringToDecimal(payload.slice(39, 41)),
        batteryLevel: HexStringToDecimal(payload[41]), // Battery level in percentage
      };
      break;

    case "08": // Bluetooth Location and Sensor Packet-0x08
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: ByteRSSIMacAddress(payload[15]),
        macAddressTwo: ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: ByteRSSIMacAddress(payload[22]),
        macAddressThree: ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: ByteRSSIMacAddress(payload[29]),
        temperature: HexStringToDecimal(payload.slice(30, 32)) / 10,
        light: HexStringToDecimal(payload.slice(32, 34)),
        batteryLevel: HexStringToDecimal(payload[34]), // Battery level in percentage
      };
      break;

    case "09": // GNSS Location Only Packet-0x09
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        longitude: HexStringToDecimal(payload.slice(9, 13)) / 1000000,
        latitude: HexStringToDecimal(payload.slice(13, 17)) / 1000000,
        batteryLevel: HexStringToDecimal(payload[17]), // Battery level in percentage
      };
      break;

    case "0A": // Wi-Fi Location Only Packet-0x0A
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: ByteRSSIMacAddress(payload[15]),
        macAddressTwo: ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: ByteRSSIMacAddress(payload[22]),
        macAddressThree: ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: ByteRSSIMacAddress(payload[29]),
        macAddressFour: ByteMacAddress(payload.slice(30, 36)),
        rssiMacAddressFour: ByteRSSIMacAddress(payload[36]),
        batteryLevel: HexStringToDecimal(payload[37]), // Battery level in percentage
      };
      break;

    case "0B": // Bluetooth Location Only Packet-0x0B
      result = {
        packetID: payload[0],
        eventStatus: ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: ByteMotionDetection(payload[4]),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: ByteRSSIMacAddress(payload[15]),
        macAddressTwo: ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: ByteRSSIMacAddress(payload[22]),
        macAddressThree: ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: ByteRSSIMacAddress(payload[29]),
        batteryLevel: HexStringToDecimal(payload[30]), // Battery level in percentage
      };
      break;

    case "0D": // Error Code Packet-0x0D
      result = {
        packetID: payload[0],
        errorCode: ByteErrorCode(payload.slice(1, 5)),
      };
      break;

    case "11": // Positioning Status and Sensor Packet-0x11
      result = {
        packetID: payload[0],
        positioningStrategy: BytesToPositioningStatus(payload[1]), // Positioning status
        eventStatus: ByteEventStatus(payload.slice(2, 5)),
        utcTime: HexStringToDecimal(payload.slice(5, 9)),
        temperature: HexStringToDecimal(payload.slice(9, 11)) / 10,
        light: HexStringToDecimal(payload.slice(11, 13)),
        batteryLevel: HexStringToDecimal(payload[13]), // Battery level in percentage
      };
      break;
    default:
      result = payload;
      break;
  }

  return result;
};

// GetDeviceModeAndID
function GetFrameID(bytes) {
  if (bytes.length === 0) {
    return Error("Empty byte array");
  }

  const frameID = bytes[0].toString(16).toUpperCase();

  return frameID;
}

// Convert hex strings to bytes array
const Bytes2HexString = (hexString) => {
  const hex = hexString.trim();
  let bytes = [];

  if (hex.length < 1 || hex.length > 100) {
    return bytes;
  }

  for (let i = 0; i < hex.length; i += 2) {
    // bytes.push(hex.substr(i, 2, 16).toString().toLocaleUpperCase());
    bytes.push(hex.substr(i, 2).toUpperCase());
  }

  return bytes;
};

// hexStringToDecimal converts hex String to Decimal
const HexStringToDecimal = (hexString) => {
  let hexValue = "";

  if (Array.isArray(hexString) && hexString.length > 0) {
    hexString.forEach((element) => {
      hexValue += element.toString().toLocaleUpperCase();
    });

    return parseInt(hexValue, 16);
  }
  return parseInt(hexString, 16);
};

const BytesToVersion = (bytes) => {
  if (bytes.length !== 2) {
    return Error("Invalid byte array length");
  }

  const major = parseInt(bytes[0], 10);
  const minor = parseInt(bytes[1], 10);

  return `v${major}.${minor}`;
};

const GetDeviceMode = (byte) => {
  let mode;

  switch (byte) {
    case "00":
      mode = "Standby mode";
      break;

    case "01":
      mode = "Periodic mode";
      break;

    case "02":
      mode = "Event mode";
      break;

    default:
      break;
  }

  return mode;
};

const BytesToPositioningStrategy = (byte) => {
  switch (byte) {
    case "00":
      return "Only GNSS";
    case "01":
      return "Only Wi-Fi";
    case "02":
      return "Wi-Fi + GNSS";
    case "03":
      return "GNSS + Wi-Fi";
    case "04":
      return "Only Bluetooth";
    case "05":
      return "Bluetooth + Wi-Fi";
    case "06":
      return "Bluetooth + GNSS";
    case "07":
      return "Bluetooth + Wi-Fi + GNSS";
    default:
      return "Unknown strategy";
  }
};

const BytesToPositioningStatus = (byte) => {
  switch (byte) {
    case "00":
      return "Positioning successful";
    case "01":
      return "The GNSS scan timed out and failed to obtain the location.";
    case "02":
      return "The Wi-Fi scan timed out and failed to obtain the location.";
    case "03":
      return "The Wi-Fi + GNSS scan timed out and failed to obtain the location.";
    case "04":
      return "The GNSS + Wi-Fi scan timed out and failed to obtain the location.";
    case "05":
      return "The Bluetooth scan timed out and failed to obtain the location.";
    case "06":
      return "The Bluetooth + Wi-Fi scan timed out and failed to obtain the location.";
    case "07":
      return "The Bluetooth + GNSS scan timed out and failed to obtain the location.";
    case "08":
      return "The Bluetooth + Wi-Fi + GNSS scan timed out and failed to obtain the location.";
    default:
      return "Unknown positioning strategy";
  }
};

const BytesToInterval = (bytes) => {
  return parseInt(bytes.join(""), 16);
};

const BytesToTemperature = (bytes) => {
  const temp = parseInt(bytes.join(""), 16);
  return temp / 10;
};

const BytesToLight = (bytes) => {
  return parseInt(bytes.join(""), 16);
};

const ByteThresholdWarning = (bytes) => {
  const byte = bytes.toString();

  let result = "";
  switch (byte) {
    case "00":
      result = "temp < min threshold";
      break;
    case "01":
      result = "temp > max threshold";
      break;
    case "02":
      result = "temp < min threshold and temp > max threshold";
      break;
    case "03":
      result = "min threshold < temp < maxthreshold";
      break;

    default:
      result = "invalid byte mapping";
  }
  return result;
};

const ByteMotionDetection = (byte) => {
  let motionByte = byte;
  let motionSegmentNumber = 0;

  if (typeof motionByte === "string") {
    motionByte = parseInt(motionByte, 16);
  }

  if (motionSegmentNumber > 0) {
    motionSegmentNumber++;
    // Ensure the segment number wraps around within 0x00 to 0xFF
    motionSegmentNumber = motionSegmentNumber & 0xff;
  }

  return motionSegmentNumber;
};

// ByteEventStatus converts the hex represntation to a string
const ByteEventStatus = (bytes) => {
  const byteString = bytes.join("");

  const byteValue = parseInt(byteString, 16); // Convert hex string to integer

  // Mask to get only the last 8 bits (event status byte)
  const eventStatusByte = byteValue & 0xff;

  // Map the bits to the correct events based on your specification
  if (eventStatusByte & 0x01) return "Start moving event";
  if (eventStatusByte & 0x02) return "End movement event";
  if (eventStatusByte & 0x04) return "Motionless event";
  if (eventStatusByte & 0x08) return "Shock event";
  if (eventStatusByte & 0x10) return "Temperature event";
  if (eventStatusByte & 0x20) return "Light event";
  if (eventStatusByte & 0x40) return "SOS event";
  if (eventStatusByte & 0x80) return "Press once event";

  return "No event"; // If no bits are set
};

const ByteMacAddress = (bytes) => {
  let macAddress = "";

  if (bytes.length > 0) {
    macAddress = bytes.map((byte) => byte.toUpperCase()).join(":");
  } else {
    macAddress = "Invalid byte mapping";
  }

  return macAddress;
};

const ByteRSSIMacAddress = (byte) => {
  let decimalValue = parseInt(byte, 16);

  if (decimalValue > 127) {
    decimalValue -= 256;
  }

  return decimalValue;
};

const ByteErrorCode = (bytes) => {
  const byteString = bytes.join("");
  const byteValue = parseInt(byteString, 16);

  const errorMessages = {
    1: "UTC time acquisition failed", // 0x01 in hex
    2: "Almanac too old", // 0x02 in hex
    3: "Doppler error", //  0x03 in hex
  };

  return errorMessages[byteValue] || "Unknown error";
};
