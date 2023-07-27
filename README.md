# yjsh.day

This is a digital wedding guestbook I made for my own wedding reception in June 2023 (in Singapore & Taiwan).

At the moment, the site is still active under a custom domain https://yjsh.day. You can send us messages or upload pictures.

However, these functionalities are planned to be disabled by the end of August 2023.

![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/62e8e1a3-cb00-4b65-ac3c-42abd61eb573)

## History

The idea came initially from the physical marriage advice cards that we prepared to keep our wedding guest involved.

![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/756de9c5-5baa-4cb4-8dcc-98894be7b840)

As I was learning [Web Development on MDN](https://developer.mozilla.org/en-US/docs/Learn) in my spare time, we thought, why not make it an exercise, transforming it to an online version?

We still had about a month when we first had this idea, so we decided to make it happen.

## Design

My wife first started with a sketch in Figma.

![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/0bac7ef6-70c4-40f5-a2d2-18efccd7cacc)

The app consists of 3 main feature pages.

The leftmost page is a landing page with a customized logo in the background.

Here, the user is offered two links for navigation - leave us a text message (Tell Us), or upload a picture of us (or with us!) (Photos).

After that, the development of the app followed more or less as how it was designed.

## Technologies

The application is mainly written with React.js and Next.js.

### Structure

As Google Cloud Platform (GCP) was offering new customers a 90-day free trial (with $400 worth of credits), I decided to build the app around GCP services.

For example, the text messages received from the guest are stored in Datastore. The pictures uploaded are placed in Cloud Storage. For every image uploaded, a Cloud Function is triggered to compress the image to a thumbnail. To build the [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) in Next.js, the Google [Cloud Client Libraries](https://cloud.google.com/nodejs/docs/reference) was used for the communication with the backend. Finally, the application itself was deployed in the App Engine.

### Dependencies

In addition to the GCP client libraries, two additional libraries were required: [SWR](https://swr.vercel.app/) and [Photoswipe for React](https://photoswipe.com/react-image-gallery/).

The SWR was used to perform Client-side data fetching without jeopardizing the performance, while the Photoswipe provided a ready-made interface for the user to browse all the pictures in a gallery.

### Hidden feature

To display the messages publicly (e.g. on a TV) so that everyone can see, I made a hidden page (http://yjsh.day/animate) which iterates through the messages and animate the hand writings.
The animation of the text is adapted from [this SO answer](https://stackoverflow.com/questions/29911143/how-can-i-animate-the-drawing-of-text-on-a-web-page).

![output](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/5efb5f6d-5897-46a9-9494-c1cf9eced457)


## TODOs

### 1. Migrate to the latest App Router paradigm.
The structure of different pages are organized using the [Page Router](https://nextjs.org/docs/pages) paradigm in Next.js. Although migrating it to the latest [App Router](https://nextjs.org/docs/app) would be natural according to the Next.js doc, I am leaving it as a TODO for the future.
   
### 2. Add multi-language support using i18next framework
Due to the nature of languages used in different countries, I had to manually translate all the text on the website from English to Mandarin.
![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/ca5c7ff4-dde4-4381-b27a-a2fdeca0add3)

This solution could benefit a lot from making a dedicated toggle button to switch between English and Chinese.
Ideally, the images (marraige advice cards) loaded should also adapt to the language preference.
![image](https://github.com/TheUncertaintim/yjsh-day/assets/48164900/a4df5c71-c6ec-46c3-ad70-8c711247bc92)
