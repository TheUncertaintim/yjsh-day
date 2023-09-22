import { useEffect, useRef, useState } from "react";
import DisplayableCard from "@/components/displayable-card";
import { getAnimationBackgroundByCategory } from "@/components/forms/utils";
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
// fetching available forms from the cloud
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Animate() {
  // referencing the canvas
  const ref = useRef();

  // the idx of the advice card that's on display
  const [cardIdx, setCardIdx] = useState(0);

  const { data, error, isLoading } = useSWR("/api/card", fetcher);

  // render 2d graphics upon mounting
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    ctx.font = "40px gochi_handregular";

    let card;
    if (!data) {
      ctx.fillText("Loading next advice...", 180, 280);
    } else if (data.length == 0) {
      ctx.fillText("Oops! Nothing to animate...", 180, 280);
    } else {
      const msg = data[cardIdx];
      const animationOption = {
        dashLength: 220,
        speed: 2,
      };
      card = new DisplayableCard(ctx, msg, handleNext, animationOption);
      card.display();
    }

    function handleNext() {
      // start from the beginning if it's the last advice
      if (cardIdx < data.length - 1) {
        console.log("Displaying card #", cardIdx);
        setCardIdx(cardIdx + 1);
      } else {
        console.log("Reaching the last card. Starting over again.");
        // pull the changes again and start from the first
        mutate("/api/card");
        setTimeout(() => setCardIdx(0), 1000);
      }
    }

    // clean up
    return () => {
      if (card) {
        card.cleanUp();
      }

      ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
  }, [cardIdx, data]);

  return (
    <canvas ref={ref} width={1748} height={1240} className={style.canvas}>
      Animating marriage advice being written down by hand.
    </canvas>
  );
}
