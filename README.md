# Run Tracer

Create stylized running heatmap via Strava Api

![run-tracer-demo](https://github.com/user-attachments/assets/e4eea3b6-e54a-4176-9001-c0a8f925312b)

## Setup

To get started developing:
1. Go to https://developers.strava.com/docs/getting-started/ to create your own API Application
2. Create a `.env.development.local` file in the format of `.env.example` but use your client id + secret + localhost
3. If you would like to deploy your app, create a `.env.production.local` file in the format of `.env.example` but use your client id + secret + deployed URL
4. `pnpm install` to install and then `pnpm run dev` to start the app

## Disclaimers

### Strava API limitations
Strava's free API only being limited number of logins to 1 person, you'll have to have your own Strava app to get your client id + secret if you want to use this app

Implementing real-time speed for each activity would also be constrained by Strava's API rate limits; frequent requests for stream data would rapidly consume the allocated request quota.

### Security
**I would NOT recommend deploying this code for public usage as is.** This is because you Strava client secret is exposed in bundled JavaScript and network requests.
  
For a production-ready application, all API calls involving your client secret should be proxied through a secure backend server to prevent unauthorized access to your secrets.
