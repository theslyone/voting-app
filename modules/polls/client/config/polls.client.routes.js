(function () {
  'use strict';

  angular
    .module('polls')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('polls', {
        abstract: true,
        url: '/polls',
        template: '<ui-view/>'
      })
      .state('polls.list', {
        url: '',
        templateUrl: 'modules/polls/client/views/list-polls.client.view.html',
        controller: 'PollsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Polls List'
        }
      })
      .state('polls.create', {
        url: '/create',
        templateUrl: 'modules/polls/client/views/form-poll.client.view.html',
        controller: 'PollsController',
        controllerAs: 'vm',
        resolve: {
          pollResolve: newPoll
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Polls Create'
        }
      })
      .state('polls.edit', {
        url: '/:pollId/edit',
        templateUrl: 'modules/polls/client/views/form-poll.client.view.html',
        controller: 'PollsController',
        controllerAs: 'vm',
        resolve: {
          pollResolve: getPoll
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Poll {{ pollResolve.name }}'
        }
      })
      .state('polls.view', {
        url: '/:pollId',
        templateUrl: 'modules/polls/client/views/view-poll.client.view.html',
        controller: 'PollsController',
        controllerAs: 'vm',
        resolve: {
          pollResolve: getPoll
        },
        data: {
          pageTitle: 'Poll {{ pollResolve.name }}'
        }
      })
      .state('polls.dashboard', {
        url: '/:pollId',
        templateUrl: 'modules/polls/client/views/dashboard-poll.client.view.html',
        controller: 'PollsController',
        controllerAs: 'vm',
        resolve: {
          pollResolve: getPoll
        },
        data: {
          pageTitle: 'Poll Chart for {{ pollResolve.name }}'
        }
      });
  }

  getPoll.$inject = ['$stateParams', 'PollsService'];

  function getPoll($stateParams, PollsService) {
    return PollsService.get({
      pollId: $stateParams.pollId
    }).$promise;
  }

  newPoll.$inject = ['PollsService'];

  function newPoll(PollsService) {
    var poll = new PollsService();
    poll.options = [];
    poll.options.push({ text:"" });
    poll.options.push({ text:"" });
    return poll;
  }
}());
