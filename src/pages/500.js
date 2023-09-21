// Define a custom 500 error page to prevent the default error page appears within the shared layout

export default function Custom500() {
  return <h1>500 - Server-side error occurred</h1>;
}
