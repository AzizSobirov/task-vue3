export const useCookie = () => {
  /*
    Set cookie
    @param {string} name - cookie name
    @param {string} value - cookie value
    @param {number} days - cookie expiration time
    @param {string} path - cookie path
  */
  const setCookie = (
    name: string,
    value: string,
    days?: number,
    path: string = "/"
  ) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value};${expires}path=${path};`;
  };

  /*
    Get cookie
    @param {string} name - cookie name
  
    @returns {string | null}
  */
  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  /*
    Delete cookie
    @param {string} name - cookie name
    @param {string} path - cookie path
  */
  const deleteCookie = (name: string, path: string = "/") => {
    setCookie(name, "", -1, path);
  };

  return {
    setCookie,
    getCookie,
    deleteCookie,
  };
};
