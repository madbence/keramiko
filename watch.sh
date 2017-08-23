BIN=node_modules/.bin

$BIN/stylus -w src/client/styles/main.styl -o public/admin.css & \
$BIN/watchify -d -v -t babelify -o public/bundle.js src/client/app.js & \
$BIN/babel-node src/server/app.js & \
wait
