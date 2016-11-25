if [ ! -f client-node.js ]; then
    ln -s "./dist/client-node.js" client-node.js
fi

if [ ! -f client-web.js ]; then
    ln -s "./dist/client-web.js" client-web.js
fi

if [ ! -f server.js ]; then
    ln -s "./dist/server.js" server.js
fi
