MATCHESFASHION EXAMPLE APPLICATION

I'd like to start by saying that this app isn't finished at all and is missing some very important pieces to make it a production ready application.

I think that I was just happy to share the way that i'm using server side render & hot module reloading. I'm still trying to learn a lot of the fundamentals. The bits I didn't get to finish was the sort and the login page. That is probably because i sent a bit more time on making the form look ok.

To run this app there is to ways:

npm run start-dev
npm run start-prod

These can be found in the npm scripts part of the package json. We have a few flag in there that control both sever rendering and live data.

I have put the routes for live data so it could be just dropped in.

I have also added in some very simple acceptance tests for the ATDD style of doing things. As a rule i would always add features this way. As this wasn't asked for i didn't go as deep as i would normally.  

So I hope you like what i've put together...
 