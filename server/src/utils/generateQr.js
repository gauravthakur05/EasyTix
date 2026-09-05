const QRCode = require("qrcode");

// Generates a base64 data URL QR code encoding the booking reference/details
const generateQrCode = async (payload) => {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload);
  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 300,
  });
  return dataUrl;
};

module.exports = generateQrCode;
