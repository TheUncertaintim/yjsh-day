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

    if (!data) {
      ctx.fillText("Loading next advice...", 100, 300);
      console.log("Loading...");
    } else {
      let msg = data[cardIdx];
      const backgroundImage = new Image();
      backgroundImage.src = getImagePathByCategory(msg.category);
      backgroundImage.onload = () => {
        console.log("Animating...");
        // display card image
        ctx.drawImage(backgroundImage, 0, 0);
        // callback to fetch next message
        const handleNext = () => {
          // delay calling the next card for 5 seconds
          setTimeout(() => {
            if (cardIdx < data.length - 1) {
              console.log("Currently at card ... ", cardIdx);
              setCardIdx(cardIdx + 1);
            } else {
              // refresh all the cards
              mutate("/api/advices?entity=Card");
              // give it a bit time to fetch data
              setTimeout(() => setCardIdx(0), 5000);
            }
          }, 5000);
        };

        // sort the entryies so that it's printed in the correct order
        const sortedMsg = Object.keys(msg)
          .sort()
          .reduce((obj, key) => {
            obj[key] = msg[key];
            return obj;
          }, {});

        animateMessages(ctx, sortedMsg, handleNext);
      };
    }

    // clean up
    return () => ctx.clearRect(0, 0, innerWidth, innerHeight);
  }, [cardIdx, data]);

  let y = 90;
  return (
    <canvas ref={ref} width={800} height={571} className={style.canvas}>
      {/* TODO: Add fallback content here */}
    </canvas>
  );
}

function animateMessages(ctx, msg, handleNext) {
  const positions = getTextPositionByCategory(msg.category);

  let printableEntries = Object.entries(msg);
  printableEntries = printableEntries.filter(([key, value]) =>
    Object.hasOwn(positions, key)
  );
  console.log(printableEntries);
  const entryGenerator = function* () {
    yield* printableEntries;
  };
  const gen = entryGenerator();

  // schedule callback within callbacks
  const run = () => {
    let result = gen.next();
    if (!result.done) {
      let [key, text] = result.value;

      // special treatment for the boolean boxes
      if (typeof text == "boolean") {
        text = text ? "✔" : " ";
      }
      // animate only the printable fields
      if (Object.hasOwn(positions, key)) {
        const position = positions[key];
        console.log("Animating", text, "at position", position);
        animate(ctx, text, position, run);
      } else {
        console.error(
          `Found not registered key ${key}. This should not happen!`
        );
      }
    } else {
      // done animating all the texts
      console.log("Calling next message");
      handleNext();
    }
  };

  run();
}

function animate(ctx, text, position, callBack) {
  const dashLen = 220;
  const speed = 0.8;
  let dashOffset = dashLen;
  let i = 0;
  let [x, y] = position;
  let previousTimeStamp;

  let animationReq;

  function loop(timestamp) {
    if (previousTimeStamp == null) {
      previousTimeStamp = timestamp;
    }
    // normalizing speed of animation
    const delta = timestamp - previousTimeStamp;
    const speedNormalized = speed * delta;
    previousTimeStamp = timestamp;

    ctx.setLineDash([dashLen - dashOffset, dashOffset - speedNormalized]); // create a long dash mask
    dashOffset -= speedNormalized; // reduce dash length
    ctx.strokeText(text[i], x, y); // stroke letter

    if (dashOffset > 0) {
      animationReq = window.requestAnimationFrame(loop); // animate
    } else {
      ctx.fillText(text[i], x, y); // fill final letter
      dashOffset = dashLen; // prep next char
      x += ctx.measureText(text[i++]).width + ctx.lineWidth * Math.random() + 2;
      // ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
      // ctx.rotate(Math.random() * 0.005); // random rotation
      if (i < text.length) {
        animationReq = window.requestAnimationFrame(loop);
      } else {
        window.cancelAnimationFrame(animationReq);
        callBack();
      }
    }
  }

  requestAnimationFrame(loop);
}

function getTextPositionByCategory(category) {
  switch (category) {
    case "Advice":
      return {
        _1_alwaysText: [200, 220],
        _2_neverText: [200, 280],
        _3_sometimesText: [200, 340],
        _4_jokingBox: [140, 450],
        _5_trustMeBox: [340, 450],
        _6_blankBox: [540, 450],
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
