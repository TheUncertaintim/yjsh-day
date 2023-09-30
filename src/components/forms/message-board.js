import useSWR from "swr";
import { getImagePathByCategory } from "@/utils/utils";
import MessageEntry from "./message-entry";
import style from "@/styles/form.module.css";

// fetcher for swr
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MessageBoard() {
  const { data, error, isLoading } = useSWR("/api/cards", fetcher);
  if (error) {
    // TODO: handle error!!!
    console.log("error: ", error);
  }

  if (data && data.length == 0) {
    return <p>Want to be the first one to give your advice?</p>;
  } else {
    return (
      <>
        <h1>Read more from our friends and family:</h1>
        {isLoading && <label>Loading other people&apos;s suggestions</label>}
        {data && data.map((msg, index) => <Message key={index} msg={msg} />)}
      </>
    );
  }
}

function Message({ msg }) {
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
      <MessageEntry category={msg.category} msg={msg} />
    </form>
  );
}
