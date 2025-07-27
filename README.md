# zoomies map

Create stylized running heatmap via Strava Api


## Setup

To get started developing:
1. Go to https://developers.strava.com/docs/getting-started/ to create your own API Application
2. Create a `.env.development.local` file in the format of `.env.example` but use your client id + secret + localhost
3. If you would like to deploy your app, create a `.env.production.local` file in the format of `.env.example` but use your client id + secret + deployed URL
4. `pnpm install` to install and then `pnpm run dev` to start the app (feel free to adjust the deploy script to match your needs)

## Disclaimers

Note due to Strava's free API only being limited number of logins to 1 person, you'll have to have your own Strava app to get your client id + secret if you want to use this app.


I would **not recommend** deploying this code as is for public usage as this is fully client-side code.
Realistically you should have your strava client secret on the BE server and have it handle requests containing the client secret, i.e.
```
FE <-> BE <-> Strava
```
to prevent the strava client secret being exposed in network requests.
