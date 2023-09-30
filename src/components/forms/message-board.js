import useSWR from "swr";
import Message from "./message";

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
        {data &&
          data.map((msg, idx) => (
            <Message key={idx} category={msg.category} msg={msg} />
          ))}
      </>
    );
  }
}
