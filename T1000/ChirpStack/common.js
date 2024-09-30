// Utility Functions

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

  if (hex.length < 1 || hex.length > 100) {
    return null;
  }

  let bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(hex.substr(i, 2, 16).toString().toLocaleUpperCase());
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
  console.log(bytes);
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

// Export functions
module.exports = {
  GetDeviceMode,
  BytesToVersion,
  GetFrameID,
  Bytes2HexString,
  HexStringToDecimal,
  BytesToPositioningStrategy,
  BytesToInterval,
  BytesToTemperature,
  BytesToLight,
  ByteThresholdWarning,
  ByteMotionDetection,
  ByteEventStatus,
};
