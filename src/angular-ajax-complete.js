angular.module('ajaxLoadNotifier', [])
  .config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($q, $rootScope) {
      var responseCallback, requestCallback, lastResponse = new Date().getTime(),
      lastRequest = new Date().getTime(), checkLastResponse, pendingRequestCount = 0,
      requestsComplete = false, timerKey;

      checkLastResponse = angular.bind(this, function () {
        var now = new Date().getTime();
        if (now - lastResponse > 500 && now - lastRequest > 500 && pendingRequestCount === 0) {
          if (!requestsComplete) {
            requestsComplete = true;
            clearInterval(timerKey);
            $rootScope.$emit('ajaxComplete');
          };
        }
      });

      timerKey = setInterval(checkLastResponse, 0);

      requestCallback = angular.bind(this, function (request) {
        lastRequest = new Date().getTime();
        pendingRequestCount++;
        return request;
      });

      responseCallback = angular.bind(this, function (response) {
        lastResponse = new Date().getTime();
        pendingRequestCount--;
        return response;
      });

      return {
        'request': requestCallback,
        'response': responseCallback,
        'responseError': responseCallback
      };
    })
  });