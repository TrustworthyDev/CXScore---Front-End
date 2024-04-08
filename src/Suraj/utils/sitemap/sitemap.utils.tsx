import { getFullUrl } from "@/utils/stringUtils";

export const XML = "xml";
export const TEXT = "text";
export const CHROME_RR_JSON = "CHROME_RR_JSON";

export function isXmlOrTextFile(
  selectedFile: File | undefined
): string | undefined {
  const fileName = selectedFile?.name;
  const fileExtension = fileName?.split(".").pop()?.toLowerCase();

  if (!fileExtension) {
    return undefined;
  }

  const xmlExtensions = ["xml"];
  const textExtensions = ["txt", "text"];
  const chromeRRJson = ["json"];

  if (xmlExtensions.includes(fileExtension)) {
    return XML;
  }
  if (textExtensions.includes(fileExtension)) {
    return TEXT;
  }
  if (chromeRRJson.includes(fileExtension)) {
    return CHROME_RR_JSON;
  }
  return undefined;
}

export function processTextFile(file?: File): Promise<string | undefined> {
  if (!file) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };

    reader.onerror = (event) => {
      reject(event.target?.error);
    };

    reader.readAsText(file);
  });
}

export function normalizeHostname(hostname: string | undefined) {
  if (!hostname) {
    return hostname;
  }

  const prefixRegex = /^(https?:\/\/)?(www\.)?/i;
  const normalizedHostname = hostname.replace(prefixRegex, "");
  return normalizedHostname.replace(/\/$/, "");
}

export function getDomainFromUrl(url: string): string | undefined {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
  const match = url.match(regex);

  if (match && match[1]) {
    const domainParts = match[1].split(".");
    const topLevelDomain = domainParts[domainParts.length - 1];

    const secondLevelDomain = domainParts[domainParts.length - 2];
    // console.log("urldomain1", `${secondLevelDomain}.${topLevelDomain}`);
    return `${secondLevelDomain}.${topLevelDomain}`;
  }

  return undefined;
}

export type validatedUrlsResponse = {
  validatedUrls: string[];
  invalidUrlsIndices: Number[];
};

export function validateUrls(
  urls: string[],
  domain: string | undefined
): validatedUrlsResponse {
  if (domain === undefined)
    return { validatedUrls: [], invalidUrlsIndices: [] };
  let invalidUrlsIndices: Number[] = [];
  const validatedUrls = urls.filter((url, index) => {
    const parsedUrl = new URL(url);
    const validityCheck =
      (!!parsedUrl.protocol && parsedUrl.hostname === domain) ||
      parsedUrl.hostname.endsWith("." + domain);
    if (!validityCheck) invalidUrlsIndices.push(index);
    return validityCheck;
  });

  return { validatedUrls, invalidUrlsIndices };
}
export function extractUrlsFromText(text?: string): string[] {
  if (!text) {
    return [];
  }

  const urls = text
    .replaceAll("\r", "")
    .replaceAll(",", "\n")
    .trim()
    .split("\n")
    .filter((url) => url.length > 0)
    .map((url) => getFullUrl(url));

  return urls;
}

export function processXmlSitemapFile(
  file?: File
): Promise<Document | undefined> {
  if (!file) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const xmlString = event.target?.result as string;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        reject(new Error("Invalid XML sitemap file"));
      } else {
        resolve(xmlDoc);
      }
    };

    reader.onerror = (event) => {
      reject(event.target?.error);
    };

    reader.readAsText(file);
  });
}

export function extractUrlsFromXml(xmlDoc?: Document): string[] {
  if (!xmlDoc) {
    return [];
  }

  const urlElements = xmlDoc.getElementsByTagName("url");
  const urls: string[] = [];

  for (let i = 0; i < urlElements.length; i++) {
    const locElement = urlElements[i].getElementsByTagName("loc")[0];
    const url = locElement?.textContent;
    if (url) {
      urls.push(url);
    }
  }

  return urls;
}

export function readJsonFile(file?: File): Promise<Document | undefined> {
  if (!file) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const jsonObject = JSON.parse(jsonString);
        resolve(jsonObject);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = (event) => {
      reject(event.target?.error);
    };

    reader.readAsText(file);
  });
}

export function extractUrlsFromJson(jsonObject?: Document): string[] {
  if (!jsonObject) {
    return [];
  }

  const urls: string[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Array.isArray(jsonObject.steps)) {
    // If the JSON object is an array, iterate through its elements
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const element of jsonObject.steps) {
      if (
        typeof element === "object" &&
        Object.prototype.hasOwnProperty.call(element, "assertedEvents")
      ) {
        for (const event of element.assertedEvents) {
          if (
            typeof event === "object" &&
            Object.prototype.hasOwnProperty.call(event, "url")
          ) {
            // Check if the element has a "url" property
            urls.push(event.url);
          }
        }
      }
    }
  }

  return urls;
}
