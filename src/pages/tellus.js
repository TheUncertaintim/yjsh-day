import style from "@/styles/tellus.module.css";
import { useState } from "react";
import EditableMessage from "@/components/forms/editable-message";
import MessageBoard from "@/components/forms/message-board";
import EditableContext from "@/components/forms/form-context";
import CARD_CATEGORY from "@/lib/card-categories";

export default function TellUs() {
  // "Advice" card is selected by default
  const [activeCard, setActiveCard] = useState(CARD_CATEGORY.ADVICE);

  function handleClick(cardClicked) {
    setActiveCard(cardClicked);
  }

  const cardOptions = Object.values(CARD_CATEGORY);

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
      <EditableMessage msgCategory={activeCard} />
      <hr />
      {/* Messages displayed are not editable */}
      <EditableContext.Provider value={false}>
        <MessageBoard />
      </EditableContext.Provider>
    </>
  );
}
