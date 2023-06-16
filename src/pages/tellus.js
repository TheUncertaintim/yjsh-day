import style from "../styles/tellus.module.css";
import { useState } from "react";
import Layout from "../components/layout";
import EditableForm from "@/components/forms/editableForm";
import StaticForm from "@/components/forms/staticForm";
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
    <Layout>
      <section>
        <p>我們設計了以下幾張卡片，希望你可以給我們一點...</p>
        <fieldset className={style.optionContainer}>
          <CardOption
            optionName="忠告"
            handleClick={handleClick}
            defaultChecked
          />
          |
          <CardOption optionName="分享" handleClick={handleClick} />
          |
          <CardOption optionName="建議" handleClick={handleClick} />
          |
          <CardOption optionName="告訴" handleClick={handleClick} />
          |
          <CardOption optionName="預測" handleClick={handleClick} />
        </fieldset>
        <EditableForm key={activeCard} formCategory={activeCard} />
        <div className="divider" />
        <p>看看別人都寫了什麼？</p>
      </section>
      {isLoading && <label>載入互動小卡中...</label>}
      {data &&
        data.map((advice, index) => <StaticForm key={index} msg={advice} />)}
    </Layout>
  );
}

function CardOption({ optionName, handleClick, defaultChecked }) {
  let cardClicked;
  if (optionName == "Advice" || optionName == "忠告") {
    cardClicked = "Advice";
  } else if (optionName == "Share" || optionName == "分享") {
    cardClicked = "Share";
  } else if (optionName == "Suggest" || optionName == "建議") {
    cardClicked = "Suggest";
  } else if (optionName == "Tell" || optionName == "告訴") {
    cardClicked = "Tell";
  } else if (optionName == "Predict" || optionName == "預測") {
    cardClicked = "Predict";
  }
  return (
    <label
      className={style.optionLabel}
      onClick={() => handleClick(cardClicked)}
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
