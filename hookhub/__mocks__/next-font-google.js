// Mock for next/font/google
const mockFont = () => ({
  className: 'mocked-font',
  variable: '--mocked-font',
  style: { fontFamily: 'mocked-font' },
});

module.exports = {
  Geist: mockFont,
  Geist_Mono: mockFont,
  Poppins: mockFont,
  Lora: mockFont,
};
