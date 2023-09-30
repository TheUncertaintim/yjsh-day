import { Datastore } from "@google-cloud/datastore";

const MESSAGE_ENTITY = process.env.MESSAGE_ENTITY;
const PHOTO_URL_ENTITY = process.env.PHOTO_URL_ENTITY;

// Creates a client
const datastore = new Datastore();

function addCard(cardData) {
  const cardKey = datastore.key(MESSAGE_ENTITY);
  const entity = {
    key: cardKey,
    data: cardData,
  };

  return datastore.save(entity);
}

function getCards() {
  // arrange the cards from oldest to newest
  const option = {
    descending: true,
  };
  const query = datastore
    .createQuery(MESSAGE_ENTITY)
    .order("timeCreated", option);

  return datastore.runQuery(query);
}

function getImagesUrls() {
  // arrange the urls from oldest to newest
  const option = {
    descending: true,
  };
  const query = datastore
    .createQuery(PHOTO_URL_ENTITY)
    .order("timeCreated", option);

  return datastore.runQuery(query);
}

export { addCard, getCards, getImagesUrls };
