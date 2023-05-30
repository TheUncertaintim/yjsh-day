import { addCard } from "@/lib/datastore";

export default async function formHandler(req, res) {
  // handle only POST request
  if (req.method !== "POST") {
    console.log("Got a req with method ", req.method);
    res.status(400).json({ data: `${req.method} is not supported` });
    return;
  }

  const body = req.body;

  //TODO: repalce the following with req.json();
  let cardData = [];
  for (const key in body) {
    cardData.push({
      name: key,
      value: body[key],
    });
  }

  // TODO: server input validation here
  // if (...) {
  //   res.status(400).json({data: "Bad input"});
  //   return;
  // }

  try {
    // upload msg to google cloud
    const cardKeyId = await addCard(cardData);
    // finally, return ok
    res.status(200).json({ data: cardKeyId });
  } catch (err) {
    console.log("Failed to add new card data due to error:", err);
    // finally, return ok
    res.status(400).json({ data: err });
  }
}
