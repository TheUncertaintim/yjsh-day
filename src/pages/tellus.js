import style from "@/styles/tellus.module.css";
import { useState } from "react";
import EditableMessage from "@/components/forms/editable-message";
import MessageBoard from "@/components/forms/message-board";

export default function TellUs() {
  // all kinds of cards to be filled
  const cardOptions = ["Advice", "Share", "Suggest", "Tell", "Predict"];

  // "Advice" card is selected by default
  const [activeCard, setActiveCard] = useState("Advice");

  function handleClick(cardClicked) {
    setActiveCard(cardClicked);
  }

  return (
    <>
      <h1>Select any card below, give us some advice:</h1>
      <div className={style.optionContainer}>
        {cardOptions.map((option) => {
          // add the font weight if the current card is selected
          let customStyle = activeCard === option ? { fontWeight: "bold" } : {};
          return (
            <label
              key={option}
              style={customStyle}
              className={style.optionLabel}
              onClick={() => handleClick(option)}
            >
              {option}
            </label>
          );
        })}
      </div>
      {/* a 'key' attribute has to be provided for React to update a new, the EditableMessage is  */}
      <EditableMessage msgCategory={activeCard} />
      <hr />
      <MessageBoard />
    </>
  );
}
