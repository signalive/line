if [ ! -f client-node.js ]; then
    ln -s "./dist/client-node.js" client-node.js
fi

if [ ! -f client-node.d.ts ]; then
    ln -s "./src/client/client-node.d.ts" client-node.d.ts
fi

if [ ! -f client-web.js ]; then
    ln -s "./dist/client-web.js" client-web.js
fi

if [ ! -f client-web.d.ts ]; then
    ln -s "./src/client/client-web.d.ts" client-web.d.ts
fi

if [ ! -f server.js ]; then
    ln -s "./dist/server.js" server.js
fi
