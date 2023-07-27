import { listCards } from "@/lib/datastore";

export default async function adviceHandler(req, res) {
  if (req.method !== "GET") {
    console.log("AdviceForm should be fetched only with GET.");
    res.status(500).end();
  }
  const entity = req.query.entity;
  console.log(
    `A request to fetch cards of entity ${entity} has been received!`
  );
  try {
    const [listOfCards] = await listCards(entity);
    res.status(200).json(listOfCards);
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: error });
  }
}
