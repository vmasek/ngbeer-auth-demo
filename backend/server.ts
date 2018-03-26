// tslint:disable:no-any

import { readFile } from 'fs';
import { OK, UNAUTHORIZED } from 'http-status-codes';
import * as bodyParser from 'body-parser';
import * as jsonServer from 'json-server';
import { verify, sign, JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { promisify } from 'util';

const SERVER_PORT = 3000;
const SECRET_KEY = '123456789';
const TOKEN_TTL = '1m';

interface User {
  email: string;
  password: string;
}

async function readUsers(): Promise<User[]> {
  return JSON.parse((await promisify(readFile)(`${__dirname}/users.json`)).toString());
}

// Create a token from a payload
function createToken(payload: string | Buffer | object): string {
  return sign(payload, SECRET_KEY, {expiresIn: TOKEN_TTL});
}

// Verify the token
async function verifyToken(token: string): Promise<JsonWebTokenError | NotBeforeError | TokenExpiredError> {
  return await promisify(verify)(token, SECRET_KEY);
}

// Check if the user exists in database
async function isAuthenticated(email: string, password: string): Promise<boolean> {
  const users = await readUsers();
  return users.some((user: User) => user.email === email && user.password === password);
}

async function startServer(): Promise<void> {
  const server = jsonServer.create();
  const router = jsonServer.router(`${__dirname}/mock-db.json`);

  server.use(jsonServer.defaults());
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(bodyParser.json());

  server.post('/auth/login', async (req: any, res: any) => {
    const {email, password} = req.body;

    if (await isAuthenticated(email, password) === false) {
      const status = UNAUTHORIZED;
      const message = 'Incorrect email or password';
      res.status(status).json({status, message});
      return;
    }

    const accessToken = createToken({email, password});
    res.status(OK).json({accessToken});
  });

  server.use(/^(?!\/auth).*$/, async (req: any, res: any, next: any) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = UNAUTHORIZED;
      const message = 'Error in authorization format';
      res.status(status).json({status, message});
      return;
    }


    verifyToken(req.headers.authorization.split(' ')[1])
      .then((oke) => next())
      .catch(() => {
        const status = UNAUTHORIZED;
        const message = 'Error access token is revoked';
        res.status(status).json({status, message});
      });
  });

  server.use(router);

  server.listen(SERVER_PORT, () => {
    console.info(`Running auth API server on http://localhost:${SERVER_PORT}`);
  });
}

startServer().then(() => console.info('Server has been started'));
