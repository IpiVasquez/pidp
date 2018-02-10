npm i
cp -R src/types/opencv node_modules/@types/
cp -R node_modules/opencv/build/opencv/v6.0.0/Release node_modules/opencv/build/opencv/v6.0.0/Debug
mkdir tmp
npm run build
npm start
