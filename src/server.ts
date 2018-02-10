import * as dotenv from 'dotenv';
// Config environment before anything on the server starts
dotenv.config(); // It is very important this instructions executes first!
import * as express from 'express';
import {Application, Request, Response, Router} from 'express';
import * as bodyParser from 'body-parser';
import * as _debug from 'debug';
import * as path from 'path';
import * as http from 'http';
import * as cors from 'cors';

import {routes} from './controllers';
import {customConfig} from './config';

const debug = _debug('server');
// Best practices (save this kind of info in a .env file)
const ngDir = process.env.CLIENT_ROOT_DIR;
const defPort = Number(process.env.PORT) || 3000;
const apiUrl = process.env.API_URI;

/**
 * Encapsulates important info about the server
 */
class Server {
  private httpServer: http.Server;
  private app: Application;
  private router: Router;

  /**
   * Performs some default operations you may want once the server has been
   * booted.
   */
  public static init() {

  }

  /**
   * Builds the application creating a http server listening on the
   * specified port.
   * @param port The port where the application is going to listen.
   */
  constructor(private port: number) {
    debug(`Booting server on ${this.port}...`);
    // Creating the app
    this.app = express();
    // Setting statics (Angular app, assets), port, parsers, REST, etc.
    this.config();
    // Starting server
    this.httpServer = http.createServer(this.app);
    // Set server to listen on specified port
    debug('Setting port to %d', this.port);
    this.httpServer.listen(this.port);
    debug('Booted, listening on port %d', this.port);
  }

  /**
   * Configures the app adding port, body parser, static pages...
   */
  private config(): void {
    // Setting port
    this.app.set('port', this.port);
    // Adding a router for the api (REST server)
    this.setRoutes();
    // Point static path to angular dist
    this.app.use(express.static(path.join(__dirname, ngDir)));
    // Angular will handle every other routes
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, ngDir + '/index.html'));
    });
  }

  /**
   * Defines a router for this app. The new router will only handle api
   * connections, leaving the front-end rendering and routing to Angular.
   */
  private setRoutes() {
    debug('Adding routes');
    // Starting router
    this.router = Router();
    // Assigning router to apiUrl route
    this.app.use(apiUrl, this.router);
    // If this is not a production server then activate cors headers
    if (process.env.NODE_ENV !== 'production') {
      debug('Setting CORS headers');
      this.router.use(cors());
    }
    // Setting default header for all routes here
    this.router.use(customConfig);
    debug('Adding body parser');
    // Set router to be able to handle json type and url encoded requests
    this.router.use(bodyParser.json());
    this.router.use(bodyParser.urlencoded({extended: true}));
    // Set for files
    debug('Adding multer');
    this.setPassports();
    // Add each route specified in controllers to this router
    routes.forEach(r => {
      debug('Adding route: %s', r.route);
      // According to method described
      if (r.method === 'POST') {
        this.router.post(r.route, r.callback);
      } else if (r.method === 'GET') {
        this.router.get(r.route, r.callback);
      } else {
        throw new Error('Unsupported HTTP method: ' + r.method);
      }
    });
  }

  /**
   * Defines the passwords to be use on this app.
   */
  private setPassports() {

  }
}

// Starting the server
const server = new Server(defPort);
Server.init();
