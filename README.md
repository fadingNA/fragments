# Fragments
LAB1 

# Introduction
This is the first lab of Cloud computing of programmer at the Seneca College of Computer Programming and Analysis. 

Step 1: Create a new repository on your GitHub account and name it fragments.
- [x] Create a new repository on your GitHub account and name it fragments.
- [x] Clone the repository to my local machine.
> ```git clone [repository link]```


Step2: Modify package.json to add the following scripts:

```javascript
{
  "name": "fragments",
  "private": true,
  "version": "0.0.1",
  "description": "Fragments back-end API",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourname/fragments.git"
  },
  "author": "Your Name",
  "license": "UNLICENSED"
}
```

Step3: Prettier and ESLint Setup
- [x] Create the file name .eslintrc.json with command
> ```eslint --init```
- [x] Create the file name .prettierrc with command
> ```touch .prettierrc```

Step4: Add Lint in the json file
```javascript
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint --config .eslintrc.js \"./src/**/*.js\""
}
```

Step4: Setup Pino and Logging for logging output to terminal.
- [x] Install Pino
- use LOGGING_LEVEL=debug to see all logs instead of console.log

Step5: Setup Express and Server

Step6: Run eslint to check errors in the code.

Step7: Test Server.

Step8: Use Client URL to test the server (CURL)
- [x] curl https://localhost:8080
- [x] Check response status code should be 200 it mean OK good health.
- [x] Check Author and Github Repository name in the response body.

```
curl -s localhost:8080 | jq
{
  "status": "ok",
  "author": "Nonthachai Plodthong",
  "githubUrl": "https://github.com/fadingNA/fragments",
  "version": "0.0.1"
}
```

Note: MacOs user need to install jq to see the response body.

Step9: Setup Debugging for VSCode in the package.json
```javascript
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint --config .eslintrc.js \"./src/**/*.js\"",
  "start": "node src/server.js",
  "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
},
```
-[x] Create Directory name .vscode and 
```
touch launch.json
touch setting.json
```

Step10: Try to run the server with 3 methods

- [x] npm start (run the server) simply run the server
- [x] npm run dev (run the server) 
- [x] npm run debug (run the server) run the server with nodemon and debug mode



    

    
