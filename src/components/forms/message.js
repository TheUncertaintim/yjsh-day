import MessageEntry from "./message-entry";
import { getImagePathByCategory } from "@/utils/utils";
import style from "@/styles/form.module.css";
import CARD_CATEGORY from "@/lib/card-categories";

/**
 * A message is presented as a HTML form without a submit button.
 * It can be used to display messages, or gathering input from the user,
 * in which case handleEntry must be supplied to update the message instance.
 */
export default function Message({ id, category, handleSubmit }) {
  // get the image of the interactive card that should be displayed
  const imagePath = getImagePathByCategory(category);

  // dynamic style
  let dynamicStyle = style.cardBase;
  if (category === CARD_CATEGORY.ADVICE) {
    dynamicStyle += " " + style.adviceCard;
  } else {
    dynamicStyle += " " + style.otherCard;
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={dynamicStyle}
      style={{ backgroundImage: `url(${imagePath}` }}
    >
      <MessageEntry category={category} />
    </form>
  );
}
