# yjsh.day

This is a digital wedding guestbook I made for my own wedding reception in June 2023 (in Singapore & Taiwan).

## Current status
This web app hosted at [yjsh.day](ttps://eighth-server-388223.as.r.appspot.com/) is no longer actively maintained. You are free to poke around, but you won't be able to submit messages and photos to us anymore!

![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/62e8e1a3-cb00-4b65-ac3c-42abd61eb573)

## History

The idea came initially from the physical marriage advice cards that we prepared to keep our wedding guest involved.

![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/756de9c5-5baa-4cb4-8dcc-98894be7b840)

As I was learning [Web Development on MDN](https://developer.mozilla.org/en-US/docs/Learn) in my spare time, we thought, why not make it an exercise, transforming it to an online version?

We still had about a month when we first had this idea, so we decided to make it happen. 

## Technologies

The application is mainly written with [React.js](https://react.dev/) and [Next.js](https://nextjs.org/).

### Structure

As Google Cloud Platform (GCP) was offering new customers a 90-day free trial (with $400 worth of credits), I decided to build the app around GCP services.

For example, the text messages received from the guests are stored in Datastore. The pictures uploaded are placed in Cloud Storage. For every image uploaded, a Cloud Function is triggered to compress the image to a thumbnail. To build the [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) in Next.js, the Google [Cloud Client Libraries](https://cloud.google.com/nodejs/docs/reference) was used for the communication with the backend. Finally, the application itself was deployed in the Google App Engine.

### Dependencies

In addition to the GCP client libraries, two additional libraries were required: [SWR](https://swr.vercel.app/) and [Photoswipe for React](https://photoswipe.com/react-image-gallery/).

The SWR was used to perform Client-side data fetching without jeopardizing the performance, while the Photoswipe provided a ready-made interface for the user to browse all the pictures in a gallery.

## Journey

Checkout [my portfolio](https://theuncertaintim.com/portfolio/yjsh-day) where I documented the whole journey with more details. 
