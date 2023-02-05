export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const randomId = (length: number) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export const getCoreTitle = () => {
  return "RX-TOOLS";
}

export const extractCookie = (cookie: string, name: string) => {
  const pattern = new RegExp(`${name}=([^;]+)`);
  try {
    const matched = cookie.match(pattern);
    return matched ? matched[1] : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
export const setCookie = (name: string, value: any, days: number = 7) => {
  if (typeof window === "undefined") return;
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
}
export const getCookie = (name: string) => {
  if (typeof window === "undefined") return;
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
  }
  return null;
}
export const eraseCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const setLocalKV = (name: string, value: any, days: number = 7) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(name, JSON.stringify(value));
  }
}
export const getLocalKV = (name: string) => {
  if (typeof localStorage !== "undefined") {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  }
  return null;
}
export const eraseLocalKV = (name: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(name);
  }
}

/**
   * Make string plural
   * TODO: Move into seperate module
   * @param str
   * @returns
   */
export const pluralize = (str: string) => {
  const lChar = str.charAt(str.length - 1);
  if (lChar.match(/[s]/gi)) {
    return str + "es";
  }
  if (lChar.match(/[yi]/gi)) {
    return str.substr(0, str.length - 1) + "ies";
  }

  return str + "s";
};

/**
* Convert to camel case
* TODO: Move into seperate module
* @param str
* @returns
*/
export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

/**
* convert to pascal case
* TODO: Move into seperate module
* @param str
* @returns
*/
export const toPascalCase = (str: string) => {
  return `${str}`
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

/**
* convert to kebab case
* TODO: Move into seperate module
* @param str
* @returns
*/
export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, "-") // replace all spaces and low dash
    .toLowerCase();
};

/**
* convert to sentence case
* TODO: Move into seperate module
* @param str
* @returns
*/
export const toSentenceCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1");
};


export const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
  return uuidRegex.test(uuid);
}

export const fromBase64ToAscii = (str: string) => {
  return Buffer.from(str, "base64").toString("ascii")
}
export const fromAsciiToBase64 = (str: string) => {
  return Buffer.from(str).toString("base64")
}

export function csvToJSON(csv: string) {
  const lines = csv.split('\n')
  const result = []
  const headers = lines[0].split(',')

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i])
      continue
    const obj: any = {}
    const currentline = lines[i].split(',')

    for (let j = 0; j < headers.length; j++) {
      const k = headers[j].trim()
      const v = currentline[j].replace(/\r/g, "")
      obj[k] = v;
    }
    result.push(obj)
  }
  return result
}

export const sleep = async (ms: number) => {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}