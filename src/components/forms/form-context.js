const { createContext } = require("react");

/**
 * EditableContext is true when user is writing messages to the newlyweds,
 * the context is set to false when displaying the messages written by others
 */
const EditableContext = createContext(true);

export { EditableContext };
