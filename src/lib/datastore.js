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

  return new Promise(async (resolve, reject) => {
    try {
      await datastore.save(entity);
      console.log(`Card ${cardKey.id} created successfully.`);
      resolve(cardKey.id);
    } catch (err) {
      console.error("ERROR:", err);
      reject(new Error(`ERROR: ${err}`));
    }
  });
}
// [END datastore_add_entity]

// [START datastore_retrieve_entities]
async function listCards(EntityKind) {
  // arrange the cards from oldest to newest
  const option = {
    descending: true,
  };
  const query = datastore.createQuery(EntityKind).order("timeCreated", option);

  return await datastore.runQuery(query);
}
// [END datastore_retrieve_entities]

export { addCard, listCards };
