import { useEffect, useRef, useState } from "react";
import { getImagePathByCategory } from "@/components/forms/utils";
import useSWR, { mutate } from "swr";

import style from "../styles/animate.module.css";

if (typeof window !== "undefined") {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "20px gochi_handregular";
  ctx.lineWidth = 0.1;
  ctx.lineJoin = "round";
  ctx.globalAlpha = 1;
  ctx.strokeStyle = ctx.fillStyle = "#8C0303";
  console.log("Done setting up canvas font and style");
}

// constants
const DASH_LENGTH = 220;
const SPEED = 2;

export default function Animate() {
  // referencing the canvas
  const ref = useRef();

  // the idx of the advice card that's on display
  const [cardIdx, setCardIdx] = useState(0);

  // fetching available forms from the cloud
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    "/api/advices?entity=Card",
    fetcher
  );

  // render 2d graphics upon mounting
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.font = "40px gochi_handregular";

    var animationReq;
    if (!data) {
      ctx.fillText("Loading next advice...", 180, 280);
    } else if (data.length == 0) {
      ctx.fillText("Oops! Nothing to animate...", 180, 280);
    } else {
      ctx.font = "20px gochi_handregular";
      const msg = data[cardIdx];
      setup(ctx, msg, animationReq, handleNext);
    }

    // clean up
    return () => {
      if (animationReq) {
        console.log("cancelling animation request");
        cancelAnimationFrame(animationReq);
      }
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
  }, [cardIdx, data]);

  function handleNext() {
    // start from the beginning if it's the last advice
    if (cardIdx < data.length - 1) {
      console.log("Displaying card #", cardIdx);
      setCardIdx(cardIdx + 1);
    } else {
      console.log("Reaching the last card. Starting over again.");
      setCardIdx(0);
    }
  }

  return (
    <canvas ref={ref} width={800} height={571} className={style.canvas}>
      {/* TODO: Add fallback content  here */}
    </canvas>
  );
}

function setup(ctx, msg, animationReq, handleNext) {
  const backgroundImage = new Image();
  backgroundImage.src = getImagePathByCategory(msg.category);
  backgroundImage.onload = () => {
    // display card image
    ctx.drawImage(backgroundImage, 0, 0);
    // get printable entry strings
    const entries = filterPrintableEntries(msg);

    const entryGenerator = function* () {
      yield* entries;
    };
    const gen = entryGenerator();
    let result;
    let previousTimeStamp;
    let checkInputRequired = true;
    let position, text, i, dashOffset, x, y;
    let resumeTime = -1;
    function animate(timestamp) {
      // normalizing speed of animation
      if (previousTimeStamp == null) {
        previousTimeStamp = timestamp;
      }
      const delta = timestamp - previousTimeStamp;
      const speed = SPEED * delta;
      previousTimeStamp = timestamp;

      // run once per text (e.g. "Hello there")
      if (checkInputRequired) {
        if (resumeTime === -1) {
          // add random delay
          resumeTime = timestamp + Math.random() * 2000 + 1;
        }
        if (timestamp < resumeTime) {
          requestAnimationFrame(animate);
          return;
        } else {
          resumeTime = -1;
        }

        checkInputRequired = false;
        // fetch next string
        result = gen.next();
        if (result.done) {
          // no more text to animate
          cancelAnimationFrame(animationReq);
          // display the next one (if any)
          setTimeout(handleNext, 5000);
          return;
        }
        // animation text
        [position, text] = result.value;
        [x, y] = position;
        // initialize variable
        dashOffset = DASH_LENGTH;
        i = 0;
      }

      // create a long dash mask
      ctx.setLineDash([DASH_LENGTH - dashOffset, dashOffset - speed]);
      ctx.strokeText(text[i], x, y); // stroke letter
      dashOffset -= speed; // reduce dash length

      if (dashOffset > 0) {
        animationReq = requestAnimationFrame(animate); // animate
      } else {
        ctx.fillText(text[i], x, y); // fill final letter
        dashOffset = DASH_LENGTH; // prep next char
        // update cursor position
        const cursorMovement =
          ctx.measureText(text[i++]).width + ctx.lineWidth * Math.random();
        x += cursorMovement;

        if (i >= text.length) {
          checkInputRequired = true;
        }
        animationReq = requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  };
}

function filterPrintableEntries(msg) {
  const positions = getTextPositionByCategory(msg.category);
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

function getTextPositionByCategory(category) {
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
