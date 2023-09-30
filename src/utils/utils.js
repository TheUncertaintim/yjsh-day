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

import CARD_CATEGORY from "@/lib/card-categories";

export function getImagePathByCategory(category) {
  switch (category) {
    case CARD_CATEGORY.ADVICE:
      return cardAdvice.src;
    case CARD_CATEGORY.SUGGEST:
      return cardSuggest.src;
    case CARD_CATEGORY.TELL:
      return cardTell.src;
    case CARD_CATEGORY.PREDICT:
      return cardPredict.src;
    case CARD_CATEGORY.SHARE:
      return cardShare.src;
    default:
      // TODO: throw an error here
      return "";
  }
}

export function getAnimationBackgroundByCategory(category) {
  switch (category) {
    case CARD_CATEGORY.ADVICE:
      return animateCardAdvice.src;
    case CARD_CATEGORY.SUGGEST:
      return animateCardSuggest.src;
    case CARD_CATEGORY.TELL:
      return animateCardTell.src;
    case CARD_CATEGORY.PREDICT:
      return animateCardPredict.src;
    case CARD_CATEGORY.SHARE:
      return animateCardShare.src;
    default:
      // TODO: throw an error here
      return "";
  }
}
