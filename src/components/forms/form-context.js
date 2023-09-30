const { createContext } = require("react");

/**
 * EditableContext is true when user is writing messages to the newlyweds,
 * the context is set to false when displaying the messages written by others
 */
const EditableContext = createContext(true);

/**
 * Dispatch context helps passing the dispatch function from Reducer deep down
 * to each input field in a html form.
 */
const DispatchContext = createContext();

/**
 * MessageDataContext helps passing msg deep down to the input fields in a html form
 */
const MessageDataContext = createContext();

export { EditableContext, DispatchContext, MessageDataContext };
