"use strict";

/**
 * This policy aims to be a a proxy between content-manager requests,
 * and at the same time trigger for all the policy (global and scoped) define in each
 * route.json for the api.
 *
 * Add this policy as global and modify content manager routes
 * `../plugins/content-manager/config/routes.json` like this:
 * {
 *  {
 *    "method": "GET",
 *    "path": "/explorer/:model",
 *    "handler": "ContentManager.find",
 *    "config": {
 *        "policies": ["global.proxy","routing"]
 *    }
 *  },
 *  ...
 * }
 */
module.exports = async (ctx, next) => {
  let path = ctx.url.replace("/content-manager/explorer", "").split("?")[0];
  //current http method.
  const method = ctx.method;

  //get the current route paht
  let uri = "/" + ctx.params.model;
  uri += ctx.params.id ? "s/:id" : "s";
  uri += path.indexOf("/count") >= 0 ? "/count" : "";
  let policies = [];

  //find current route
  let current = strapi.config.routes.find(route => {
    return route.method === method && route.path === uri;
  });

  // get custom policies
  if (current && current.config && current.config.policies) {
    current.config.policies.map(p => {
      if (p !== "plugins.users-permissions.permissions") {
        policies.push(p);
      }
    });
  }

  // Solve the issue "next function is calle so many times".
  let promises = [];
  let waiths = [];
  //call all custom policy of the route.
  policies.map(policy => {
    let p = new Promise((resolve, reject) => {
      promises.push(resolve);
    });

    let _resolve;
    waiths.push(
      new Promise((resolve, reject) => {
        _resolve = resolve;
      })
    );

    strapi.api[ctx.params.model].config.policies[policy.toLowerCase()](
      ctx,
      async () => {
        _resolve();
        return p;
      }
    );
  });
  // await for next is done
  await Promise.all(waiths);
  await next();
  // resolve the dumy promise
  promises.map(p => {
    p();
  });
};
