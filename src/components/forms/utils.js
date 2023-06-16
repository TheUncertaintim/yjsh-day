import webAdvice_en from "/public/images/web_advice_EN.png";
import webPredict_en from "/public/images/web_predict_EN.png";
import webShare_en from "/public/images/web_share_EN.png";
import webSuggest_en from "/public/images/web_suggest_EN.png";
import webTell_en from "/public/images/web_tell_EN.png";

import webAdvice_ch from "/public/images/web_advice_CH.png";
import webPredict_ch from "/public/images/web_predict_CH.png";
import webShare_ch from "/public/images/web_share_CH.png";
import webSuggest_ch from "/public/images/web_suggest_CH.png";
import webTell_ch from "/public/images/web_tell_CH.png";

import animateAdvice_en from "/public/images/animate_advice_EN.png";
import animatePredict_en from "/public/images/animate_predict_EN.png";
import animateShare_en from "/public/images/animate_share_EN.png";
import animateSuggest_en from "/public/images/animate_suggest_EN.png";
import animateTell_en from "/public/images/animate_tell_EN.png";

import animateAdvice_ch from "/public/images/animate_advice_CH.png";
import animatePredict_ch from "/public/images/animate_predict_CH.png";
import animateShare_ch from "/public/images/animate_share_CH.png";
import animateSuggest_ch from "/public/images/animate_suggest_CH.png";
import animateTell_ch from "/public/images/animate_tell_CH.png";

/** return the english version by default */
export function getImagePathByCategory(category, lang) {
  switch (category) {
    case "Advice":
      return lang === "ch" ? webAdvice_ch.src : webAdvice_en.src;
    case "Suggest":
      return lang === "ch" ? webSuggest_ch.src : webSuggest_en.src;
    case "Tell":
      return lang === "ch" ? webTell_ch.src : webTell_en.src;
    case "Predict":
      return lang === "ch" ? webPredict_ch.src : webPredict_en.src;
    case "Share":
      return lang === "ch" ? webShare_ch.src : webShare_en.src;
    default:
      // TODO: throw an error here
      return "";
  }
}

/** return the english version by default */
export function getAnimationBackgroundByCategory(category, lang) {
  switch (category) {
    case "Advice":
      return lang === "ch" ? animateAdvice_ch.src : animateAdvice_en.src;
    case "Suggest":
      return lang === "ch" ? animateSuggest_ch.src : animateSuggest_en.src;
    case "Tell":
      return lang === "ch" ? animateTell_ch.src : animateTell_en.src;
    case "Predict":
      return lang === "ch" ? animatePredict_ch.src : animatePredict_en.src;
    case "Share":
      return lang === "ch" ? animateShare_ch.src : animateShare_en.src;
    default:
      // TODO: throw an error here
      return "";
  }
}
