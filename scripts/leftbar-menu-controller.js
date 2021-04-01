//Controller for column show/hide
msfReportsApp.controller('LeftBarMenuController',
        function($scope,
                $location) {
            
            $scope.showTodaySchedule = function(){
                $location.path('/tracker-report').search();
            };
            $scope.showEventReport = function(){
                $location.path('/event-report').search();
            };
            $scope.showPerformanceIndicator = function(){
                $location.path('/performance-report').search();
            };
            $scope.showDecisionTracker = function(){
                $location.path('/decision-tracker-report').search();
            };
            $scope.active = function () {
                
            }

        });