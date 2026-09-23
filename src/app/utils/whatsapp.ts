export function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, '');
  let number = digits;
  if (digits.length === 10) number = `549${digits}`;
  else if (digits.length === 11 && digits.startsWith('0')) number = `549${digits.slice(1)}`;
  else if (digits.length === 12 && digits.startsWith('54')) number = `549${digits.slice(2)}`;
  return `https://wa.me/${number}`;
}
