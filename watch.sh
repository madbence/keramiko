BIN=node_modules/.bin

$BIN/http-server -p 3000 &
$BIN/stylus -w src/styles/main.styl -o public/bundle.css & \
$BIN/watchify -d -v -t babelify -o public/bundle.js src/app.js & \
wait
