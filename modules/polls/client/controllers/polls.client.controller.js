(function () {
  'use strict';

  // Polls controller
  angular
    .module('polls')
    .controller('PollsController', PollsController);

  PollsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pollResolve', '_'];

  function PollsController ($scope, $state, $window, Authentication, poll, _) {
    var vm = this;

    vm.authentication = Authentication;
    vm.poll = poll;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.vote = vote;
    vm.addOption = addOption;
    vm.removeOption = removeOption;
    vm.opt_max = 5;

    vm.chartLabels = vm.poll.options.map(function(a){ return a.text; });

    var counts = _.countBy(vm.poll.votes,'option');
    //console.log("votes: " + JSON.stringify(counts, 0, 4));
    vm.chartData = [];

    vm.poll.options.forEach(function(option){
      vm.chartData.push(counts[option._id]);
    });

    // Remove existing Poll
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.poll.$remove($state.go('polls.list'));
      }
    }

    // Save Poll
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pollForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.poll._id) {
        vm.poll.$update(successCallback, errorCallback);
      } else {
        vm.poll.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('polls.view', {
          pollId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Poll vote
    function vote(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pollForm');
        return false;
      }
      vm.poll.$update(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('polls.dashboard', {
          pollId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //add Poll option
    function addOption(){
      var no = vm.poll.options.length + 1;
      vm.poll.options.push({ text:"" });
    }

    function removeOption(idx){
      vm.poll.options.splice(idx, 1);
    }
  }
}());
