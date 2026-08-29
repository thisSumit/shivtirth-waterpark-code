export const WHATSAPP_BOOKING_NUMBER = "918275737579";

export const formatWhatsAppNumber = (num: string) => {
  return (num || "").replace(/\D/g, "") || WHATSAPP_BOOKING_NUMBER;
};

export const getWhatsAppBookingHref = (
  message = "Hi, Can I get more information about the booking?",
  customNumber?: string
) => {
  const numberToUse = customNumber ? formatWhatsAppNumber(customNumber) : WHATSAPP_BOOKING_NUMBER;
  return `https://wa.me/${numberToUse}?text=${encodeURIComponent(message)}`;
};
