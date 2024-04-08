import moment from "moment";

export const getFormattedDate = (date: Date | string): string => {
  return moment(date).format("MMMM Do YYYY, hh:mm:ss");
};

export const getFormattedTime = (timeInSeconds: number): string => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCSeconds(timeInSeconds);
  return moment(date).format("hh:mm:ss A");
};

export const getFullUrl = (url: string): string => {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return "https://" + url;
  }
  return url;
};

export const getTruncatedText = (text: string, len: number) => {
  return text.length > len ? text.slice(0, len - 3) + "..." : text;
};
