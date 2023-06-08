import { getImagePathByCategory } from "@/components/forms/utils";

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
    this.ctx.font = "20px gochi_handregular";

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
    // load background image, this would trigger onload()
    this.backgroundImage.src = getImagePathByCategory(this.msg.category);
  }

  animate() {
    const entries = this.filterPrintableEntries(this.msg);
    const entryGenerator = function* () {
      yield* entries;
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
      this.resumeTime = timestamp + Math.random() * 2000 + 1;
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
    // filter the entries so that only printables remain
    const filteredEntries = sortedEntries.filter(([key, _]) =>
      Object.hasOwn(positions, key)
    );
    // replace the boolean variables with a tick (or no tick)
    return filteredEntries.map(([key, value]) => {
      const position = positions[key];

      if (typeof value === "boolean") {
        return value ? [position, "✔"] : [position, " "];
      } else {
        // original value
        return [position, value];
      }
    });
  }

  /**Hard-coded positional value to for displaying text at particular position on the card */
  getTextPositionByCategory(category) {
    switch (category) {
      case "Advice":
        return {
          _1_alwaysText: [200, 220],
          _2_neverText: [200, 280],
          _3_sometimesText: [200, 340],
          _4_jokingBox: [90, 445],
          _5_trustMeBox: [320, 445],
          _6_blankBox: [540, 445],
          _7_blankInput: [590, 450],
          _8_signedBy: [610, 510],
        };

      default:
        // category "tell", "suggest", "predict" and "share" fall here
        return {
          textArea: [450, 150],
        };
    }
  }
}
