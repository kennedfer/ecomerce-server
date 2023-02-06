import QRCode from 'qrcode';

const getPaymentQRcode = async (paymentLink) => {
  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 1,
    color: {
      dark: '#7b66cf',
      light: '#FFF'
    }
  };

  const qrCodeImage64 = QRCode.toDataURL(paymentLink, qrOptions);
  return qrCodeImage64;
};

export default getPaymentQRcode;
