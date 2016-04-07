var vend = require('vend-nodejs-sdk')({});

vend.fetchWebhooks = function(args, connectionInfo, retryCounter) {
  if (!retryCounter) {
    retryCounter = 0;
  } else {
    console.log('retry # ' + retryCounter);
  }

  var path = '/api/webhooks';
  var vendUrl = 'https://' + connectionInfo.domainPrefix + '.vendhq.com' + path;
  console.log('Requesting vend product ' + vendUrl);
  var authString = 'Bearer ' + connectionInfo.accessToken;
  log.debug('GET ' + vendUrl);
  log.debug('Authorization: ' + authString); // TODO: sensitive data ... do not log?

  var options = {
    url: vendUrl,
    headers: {
      'Authorization': authString,
      'Accept': 'application/json'
    },
  };

  return vend.sendRequest(options, args, connectionInfo, fetchWebhooks, retryCounter);
};

vend.createWebhook = function(args, connectionInfo, retryCounter) {
  console.log('inside createWebhook()');

  var body = null;
  if (args && args.body) {
    body = args.body;
  }
  else {
    if ( !(args)) {
      return Promise.reject('missing required arguments for createConsignmentProduct()');
    }
    body = {
      'type': args.type,
      'url': args.url
    };
  }

  body = {
    'type': args.type,
    'url': args.url,
    'active': 'true'
  };


  if (!retryCounter) {
    retryCounter = 0;
  } else {
    console.log('retry # ' + retryCounter);
  }

  var path = '/api/webhooks';
  var vendUrl = 'https://' + connectionInfo.domainPrefix + '.vendhq.com' + path;
  var authString = 'Bearer ' + connectionInfo.accessToken;
  console.log('Authorization: ' + authString); // TODO: sensitive data ... do not log?

  var options = {
    method: 'POST',
    url: vendUrl,
    headers: {
      'Authorization': authString,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    form: 'data='+JSON.stringify(body),
  };
  console.log(options.method + ' ' + options.url);
  console.log(options.json);

  return vend.sendRequest(options, args, connectionInfo, vend.createWebhook, retryCounter);
};

vend.updateWebhook = function(args, connectionInfo, retryCounter) {
  console.log('inside updateConsignmentProduct()', args);

  if ( !(args && vend.argsAreValid(args)) ) {
    return Promise.reject('missing required arguments for updateConsignmentProduct()');
  }

  var body = {
    'type': args.type,
    'url': args.url
  };

  if (!retryCounter) {
    retryCounter = 0;
  } else {
    console.log('retry # ' + retryCounter);
  }

  var path = '/api/webhooks/' + args.apiId.value;
  var vendUrl = 'https://' + connectionInfo.domainPrefix + '.vendhq.com' + path;
  var authString = 'Bearer ' + connectionInfo.accessToken;
  console.log('Authorization: ' + authString); // TODO: sensitive data ... do not log?

  var options = {
    method: 'PUT',
    url: vendUrl,
    headers: {
      'Authorization': authString,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    json: body
  };
  console.log(options.method, options.url);
  console.log('body:', options.json);

  return vend.sendRequest(options, args, connectionInfo, vend.updateWebhook, retryCounter);
};

module.exports = vend;
console.log
