(function () {
  'use strict';

  // Votes controller
  angular
    .module('votes')
    .controller('VotesController', VotesController);

  VotesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'voteResolve'];

  function VotesController ($scope, $state, $window, Authentication, vote) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vote = vote;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.voteNow = voteNow;
    vm.addOption = addOption;
    vm.removeOption = removeOption;
    vm.opt_max = 5;

    // Remove existing Vote
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.vote.$remove($state.go('votes.list'));
      }
    }

    // Save Vote
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.voteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vote._id) {
        vm.vote.$update(successCallback, errorCallback);
      } else {
        vm.vote.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('votes.view', {
          voteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Poll vote
    function voteNow(isValid) {
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.voteForm');
        return false;
      }

      vm.vote.$selected(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('votes.dashboard', {
          voteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //add Vote option
    function addOption(){
      var no = vm.vote.options.length + 1;
      vm.vote.options.push({ text:"Option " + no });
    }

    function removeOption(idx){
      vm.vote.options.splice(idx, 1);
    }
  }
}());
