(function () {
  'use strict';

  angular
    .module('votes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('votes', {
        abstract: true,
        url: '/votes',
        template: '<ui-view/>'
      })
      .state('votes.list', {
        url: '',
        templateUrl: 'modules/votes/client/views/list-votes.client.view.html',
        controller: 'VotesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Polls List'
        }
      })
      .state('votes.create', {
        url: '/create',
        templateUrl: 'modules/votes/client/views/form-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: newVote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Polls Create'
        }
      })
      .state('votes.edit', {
        url: '/:voteId/edit',
        templateUrl: 'modules/votes/client/views/form-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: getVote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Poll {{ voteResolve.name }}'
        }
      })
      .state('votes.view', {
        url: '/:voteId',
        templateUrl: 'modules/votes/client/views/view-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: getVote
        },
        data: {
          pageTitle: 'Poll {{ voteResolve.name }}'
        }
      })
      .state('votes.dashboard', {
        url: '/:voteId',
        templateUrl: 'modules/votes/client/views/dashboard-vote.client.view.html',
        controller: 'VotesController',
        controllerAs: 'vm',
        resolve: {
          voteResolve: getVote
        },
        data: {
          pageTitle: 'Poll Chart for {{ voteResolve.name }}'
        }
      });
  }

  getVote.$inject = ['$stateParams', 'VotesService'];

  function getVote($stateParams, VotesService) {
    return VotesService.get({
      voteId: $stateParams.voteId
    }).$promise;
  }

  newVote.$inject = ['VotesService'];

  function newVote(VotesService) {
    var vote = new VotesService();
    vote.options = [];
    vote.options.push({ text:"Option 1" });
    vote.options.push({ text:"Option 2" });
    //console.log("new vote" + JSON.stringify(vote, null, 4));

    return vote;
  }
}());
