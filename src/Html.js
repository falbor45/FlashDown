import React from 'react';

const Html = (props) => {
  return (
    <html>
    <head>
      <title>App</title>
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