import { RequestHandler, NextFunction } from "express";

function wrapAsync(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(e => {
      next(e);
    });
  };
}

export default wrapAsync;
