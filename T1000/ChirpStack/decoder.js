// Device SenseCap T1000 - ChirpStack
// Staging Code.

const utils = require("./common.js");

// unpack grabs the remaining bytres and transforms them into their respective data type.
const unpack = (frameID, payload) => {
  let result = {};
  // console.log(`Payload data - \n`, payload);

  console.log("Payload - 24: ", payload[24]);

  switch (frameID) {
    case "01": // Device Status Packet - Event Mode
      result = {
        packetID: payload[0],
        batteryLevel: utils.HexStringToDecimal(payload[1]), // Battery level in percentage
        softwareVersion: utils.BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: utils.BytesToVersion(payload.slice(4, 6)), // Hardware version
        workMode: utils.GetDeviceMode(payload[6]), // Work mode
        positioningStrategy: utils.BytesToPositioningStrategy(payload[7]), // Positioning strategy
        heartbeatInterval: utils.BytesToInterval(payload.slice(8, 10)), // Heartbeat interval
        uplinkInterval: utils.BytesToInterval(payload.slice(10, 12)), // Uplink interval
        eventModeUplinkInterval: utils.BytesToInterval(payload.slice(12, 14)), // Event mode Uplink interval
        tempLightSwitch:
          payload[14] === "01"
            ? "Open the temperature and light sensor"
            : "Close the temperature and light sensor",
        sosMode:
          payload[15] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
        enableMotionEvent: payload[16] === "01" ? "Enabled" : "Disabled",
        axisMotionThreshold: utils.HexStringToDecimal(payload.slice(17, 19)),
        motionStartInterval: utils.HexStringToDecimal(payload.slice(19, 21)),
        enableMotionlessEvent: payload[21] === "01" ? "Enabled" : "Disabled",
        motionlessTimeout: utils.HexStringToDecimal(payload.slice(22, 24)),
        enableShockEvent: payload[24] === "01" ? "Enabled" : "Disabled",
        axisShockThreshold: utils.HexStringToDecimal(payload.slice(25, 27)),
        enableTemperatureEvent: payload[27] === "01" ? "Enabled" : "Disabled",
        temperatureEventUplinkInterval: utils.HexStringToDecimal(
          payload.slice(28, 30)
        ),
        temperatureSampleInterval: utils.HexStringToDecimal(
          payload.slice(30, 32)
        ),
        temperatureMaxThreshold:
          utils.HexStringToDecimal(payload.slice(32, 34)) / 10,
        temperatureMinThreshold:
          utils.HexStringToDecimal(payload.slice(34, 36)) / 10,
        temperatureWarningType: utils.ByteThresholdWarning(payload[36]),
        enableLightEvent: payload[37] === "01" ? "Enabled" : "Disabled",
        lightEventUplinkInterval: utils.HexStringToDecimal(
          payload.slice(38, 40)
        ),
        lightSampleInterval: utils.HexStringToDecimal(payload.slice(40, 42)),
        lightMaxThreshold: utils.HexStringToDecimal(payload.slice(42, 44)),
        lightMinThreshold: utils.HexStringToDecimal(payload.slice(44, 46)),
        lightWarningType: utils.ByteThresholdWarning(payload[46]),
      };
      break;

    case "02": // Device Status Packet - Periodic Modee - 0x02
      result = {
        packetID: payload[0],
        batteryLevel: parseInt(payload.slice(1, 2).toString("hex"), 16), // Battery level
        softwareVersion: utils.BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: `${
          parseInt(payload.slice(4, 6).toString("hex"), 16) >> 8
        }.${parseInt(payload.slice(4, 6).toString("hex"), 16) & 0xff}`, // Hardware version
        workMode:
          parseInt(payload[6].toString("hex"), 16) === 0x01
            ? "Periodic Mode"
            : "Other Mode",
        positioningStrategy: parseInt(payload[7].toString("hex"), 16),
        heartbeatInterval: parseInt(payload.slice(8, 10).toString("hex"), 16),
        uplinkInterval: parseInt(payload.slice(10, 12).toString("hex"), 16),
        eventModeUplinkInterval: parseInt(
          payload.slice(12, 14).toString("hex"),
          16
        ),
        tempLightSwitch: payload[14] === 0x00 ? "Disabled" : "Enabled",
        sosMode: payload[15] === 0x00 ? "Single Mode" : "Continuous Mode",
      };
      break;
    case "05": // Heartbeat Packet -0x05
      break;

    case "06": // GNSS Location and Sensor Packet-0x06
      result = {
        packetID: payload[0],
        eventStatus: parseInt(payload.slice(1, 4).toString("hex"), 16),
        motionSegmentNumber: payload[4],
        utcTime: parseInt(payload.slice(5, 9).toString("hex"), 16),
        longitude: parseInt(payload.slice(9, 13).toString("hex"), 16) / 1000000,
        latitude: parseInt(payload.slice(13, 17).toString("hex"), 16) / 1000000,
        temperature: parseInt(payload.slice(17, 19).toString("hex"), 16) / 10,
        light: parseInt(payload.slice(19, 21).toString("hex"), 16),
        batteryLevel: parseInt(payload.slice(21, 22).toString("hex"), 16),
      };
      break;

    // Add more cases for other frame IDs (0x07, 0x08, etc.)

    default:
      result = { error: "Unsupported frameID" };
      break;
  }

  return result;
};

function Decode(fport, payload) {
  let decoded = {
    fport: fport,
    errors: "",
  };

  let bytes = utils.Bytes2HexString(payload);

  const id = utils.GetFrameID(bytes.slice(0, 1));

  decoded.frameID = id;

  decoded.data = unpack(decoded.frameID, bytes);

  return decoded;
}

let payload =
  "0153010501050207001e00050005010000001e000500016801012c000005001e025800000000000500010064000000";

let decodedData = Decode(199, payload);
console.log(decodedData);
