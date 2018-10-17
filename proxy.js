"use strict";

/**
 * This policy aims to be a a proxy between content-manager requests, 
 * and a trigger for all the policy (global and scoped) define in each 
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
  let _resolved = null;
  let promise = new Promise((resolve, reject) => {
    _resolved = resolve;
  });

  //call all custom policy of the route.
  policies.map(async policy => {
    strapi.api[ctx.params.model].config.policies[policy.toLowerCase()](
      ctx,
      async function() {
        //return the dumy promise witch is resolve later.
        return promise;
      }
    );
  });
  // await for next is done
  await next();
  // resolve the dumy promise
  _resolved();
};
