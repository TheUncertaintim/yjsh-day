import { Datastore } from "@google-cloud/datastore";

// define constants
const EntityKind = "Card";

// Creates a client
const datastore = new Datastore();

function addCard(cardData) {
  const cardKey = datastore.key(EntityKind);
  const entity = {
    key: cardKey,
    data: cardData,
  };

  return datastore.save(entity);
}

function listCards() {
  // arrange the cards from oldest to newest
  const option = {
    descending: true,
  };
  const query = datastore.createQuery(EntityKind).order("timeCreated", option);

  return datastore.runQuery(query);
}

export { addCard, listCards };
