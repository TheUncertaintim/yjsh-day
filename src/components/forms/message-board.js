import useSWR from "swr";
import Message from "./message";
import { MessageDataContext } from "./form-context";

// fetcher for swr
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MessageBoard() {
  const { data, error, isLoading } = useSWR("/api/cards", fetcher);

  if (error) {
    // error fetching the messages
    return (
      <div role="alert">
        <span>Oh oh...Messages failed to be loaded. Come back later?</span>;
      </div>
    );
  } else if (isLoading) {
    return (
      <div>
        <span>Loading other people&apos;s suggestions</span>
      </div>
    );
  } else if (data && data.length == 0) {
    // no message at all
    return (
      <div>
        <span>Hey! No one left a message yet. Wanna be the first one?</span>;
      </div>
    );
  } else {
    // display messages
    return (
      <div>
        <h1>Read more from our friends and family:</h1>
        {data.map((msg, idx) => (
          <MessageDataContext.Provider key={idx} value={msg}>
            <Message category={msg.category} />
          </MessageDataContext.Provider>
        ))}
      </div>
    );
  }
}
