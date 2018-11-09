# Flash Down

> Flash Down is a simplistic tool designed for easy summoner stats look-up. The project aims to aid players with statistics that would help them improve in further games. Apart from that, this tool will also allow to see live games.

## Notice
Because of Riot's API key rate limitations, one may experience errors when using the app due to exceeding mentioned limitations.
## Live Demo
<https://flash-down-server.herokuapp.com>

## Technologies used
* React 16.4.1
* Express 4.16.3
* Webpack 4.16.1

## Features
* search any summoner from around the world
* get recent matches for searched summoner
* get most played champions in recent games
* get ranked solo, flex 5v5, flex 3v3 queue data
* create room for any live game and track summoners' spells (manual input)
* compare performance of summoner to others in any recent match you want

## Setup
If you want to run this app locally, here's how:
1. Clone this repository
2. Move to the repository and download all packages with `npm install`
3. Build app with `npm run build`
4. Run both API and app server with
    `node ./build/api.js`
    `node ./build/server.js`
5. By default, the app is running on `localhost:80` and API on `localhost:3000`

## Status
Project is: _in progress_
