# MusareNode
This is a rewrite of the original [Musare](https://github.com/Musare/MusareMeteor)
in NodeJS, Express, SocketIO and React.

The site is available at [https://musare.com](https://musare.com).

### Our Stack

   * NodeJS
   * MongoDB
   * Redis
   * Nginx (not required)
   * React

### Frontend
The frontend is a [React](https://github.com/facebook/react) single page app that uses
[react-router](https://github.com/ReactTraining/react-router),
served over Nginx or express. The Nginx server not only serves the frontend, but
also serves as a load balancer for requests going to the backend.

### Backend
The backend is a scalable NodeJS / Redis / MongoDB app. Each backend
server handles a group of SocketIO connections. User sessions are stored
in a central Redis server. All data is stored in a central MongoDB server.
The Redis and MongoDB servers are replicated to several secondary nodes,
which can become the primary node if the current primary node goes down.

We currently only have 1 backend, 1 MongoDB server and 1 Redis server running for production, though it is relatively easy to expand.

## Requirements
 * [NodeJS](https://nodejs.org/en/download/) (we recommend using [Node Version Manager](https://github.com/coreybutler/nvm-windows) for managing your Node.js installation instead)
 	* nodemon: `npm install -g nodemon`
 	* [node-gyp](https://github.com/nodejs/node-gyp#installation)
 * [MongoDB](https://www.mongodb.com/download-center)
 * [Redis (Windows)](https://github.com/MSOpenTech/redis/releases/tag/win-3.2.100) or [Redis (Unix)](https://redis.io/download)

## Getting Started
Once you've installed the required tools:

1. `git clone https://github.com/Musare/MusareNode.git`

2. `cd MusareNode`

3. `cp backend/config/template.json backend/config/default.json`

	Values:  
   	`secret`: Can be anything. It's used by express's session module.  
   	`domain`: Should be the url where the site will be accessible from, usually `http://localhost` locally.  
   	`serverDomain`: Should be the url where the backend will be accessible from, usually `http://localhost:8080` locally.  
   	`serverPort`: Should be the port where the backend will listen on, usually `8080` locally.  
   	`isDocker`: If you are using Docker or not.  
   	`apis.youtube.key`: Can be obtained by setting up a [YouTube API Key](https://developers.google.com/youtube/v3/getting-started).  
   	`apis.recaptcha.secret`: Value can be obtained by setting up a [ReCaptcha Site](https://www.google.com/recaptcha/admin).  
   	`apis.github`: Values can be obtained by setting up a [GitHub OAuth Application](https://github.com/settings/developers).  
   	`apis.discord.token`: The token for the Discord bot.  
   	`apis.discord.loggingServer`: The Discord logging server id.  
   	`apis.discord.loggingChannel`: The Discord logging channel id.  
   	`apis.mailgun`: Values can be obtained by setting up a [Mailgun account](http://www.mailgun.com/).  
   	`redis.url`: Should be `redis://localhost:6379/0` for local use.
   	`redis.password`: Should be the Redis password you put in your `startRedis.cmd` file for Windows.
   	`mongo.url`: Needs to have the proper password for the MongoDB musare user. 
   	`cookie.domain`: Value should be the uri you use to access the site, without protocols (http/https), so for example `localhost`.   
   	`cookie.secure`: Value should be `true` for SSL connections, and `false` for normal http connections.  

4. Setting up GitHub:  
	To set up a GitHub OAuth Application, you need to fill in some value's. The homepage is the homepage of frontend. The authorization callback url is the backend url with `/auth/github/authorize/callback` added at the end. For example `http://localhost:8080/auth/github/authorize/callback`.

	These values should be put in the `apis.github.client`, `apis.github.secret` and `apis.github.redirect_uri`.

5. `cp frontend/build/config/template.json frontend/build/config/default.json`

	Values:  
   	The `serverDomain` should be the url where the backend will be accessible from, usually `http://localhost:8080` for non-Docker.   
   	The `recaptcha.key` value can be obtained by setting up a [ReCaptcha Site](https://www.google.com/recaptcha/admin).  
   	The `cookie.domain` value should be the ip or address you use to access the site, without protocols (http/https), so for example `localhost`.   
   	The `cookie.secure` value should be `true` for SSL connections, and `false` for normal http connections.  

### Setting up locally

1. In the root folder, create a folder called `database`

2. Create a file called `startMongo.cmd` in the root folder with the contents:

		"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath "D:\Programming\HTML\MusareNode\.database"

	Make sure to adjust your paths accordingly.
	
3. Set up the MongoDB database
	
	1. Start the database by executing the script `startMongo.cmd` you just made
		
	2. Connect to Mongo from a command prompt
	
		`mongo admin`
	
	3. Create an admin user
	
		`db.createUser({user: 'admin', pwd: 'PASSWORD_HERE', roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]})`
		
	4. Connect to the Musare database
	
		`use musare`
		
	5. Create the musare user
	
		`db.createUser({user: 'musare', pwd: 'OTHER_PASSWORD_HERE', roles: [{role: 'readWrite', db: 'musare'}]})`
	
	6. Exit
	
		`exit`
	
	7. Add the authentication
	
		In `startMongo.cmd` add ` --auth` at the end of the first line

4. In the folder where you installed Redis, edit the `redis.windows.conf` file. In there, look for the property `notify-keyspace-events`. Make sure that property is uncommented and has the value `Ex`. It should look like `notify-keyspace-events Ex` when done.

5. Create a file called `startRedis.cmd` in the main folder with the contents:

		"D:\Redis\redis-server.exe" "D:\Redis\redis.windows.conf"

	And again, make sure that the paths lead to the proper config and executable.

6. Install nodemon globally

   `npm install nodemon -g`

7. Install webpack globally

   `npm install webpack -g`

8. Install node-gyp globally (first check out https://github.com/nodejs/node-gyp#installation)

   `npm install node-gyp -g`.

9. In both `frontend` and `backend` folders, do `npm install`.

### Starting Servers

**Automatic**

1.  If you are on Windows you can run `windows-start.cmd` and all servers will automatically start up.

**Manual**

1. Run `startRedis.cmd` and `startMongo.cmd` to start Redis and Mongo.

2. In the frontend folder, run `npm run dev`.

3. In the backend folder, run `nodemon`.

## Contact

There are multiple ways to contact us. You can send an email to [core@musare.com](core@musare.com).

You can also message us on [Facebook](https://www.facebook.com/MusareMusic), [Twitter](https://twitter.com/MusareApp) or on our [Discord Guild](https://discord.gg/Y5NxYGP).
