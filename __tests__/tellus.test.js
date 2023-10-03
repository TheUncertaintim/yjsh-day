import { getByPlaceholderText, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import TellUs from "@/pages/tellus";

test("label's font-weight become bold on click", async () => {
  // arrange
  const { getByText } = render(<TellUs />);

  // act
  await userEvent.click(getByText("Share"));

  // assert
  expect(getByText("Share")).toHaveStyle(`font-weight: bold`);
  expect(getByText("Advice")).not.toHaveStyle(`font-weight: bold`);
});

test("submit button should be disabled by default", () => {
  // arrange
  const { getByRole } = render(<TellUs />);

  // assert
  const button = getByRole("button");
  expect(button).toBeDisabled();
});

test("submit button should be enabled after text entry", async () => {
  // arrange
  const { getByTestId, getByRole } = render(<TellUs />);

  const form = getByTestId("user-submit-form");

  // assert button to be disabled
  const button = getByRole("button");
  expect(button).toBeDisabled();

  // type something in the first text input ("always...")
  const input = getByPlaceholderText(form, "water your plant", {
    exact: false,
  });
  await userEvent.type(input, "hug your partner before sleep");

  // button should be enabled after any text entry
  expect(button).not.toBeDisabled();
});
