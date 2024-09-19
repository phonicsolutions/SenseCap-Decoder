// Utility Functions

// getDeviceModeAndID
// Inputs: 2 bits example: 0x01 | 0x0A
// Outputs: {Mode: "", ID: "01"}
const getDeviceModeAndID = (bytes) => {
  console.log(bytes);

  let mode = "",
    id = "";

  if (bytes.length > 2) {
    mode = "Invalid";
    id = Error("Invalid Id");
    return { mode, id };
  }

  const modeBytes = bytes[0].toString() + bytes[1].toString();

  // Device has two Modes in working mode;
  // 1. Event Mode, ID=0x01
  // 2. Periodic Mode, ID = 0x02
  // Build more cases for the other modes.
  switch (modeBytes) {
    case "01":
      mode = "Event Mode";
      id = "0x01";
      break;
    case "02":
      (mode = "Periodic Mode"), (id = "0x02");
      break;
    default:
      mode = "Invalid";
      id = Error("Invalid Id");
      break;
  }

  return { mode, id };
};

// Convert hex strings to bytes array
const hexToBytes = (hexString) => {
  const hex = hexString.trim();
  console.log(hex);

  if (hex.length < 1 || hex.length > 100) {
    return null;
  }

  let bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(hex.substr(i, 2, 16).toString());
  }

  return bytes;
};
