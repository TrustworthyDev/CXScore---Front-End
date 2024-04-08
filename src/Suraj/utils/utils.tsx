export function calculatePercentage(value: number, total: number) {
  const percentage = (value / total) * 100;
  const roundedPercentage = Math.round(percentage);
  return roundedPercentage;
}

export const formatNumber = (num: number) => {
  if (num < 1000) {
    return num;
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`;
  } else {
    return `${(num / 1000000).toFixed(1)}m`;
  }
};

export function copyToClipboard(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Make the textarea invisible
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();

  document.execCommand("copy");

  document.body.removeChild(textarea);
}

const HttpStatusCodeStrings = {
  // redirects
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  // client errors
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  // server errors
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

export const getHttpStatusCodeString = (statusCode: number) => {
  try {
    return HttpStatusCodeStrings[
      statusCode as keyof typeof HttpStatusCodeStrings
    ];
  } catch {
    return "Unknown Error";
  }
};
