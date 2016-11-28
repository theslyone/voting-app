// Polls service used to communicate Polls REST endpoints
(function () {
  'use strict';

  angular
    .module('polls')
    .factory('PollsService', PollsService);

  PollsService.$inject = ['$resource'];

  function PollsService($resource) {
    var resource = $resource('api/polls/:pollId',
      { pollId: '@_id' },
      { update: { method: 'PUT' } }
    );
    
    return resource;
  }
}());
