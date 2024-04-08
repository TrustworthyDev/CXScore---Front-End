// time & date format YYYY-MM-DD:HH:MM:SS.sss
export function extractDate(date: Date | undefined): string {
  if (typeof date === "string") {
    // Parse the string date into a Date object
    date = new Date(date);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Handle case when date is not a valid Date object
    return "Invalid date";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// time & date format YYYY-MM-DD:HH:MM:SS.sss
export function extractTime(date: Date | undefined): string {
  if (typeof date === "string") {
    // Parse the string date into a Date object
    date = new Date(date);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Handle case when date is not a valid Date object
    return "Invalid date";
  }

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Determine if it's AM or PM
  const meridiem = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour clock format
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  // Format the time components with leading zeros if necessary
  const formattedTime = `${String(formattedHours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${meridiem}`;

  return formattedTime;
}

export function getTimeDifference(
  date1?: Date | undefined,
  date2?: Date | undefined
): string {
  if (typeof date1 === "string") {
    // Parse the string date into a Date object
    date1 = new Date(date1);
  }

  if (typeof date2 === "string") {
    // Parse the string date into a Date object
    date2 = new Date(date2);
  }

  if (!date1 || !date2) {
    return "Invalid dates";
  }

  if (
    !(date1 instanceof Date) ||
    isNaN(date1.getTime()) ||
    !(date2 instanceof Date) ||
    isNaN(date2.getTime())
  ) {
    return "Invalid date objects";
  }

  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  const diffInSeconds = diffInMilliseconds / 1000;

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  const timeParts = [];

  if (hours > 0) {
    timeParts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0 || hours > 0) {
    timeParts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }
  timeParts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

  return timeParts.join(", ");
}
