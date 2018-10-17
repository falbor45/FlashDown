import express from 'express'
import cors from 'cors'
import path from 'path';
import 'fetch-everywhere'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import streamString from 'node-stream-string'
import App from '../app/App.js'
import Html from '../Html'

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(cors());

app.get('*', async (req, res) => {
  const initialState = { };
  const context = {};

  const stream = streamString`
    <!DOCTYPE html>
    ${ReactDOMServer.renderToNodeStream(
    <Html initialState={JSON.stringify(initialState)}>
    <StaticRouter location={req.url} context={context}>
      <App {...initialState} />
    </StaticRouter>
    </Html>
  )}
  `
  stream.pipe(res);
});

app.listen(process.env.PORT || 80, function () {
  console.log('listening on *:80');
});
