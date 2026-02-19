export const useFormDate = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  const hours = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}, ${pad(hours)}:${pad(d.getMinutes())} ${ampm}`;
};
