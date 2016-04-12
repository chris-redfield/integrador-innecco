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
  /*log.debug('GET ' + vendUrl);
  log.debug('Authorization: ' + authString);*/

  var options = {
    url: vendUrl,
    headers: {
      'Authorization': authString,
      'Accept': 'application/json'
    },
  };

  return vend.sendRequest(options, args, connectionInfo, vend.fetchWebhooks, retryCounter);
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
  var body = {
    'url': args.url
  };

  if (!retryCounter) {
    retryCounter = 0;
  } else {
    console.log('retry # ' + retryCounter);
  }

  var path = '/api/webhooks/' + args.id;
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
  console.log('body:', options.json);

  return vend.sendRequest(options, args, connectionInfo, vend.updateWebhook, retryCounter);
};

vend.deleteWebhook = function(args, connectionInfo, retryCounter) {
  if (!retryCounter) {
    retryCounter = 0;
  } else {
    console.log('retry # ' + retryCounter);
  }

  var path = '/api/webhooks/' + args.apiId;
  var vendUrl = 'https://' + connectionInfo.domainPrefix + '.vendhq.com' + path;
  var authString = 'Bearer ' + connectionInfo.accessToken;

  var options = {
    method: 'DELETE',
    url: vendUrl,
    headers: {
      'Authorization': authString,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  return vend.sendRequest(options, args, connectionInfo, vend.deleteWebhook, retryCounter);
};

module.exports = vend;
