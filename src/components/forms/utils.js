import cardAdvice from "/public/images/advice_card_advice.png";
import cardPredict from "/public/images/advice_card_predict.png";
import cardShare from "/public/images/advice_card_share.png";
import cardSuggest from "/public/images/advice_card_suggest.png";
import cardTell from "/public/images/advice_card_tell.png";

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
