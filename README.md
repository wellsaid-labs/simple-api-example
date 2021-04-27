# WellSaid simple api example

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and modified to include an server.\
Please check their documentation for client-specific settings.

## Get started

First you need to get an WellSaid API key. Visit [developer.wellsaidlabs.com](https://developer.wellsaidlabs.com/) to get that process started. Create a `.env` at the root of this project and add the following line, substituting the placeholder with your API key.

```bash
WELLSAID_API_KEY=<your-api-key>
```

### `npm install`

Installs all the dependencies.

### `npm run dev`

Starts the client and server in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This starts bare-bones version of our editor. Select an avatar and render your first clip.

#### Layout

#### `server/index.js`

Exposes a `/stream` POST endpoint. It uses the `WELLSAID_API_KEY`, calls the TTS endpoint and streams the response back to the client.

#### `src/App.js`

Simple React app with a `textarea` and `select` components. Makes a call to the `/stream` endpoint and loads the TTS response into an `audio` element.
