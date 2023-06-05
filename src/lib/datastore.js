import { Datastore } from "@google-cloud/datastore";

// define constants
const EntityKind = "Card";

// connect to GCD
// const { Datastore } = require("@google-cloud/datastore");

// Creates a client
const datastore = new Datastore();

// [START datastore_add_entity]
function addCard(cardData) {
  const cardKey = datastore.key(EntityKind);
  const entity = {
    key: cardKey,
    data: cardData,
  };

  return datastore.save(entity);
}
// [END datastore_add_entity]

// [START datastore_retrieve_entities]
function listCards(EntityKind) {
  // arrange the cards from oldest to newest
  const option = {
    descending: true,
  };
  const query = datastore.createQuery(EntityKind).order("timeCreated", option);

  return datastore.runQuery(query);
}
// [END datastore_retrieve_entities]

export { addCard, listCards };
