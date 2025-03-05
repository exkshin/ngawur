import keyLang from "../assets/language/keyLanguage.json"
import ind from "../assets/language/id.json"
import eng from "../assets/language/en.json"

export const keylang = keyLang;

/**
 * 
 * @param key key bisa dilihat dari keylanguage.json
 * @returns string hasil translate
 */
export const tr = (key: string) => {
  let lang = localStorage.getItem("lang") ?? "id";
  if (lang === "en") {
    return JSON.parse(JSON.stringify(eng))[key];
  } else {
    return JSON.parse(JSON.stringify(ind))[key];
  }
}