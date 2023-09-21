import cardAdvice from "/public/images/en/advice_card_advice.png";
import cardPredict from "/public/images/en/advice_card_predict.png";
import cardShare from "/public/images/en/advice_card_share.png";
import cardSuggest from "/public/images/en/advice_card_suggest.png";
import cardTell from "/public/images/en/advice_card_tell.png";

import animateCardAdvice from "/public/images/en/animate_advice EN.png";
import animateCardPredict from "/public/images/en/animate_Predict EN.png";
import animateCardShare from "/public/images/en/animate_Share EN.png";
import animateCardSuggest from "/public/images/en/animate_Suggest EN.png";
import animateCardTell from "/public/images/en/animate_Tell EN.png";

export function getImagePathByCategory(category) {
  switch (category) {
    case "Advice":
      return cardAdvice.src;
    case "Suggest":
      return cardSuggest.src;
    case "Tell":
      return cardTell.src;
    case "Predict":
      return cardPredict.src;
    case "Share":
      return cardShare.src;
    default:
      // TODO: throw an error here
      return "";
  }
}

export function getAnimationBackgroundByCategory(category) {
  switch (category) {
    case "Advice":
      return animateCardAdvice.src;
    case "Suggest":
      return animateCardSuggest.src;
    case "Tell":
      return animateCardTell.src;
    case "Predict":
      return animateCardPredict.src;
    case "Share":
      return animateCardShare.src;
    default:
      // TODO: throw an error here
      return "";
  }
}
