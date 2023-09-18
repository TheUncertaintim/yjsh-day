import style from "../styles/tellus.module.css";
import { useState } from "react";
import Layout from "../components/layout";
import EditableForm from "@/components/forms/editable-form";
import StaticForm from "@/components/forms/static-form";
import useSWR from "swr";

export default function TellUs() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    "/api/advices?entity=Card",
    fetcher
  );
  const [activeCard, setActiveCard] = useState("Advice");

  if (error) {
    // TODO: handle error!!!
    console.log("error: ", error);
  }

  function handleClick(cardClicked) {
    setActiveCard(cardClicked);
  }

  return (
    <>
      <section>
        <p>Give us some advice, choose different cards:</p>
        <fieldset className={style.optionContainer}>
          <CardOption
            optionName="Advice"
            handleClick={handleClick}
            defaultChecked
          />
          |
          <CardOption optionName="Share" handleClick={handleClick} />
          |
          <CardOption optionName="Suggest" handleClick={handleClick} />
          |
          <CardOption optionName="Tell" handleClick={handleClick} />
          |
          <CardOption optionName="Predict" handleClick={handleClick} />
        </fieldset>
        <EditableForm key={activeCard} formCategory={activeCard} />
        <div className="divider" />
        <p>Read more from our friends and family:</p>
      </section>
      {isLoading && <label>Loading other people&apos;s suggestions</label>}
      {data &&
        data.map((advice, index) => <StaticForm key={index} msg={advice} />)}
    </>
  );
}

function CardOption({ optionName, handleClick, defaultChecked }) {
  return (
    <label
      className={style.optionLabel}
      onClick={() => handleClick(optionName)}
    >
      <input
        type="radio"
        name="cardsOption"
        hidden
        defaultChecked={defaultChecked}
      />
      {optionName}
    </label>
  );
}
