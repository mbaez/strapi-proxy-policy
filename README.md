# strapi-proxy-policy
This policy aims to be a a proxy between content-manager requests, and at the same time trigger for all the policy (global and scoped) define in each route.json for the api.

## Usage
Add this policy as global

```shell
$ cp strapi-proxy-policy.js ${strapi-project}/config/policies/proxy.js
```

Modify content manager routes `../plugins/content-manager/config/routes.json` like this:
 ```json
{
  "routes": [
    {
      "method": "GET",
      "path": "/models",
      "handler": "ContentManager.models",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/explorer/:model",
      "handler": "ContentManager.find",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "GET",
      "path": "/explorer/:model/count",
      "handler": "ContentManager.count",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "PUT",
      "path": "/models",
      "handler": "ContentManager.updateSettings",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "GET",
      "path": "/explorer/:model/:id",
      "handler": "ContentManager.findOne",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },{
      "method": "POST",
      "path": "/explorer/:model",
      "handler": "ContentManager.create",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "PUT",
      "path": "/explorer/:model/:id",
      "handler": "ContentManager.update",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "DELETE",
      "path": "/explorer/deleteAll/:model",
      "handler": "ContentManager.deleteAll",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    },
    {
      "method": "DELETE",
      "path": "/explorer/:model/:id",
      "handler": "ContentManager.delete",
      "config": {
        "policies": ["global.proxy","routing"]
      }
    }
  ]
}
```
## Want to contribute?

If you've found a bug or have a great idea for new feature let me know by [adding your suggestion](https://github.com/mbaez/strapi-proxy-policy/issues/new) to [issues list](https://github.com/mbaez/strapi-proxy-policy/issues).
