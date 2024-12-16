import Express from 'express';
import Next from 'next';
import Cluster from 'cluster';
import {ACExpressRouterDRequest} from 'ac-express-routerd';
import path from 'path';
import {parse as urlParse} from 'url';

const IsDev = process.env.NODE_ENV !== 'production';
const Port = process.env.PORT || 3000;
const NumWorkers = process.env.NUM_WORKERS || 4;

const ServicesThatSetCookies = [
  "back",
];

function wrapHandler(handler, callNext) {
  if (callNext === undefined) {
    callNext = true;
  }

  return function(req, res, next) {
    const t0 = new Date().getTime();
    const finish = (flag) => {
      const elapsed = (new Date().getTime() - t0) / 1000;

      console.log([
        elapsed,
        flag,
        req.url,

      ].join('\t'));

      req.delete(); // IMPORTANT: frees memory

      if (callNext) {
        next();
      }
    };

    const cookies = [];

    for (let service of ServicesThatSetCookies) {
      const serviceResponse = req.getServiceResponse(service);

      if (serviceResponse) {
        for (let cookie of serviceResponse.getAll('Set-Cookie')) {
          cookies.push(cookie);
        }
      }
    }

    if (cookies.length > 0) {
      res.append('Set-Cookie', cookies);
    }

    return handler(req, res, finish);
  };
}

function start() {
  const expressApp = Express();
  const nextApp = Next({ dev: IsDev });
  const nextHandler = nextApp.getRequestHandler();

  expressApp.disable('x-powered-by');
  expressApp.disable('etag');

  expressApp.use('*', function(req, res, next) {
    ACExpressRouterDRequest(req).then(next).catch(function() {
      console.log('Failed to parse request for ' + req.url);
      res.sendStatus(500);
    });
  });

  expressApp.all('*', wrapHandler(function(req, res, finish) {
    nextHandler(req, res, urlParse(req.url, true))
      .then(() => finish('ok'))
      .catch(() => finish('bad'))
    ;
  }));

  nextApp.prepare().then(() => {
    expressApp.listen(Port, (err) => {
      if (err) {
        return console.error(err);
      }

      console.info(`Server running on port ${Port} -- Worker pid: ${process.pid}`);
    });
  });
}

if (Cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < NumWorkers; ++i) {
    Cluster.fork();
  }

  Cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    Cluster.fork();
  });

} else {
  start();
}
