import { addCard } from "@/lib/datastore";

export default async function formHandler(req, res) {
  // handle only POST request
  if (req.method !== "POST") {
    console.log("Got a req with method ", req.method);
    res.status(400).json({ data: `${req.method} is not supported` });
    return;
  }

  const cardData = req.body;
  // TODO: server input validation here
  // if (...) {
  //   res.status(400).json({data: "Bad input"});
  //   return;
  // }

  // upload msg to google cloud
  try {
    const data = await addCard(cardData);
    const apiResponse = data[0];
    res.status(200).json({ data: apiResponse });
  } catch (err) {
    console.log("Failed to add new card data due to error:", err);
    res.status(400).json({ data: err });
  }
}
