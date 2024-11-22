# How to run

## Initialize a new Node.js project

```
npm init -y
```

## Install necessary dependencies

```
npm install express
npm install -D typescript @types/express @types/node ts-node nodemon
```

## Create a tsconfig.json file

```
npx tsc --init
```

## Create a src directory and an index.ts file

```
mkdir src
touch src/index.ts
```

## Add a start script to package.json

npm pkg set scripts.start="nodemon src/index.ts"

## Create a basic Express server in src/index.ts

```
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
console.log(\`Server is running on http://localhost:\${port}\`);
});
```

## Update tsconfig.json

```
sed -i '' 's/"target": "es2016"/"target": "es6"/g' tsconfig.json
sed -i '' 's/"module": "commonjs"/"module": "commonjs",\n "outDir": ".\/dist",\n "rootDir": ".\/src"/g' tsconfig.json
```
