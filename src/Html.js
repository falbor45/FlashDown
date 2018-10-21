import React from 'react';
import favicon from './app/assets/favicon.png'

const Html = (props) => {
  return (
    <html>
    <head>
      <title>Flash Down</title>
      <link rel="shortcut icon" type="image/png" href={`/${favicon}`}/>
      <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"/>
      <link rel="stylesheet" type="text/css" href="/styles.css"/>
    </head>
    <body>
    <div id="root">{props.children}</div>
    <script id="initial-state" type="text/plain" data-json={props.initialState}></script>
    <script src="/client.js"></script>
    </body>
    </html>
  );
};

export default Html;