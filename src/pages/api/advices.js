import { listCards } from "@/lib/datastore";

export default async function adviceHandler(req, res) {
  if (req.method !== "GET") {
    console.log("AdviceForm should be fetched only with GET.");
    res.status(500).end();
  }
  console.log("A request has been received!");
  const entity = req.query.entity;
  try {
    const [listOfCards] = await listCards(entity);
    res.json(listOfCards);
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: error });
  }
}
