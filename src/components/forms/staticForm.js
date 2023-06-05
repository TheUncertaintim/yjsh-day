import MessageEntry from "../messageEntry";
import { getImagePathByCategory } from "./utils";

import style from "../../styles/form.module.css";

export default function StaticForm({ msg }) {
  // get the image of the interactive card that should be displayed
  const imagePath = getImagePathByCategory(msg.category);

  // dynamic style
  let dynamicStyle = style.cardBase;
  if (msg.category === "Advice") {
    dynamicStyle += " " + style.adviceCard;
  } else {
    dynamicStyle += " " + style.otherCard;
  }

  return (
    <form
      className={dynamicStyle}
      style={{ backgroundImage: `url(${imagePath}` }}
    >
      <MessageEntry msg={msg} editable={false} />
    </form>
  );
}
