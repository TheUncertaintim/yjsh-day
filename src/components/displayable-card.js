import { getAnimationBackgroundByCategory } from "@/utils/utils";

// TODO: magin number!!!
const TEXT_AREA_WIDTH = 35;
const LINE_HEIGHT = 50;

export default class DisplayableCard {
  // field declaration for animation use
  // to be moved elsewhere later
  result;
  previousTimeStamp;
  checkInputRequired = true;
  position;
  text;
  i;
  dashOffset;
  x;
  y;
  resumeTime = -1;

  constructor(ctx, msg, onNext, option) {
    this.ctx = ctx;
    this.msg = msg;
    this.onNext = onNext;
    this.animationReq;
    this.backgroundImage = new Image();
    //option
    const { speed, dashLength } = option;
    this.SPEED = speed;
    this.DASH_LENGTH = dashLength;
    // for animation
    this.loop = this.loop.bind(this);
  }

  display() {
    this.ctx.font = "40px gochi_handregular";

    this.backgroundImage.onload = () => {
      // display card image
      this.ctx.drawImage(this.backgroundImage, 0, 0);
      // start animation
      this.animate();
    };

    this.loadBackground();
  }

  /** load background image */
  loadBackground() {
    const category = this.msg.category;
    // load background image, this would trigger onload()
    this.backgroundImage.src = getAnimationBackgroundByCategory(category);
  }

  animate() {
    const entries = this.filterPrintableEntries(this.msg);
    const entryPositionPair = this.mapEntryPosition(this.msg, entries);
    const entryGenerator = function* () {
      yield* entryPositionPair;
    };
    this.gen = entryGenerator();

    this.loop();
  }

  loop(timestamp) {
    const delta = this.calculateDeltaTime(timestamp);
    const speed = this.SPEED * delta;

    if (this.checkInputRequired) {
      if (this.isOnPause(timestamp)) {
        requestAnimationFrame(this.loop);
        return;
      }

      const succeed = this.loadNextMessage();
      if (succeed) {
        this.checkInputRequired = false;
      } else {
        this.checkInputRequired = true;
        // no more text to animate
        cancelAnimationFrame(this.animationReq);
        // display the next one (if any)
        setTimeout(this.onNext, 5000);
        return;
      }
    }

    // main section for animating each letter
    // create a long dash mask
    this.ctx.setLineDash([
      this.DASH_LENGTH - this.dashOffset,
      this.dashOffset - speed,
    ]);
    this.ctx.strokeText(this.text[this.i], this.x, this.y); // stroke letter
    this.dashOffset -= speed; // reduce dash length

    if (this.dashOffset > 0) {
      this.animationReq = requestAnimationFrame(this.loop); // animate
    } else {
      this.ctx.fillText(this.text[this.i], this.x, this.y); // fill final letter
      this.dashOffset = this.DASH_LENGTH; // prep next char
      // update cursor position
      this.x +=
        this.ctx.measureText(this.text[this.i++]).width + Math.random() * 2;

      if (this.i >= this.text.length) {
        this.checkInputRequired = true;
      }
      this.animationReq = requestAnimationFrame(this.loop);
    }
  }

  calculateDeltaTime(timestamp) {
    // normalizing speed of animation
    if (this.previousTimeStamp == null) {
      this.previousTimeStamp = timestamp;
    }
    const delta = timestamp - this.previousTimeStamp;

    this.previousTimeStamp = timestamp;
    return delta;
  }

  loadNextMessage() {
    // fetch next string
    this.result = this.gen.next();
    if (this.result.done) {
      return false;
    }
    // animation text
    [this.position, this.text] = this.result.value;
    [this.x, this.y] = this.position;
    // initialize variable
    this.dashOffset = this.DASH_LENGTH;
    this.i = 0;
    return true;
  }

  isOnPause(timestamp) {
    if (this.resumeTime === -1) {
      // add random 0 ~ 2 sec delay
      this.resumeTime = timestamp + Math.random() * 1000 + 1;
    }
    if (timestamp < this.resumeTime) {
      return true;
    } else {
      this.resumeTime = -1;
      return false;
    }
  }

  cleanUp() {
    cancelAnimationFrame(this.animationReq);
  }

  filterPrintableEntries(msg) {
    const positions = this.getTextPositionByCategory(msg.category);
    // sort the entryies so that it's printed in the correct order
    const sortedEntries = Object.entries(msg).sort(([key1, v1], [key2, v2]) =>
      key1 > key2 ? 1 : key1 === key2 ? 0 : -1
    );
    // filter the entries so that only the printables (have valid positions) remain
    return sortedEntries.filter(([key, _]) => Object.hasOwn(positions, key));
  }

  mapEntryPosition(msg, entries) {
    const textAreaLabel = "textArea";
    // map entry to positions
    const positions = this.getTextPositionByCategory(msg.category);
    // map entries to their respective positions
    const mappedEntries = entries.map(([key, value]) => {
      const position = positions[key];
      if (key == textAreaLabel) {
        // don't alter value here, need special treatment later
        return [key, value];
      } else if (typeof value === "boolean") {
        // replace the boolean variables with a tick (or no tick)
        return value ? [position, "✔"] : [position, " "];
      } else {
        // mapped position to text
        return [position, value];
      }
    });

    // find the text area
    const textAreaText = mappedEntries.find(
      ([key, value]) => key == textAreaLabel
    );
    if (textAreaText) {
      const sections = [];
      const paragraphs = textAreaText[1].split(/\n+/);
      for (const paragraph of paragraphs) {
        sections.push(this.paragraphToLines(paragraph));
      }
      let [xPos, yPos] = positions[textAreaLabel];
      // remove the original text area entry
      mappedEntries.shift();
      for (const paragraph of sections) {
        for (const line of paragraph) {
          const linePos = [xPos, yPos];
          mappedEntries.push([linePos, line]);
          yPos += LINE_HEIGHT;
        }
        // meant to be double new line
        yPos += LINE_HEIGHT;
      }
    }

    return mappedEntries;
  }

  paragraphToLines(paragraph) {
    const words = paragraph.split(/\s+/);
    let lines = [];
    let line = "";
    for (const word of words) {
      if (word.length + line.length > TEXT_AREA_WIDTH) {
        lines.push(line.trim());
        line = word;
      } else {
        line += " " + word;
      }
    }
    // append the last line
    lines.push(line.trim());
    return lines;
  }

  /**Hard-coded positional value to for displaying text at particular position on the card */
  getTextPositionByCategory(category) {
    switch (category) {
      case "Advice":
        return {
          _1_alwaysText: [437, 477.4],
          _2_neverText: [437, 607.6],
          _3_sometimesText: [437, 737.8],
          _4_jokingBox: [196.65, 965.65],
          _5_trustMeBox: [699.2, 965.65],
          _6_blankBox: [1179.9, 965.65],
          _7_blankInput: [1289.15, 976.5],
          _8_signedBy: [1332.85, 1126.7],
        };

      default:
        // category "tell", "suggest", "predict" and "share" fall here
        return {
          textArea: [917.7, 325.74],
        };
    }
  }
}
