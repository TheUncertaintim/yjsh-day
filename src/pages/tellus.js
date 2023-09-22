import style from "../styles/tellus.module.css";
import { useState } from "react";
import useSWR from "swr";
import StaticForm from "@/components/forms/static-form";
import EditableForm from "@/components/forms/editable-form";

// fetcher for swr
const fetcher = (url) => fetch(url).then((res) => res.json());

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
      <h1>Select any card below, give us some advice</h1>
      <fieldset className={style.optionContainer}>
        {cardOptions.map((option) => (
          <CardOption
            key={option}
            activeCard={activeCard}
            onClick={handleClick}
          >
            {option}
          </CardOption>
        ))}
      </fieldset>
      <EditableForm key={activeCard} formCategory={activeCard} />
      <hr />
      <h1>Read more from our friends and family:</h1>
      <CardsDisplay />
    </>
  );
}

function CardOption({ activeCard, onClick, children }) {
  // add custom style for the selected card option
  let customStyle = activeCard === children ? { fontWeight: "bold" } : {};

  return (
    <label
      style={customStyle}
      className={style.optionLabel}
      onClick={() => onClick(children)}
    >
      {children}
    </label>
  );
}

function CardsDisplay() {
  const { data, error, isLoading } = useSWR("/api/card", fetcher);
  if (error) {
    // TODO: handle error!!!
    console.log("error: ", error);
  }

  if (data && data.length == 0) {
    return <p>Want to be the first one to give your advice?</p>;
  } else {
    return (
      <>
        {isLoading && <label>Loading other people&apos;s suggestions</label>}
        {data &&
          data.map((advice, index) => <StaticForm key={index} msg={advice} />)}
      </>
    );
  }
}
