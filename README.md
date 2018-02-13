# Plants identifier
> Note: This project was developed only under NodeJS v8.9 so there may be 
incompatibility issues. OpenCV is required on you machine.

## Installation
To run clone this repository and then execute `sh ./install.sh`.

This project comes with a pre-loaded training info at `assets/knowlodge.json`.
To learn how this project trains check the `src/utils/training.ts` file.

To train with new images, fill `assets/info.json` with new information about 
new images and where to find their description. Then run this command:
`ts-node src/utils/training.ts`.

> You can install `ts-node` through this command `npm i -g ts-node`.

## Development
Some commands after installation:
- While developing: `npm run dev`.
- To build: `npm run build`
- To start once built: `npm start`
