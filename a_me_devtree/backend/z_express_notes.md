npm init
npm install express
npm install express@3.20.3
npx kill-port 4000

# Para iniciar el servidor de desarrollo

- Por comando
  node --watch index.js
  "dev": "node --watch index.js"
  npm run dev

- Por libreria
  npm install -D nodemon
  npm install -save-dev nodemon
  nodemon index.js
  "dev": "nodemon index.js"
  `npm run dev`

# Instalar typescript

- Librerias
  npm install -D typescript ts-node
  quitar de package.json "type": "module",
  crear tsconfig.json
  actualizar el comando de `npm run dev`
