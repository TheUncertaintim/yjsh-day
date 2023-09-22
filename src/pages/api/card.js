import { addCard, listCards } from "@/lib/datastore";

export default async function adviceHandler(req, res) {
  // handle only GET and POST request
  switch (req.method) {
    case "GET":
      try {
        // pull cards from google cloud
        const [listOfCards] = await listCards();
        res.status(200).json(listOfCards);
      } catch (error) {
        console.log(error);
        res.status(500).json({ err: error });
      }
      break;
    case "POST":
      const cardData = req.body;
      // TODO: server input validation here

      // upload msg to google cloud
      try {
        const data = await addCard(cardData);
        const apiResponse = data[0];
        res.status(200).json({ data: apiResponse });
      } catch (err) {
        console.log("Failed to add new card data due to error:", err);
        res.status(400).json({ data: err });
      }
      break;
    default:
      console.log(`Method ${req.method} is not allowed.`);
      res.status(405).end({ message: "Allowed: [GET, POST]" });
      break;
  }
}
