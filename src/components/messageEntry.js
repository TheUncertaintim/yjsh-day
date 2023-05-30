import style from "../styles/messageEntry.module.css";

export default function MessageEntry({ msg, handleEntry, editable }) {
  function onInputChange(change) {
    // compose new entry instance
    const newEntry = {
      ...msg,
      ...change,
    };
    // update new entry
    handleEntry(newEntry);
  }
  // TODO restrict input chars
  if (msg.category === "Advice") {
    return (
      <>
        <input
          name="alwaysText"
          value={msg["alwaysText"]}
          onChange={(e) => {
            onInputChange({ alwaysText: e.target.value });
          }}
          className={`${style.input} ${style.alwaysText}`}
          disabled={!editable}
        />
        <input
          name="neverText"
          value={msg["neverText"]}
          onChange={(e) => {
            onInputChange({ neverText: e.target.value });
          }}
          className={`${style.input} ${style.neverText}`}
          disabled={!editable}
        />
        <input
          name="sometimesText"
          value={msg["sometimesText"]}
          onChange={(e) => {
            onInputChange({ sometimesText: e.target.value });
          }}
          className={`${style.input} ${style.sometimesText}`}
          disabled={!editable}
        />
        <div className={style.checkBoxes}>
          <div className={style.jokingOption}>
            <input
              name="jokingBox"
              checked={msg["jokingBox"]}
              type="checkbox"
              onChange={(e) => {
                onInputChange({ jokingBox: e.target.checked });
              }}
              disabled={!editable}
            />
          </div>
          <div className={style.trustMeOption}>
            <input
              name="trustMeBox"
              checked={msg["trustMeBox"]}
              type="checkbox"
              onChange={(e) => {
                onInputChange({ trustMeBox: e.target.checked });
              }}
              disabled={!editable}
            />
          </div>
          <div className={style.blankOption}>
            <input
              name="blankBox"
              checked={msg["blankBox"]}
              type="checkbox"
              onChange={(e) => {
                onInputChange({ blankBox: e.target.checked });
              }}
              disabled={!editable}
            />
            <input
              name="blankInput"
              type="text"
              value={msg["blankInput"]}
              className={`${style.input} ${style.blankInput}`}
              onChange={(e) => {
                onInputChange({ blankInput: e.target.value });
              }}
              disabled={!editable}
            />
          </div>
        </div>
        <input
          name="signedBy"
          value={msg["signedBy"]}
          onChange={(e) => {
            onInputChange({ signedBy: e.target.value });
          }}
          className={`${style.input} ${style.signedByText}`}
          disabled={!editable}
        />
      </>
    );
  } else {
    return (
      <textarea
        name="message"
        value={msg["adviceTextarea"]}
        placeholder="Long story short..."
        className={style.formTextArea}
        onChange={(e) => {
          onInputChange({ adviceTextarea: e.target.value });
        }}
        disabled={!editable}
      ></textarea>
    );
  }
}
