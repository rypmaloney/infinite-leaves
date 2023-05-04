# Infinite Leaves

## About
Infinite Leaves is a digital art exhibit that marries the poetry of Walt Whitman's Leaves of Grass with AI-generated images, created using Stable Diffusion.

Over the course of a 35 hour loop, Infinite Leaves displays, in order, every verse of Leaves of Grass paired with one of over 10,000 images generated based on a GPT-4 interpretation.

Infinite Leaves continues whether you watch or not. Tune in at different times of the day to discover new, and sometimes unsettling, creations.

[Visit Infinite Leaves](https://infiniteleaves.com/)

## How Its Made
Each stanza was pulled from a txt document and fed to GPT-4 to produce an analysis a series of image prompts/captions. Those prompts were then fed to a local instance of Stable Diffusion I am running.

The webserver is a an Express backend with a react client side. The progression through the poem is happening on a 60 second setInterval. A websocket is established with the client that provides updates on previous, current and future stanzas. Images for the current and next stanza (for preloading), and some metadata for a countdown clock and visitor statistics.

All images are hosted in an S3 bucket and cached with Cloudfront. The poem is hosted in a MongoDB Atlas cluster.



!["I Sing the Body Electric - stanza 15"](/preview_images/3.png)
!["I Sing the Body Electric - stanza 17"](/preview_images/2.png)
!["I Sing the Body Electric - stanza 14"](/preview_images/4.png)
!["About"](/preview_images/5.png)
!["We Two, How Long We Were Fool'd"](/preview_images/1.png)
