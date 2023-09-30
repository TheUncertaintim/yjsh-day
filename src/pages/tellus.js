import { useState } from "react";
import MessageHandler from "@/components/forms/message-handler";
import MessageBoard from "@/components/forms/message-board";
import { EditableContext } from "@/components/forms/form-context";
import CARD_CATEGORY from "@/lib/card-categories";
import style from "@/styles/tellus.module.css";

export default function TellUs() {
  // "Advice" card is selected by default
  const [activeCategory, setActiveCategory] = useState(CARD_CATEGORY.ADVICE);

  function handleClick(cardClicked) {
    setActiveCategory(cardClicked);
  }

  // Clickable label to switch card category
  const CategoryLink = function ({ customStyle, children }) {
    return (
      <label
        key={children}
        style={customStyle}
        className={style.categoryLink}
        onClick={() => handleClick(children)}
      >
        {children}
      </label>
    );
  };

  // add font weight for active card category
  const getCustomStyle = function (category) {
    return activeCategory === category ? { fontWeight: "bold" } : {};
  };

  return (
    <>
      <h1>Select any card below, give us some advice:</h1>
      <div className={style.linkContainer}>
        {Object.values(CARD_CATEGORY).map((category) => {
          // add the font weight if the current card category is selected
          const customStyle = getCustomStyle(category);
          return (
            <CategoryLink key={category} customStyle={customStyle}>
              {category}
            </CategoryLink>
          );
        })}
      </div>
      <MessageHandler key={activeCategory} msgCategory={activeCategory} />
      <hr />
      {/* Messages displayed are not editable */}
      <EditableContext.Provider value={false}>
        <MessageBoard />
      </EditableContext.Provider>
    </>
  );
}
