describe("Angular ATM", function() {

  var $rootScope, $controller, $httpBackend;

  beforeEach(module("ATM"));

    beforeEach(inject(function($injector) {
      // Set up access to Angular $rootScope.
      $rootScope = $injector.get("$rootScope");
      // Set up the mock http service responses.
      $httpBackend = $injector.get("$httpBackend");
      // The $controller service is used to create instances of controllers.
      $controller = $injector.get("$controller");
      var createController = function() {
        return $controller("transact", {"$scope" : $rootScope });
      };
      var controller = createController();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should have an empty default balance", function() {
      // Karma-spec-reporter isn't reliably reporting "it" statements, so logging manually.
      console.log("It should have an empty default account balance.");
      expect($rootScope.auth.balance).to.equal("");
    });

    it("should verify that a person's PIN is matched in the database", function() {
      console.log("It should verify that a person's PIN is matched in the database.");
      var scope = { auth: { pin: 4444, verified: false, balance: "" } };
      $controller("submitPin", {"$scope": scope });
      // Response here must be in the same format as returned from the server.
      var res = { data: { balance: 90000 } };
      $httpBackend.expectGET("/api/balance?pin=4444").respond(res.data);
      scope.verifyPin();
      $httpBackend.flush();
      scope.auth.verified.should.equal(true);
      scope.auth.balance.should.equal(90000);
    });

    it("should alert that a PIN doesn't exist when not matched in the database", function() {
      console.log("It should alert that a PIN doesn't exist when not matched in the database.");
      var scope = { auth: { pin: 1234, verified: false, balance: "" } };
      $controller("submitPin", {"$scope" : scope });
      $httpBackend.expectGET("/api/balance?pin=1234").respond(404, "");
      // Spy on the function we're interested in to ensure callback.
      var alertSpy = sinon.spy(window, "alert");
      scope.verifyPin();
      $httpBackend.flush();
      scope.auth.verified.should.equal(false);
      expect(window.alert).to.be.called;
      alertSpy.restore();
    });

    it("should not update balance when insufficient funds to withdraw", function() {
      console.log("It should not update balance when insufficient funds to withdraw.");
      $rootScope.auth.balance = 75000;
      $rootScope.transact(-75001);
      expect($rootScope.auth.balance).to.equal(75000);
    });

    it("should call $scope.transact from the submitDeposit & submitWithdrawal controllers", function() {
      console.log("It should call $scope.transact from the submitDeposit & submitWithdrawal controllers.");
      var scope = { auth: { amount: 500 } };
      // Mimic child scope's inheritance of parent scope's properties.
      scope.transact = $rootScope.transact;
      // Spy on the function we're interested in to ensure callback.
      var transactSpy = sinon.spy(scope, "transact");
      $controller("submitDeposit", {"$scope" : scope });
      $httpBackend.expectPOST("/api/transact?pin=").respond("");
      scope.deposit();
      $httpBackend.flush();
      // Rinse and repeat for submitWithdrawal...
      $controller("submitWithdrawal", {"$scope" : scope });
      $httpBackend.expectPOST("/api/transact?pin=").respond("");
      scope.withdraw();
      $httpBackend.flush();
      expect(scope.transact).to.be.calledTwice;
      transactSpy.restore();
    });

    it("should not update the balance in the event of a server error", function() {
      console.log("It should not update the balance in the event of a server error");
      $rootScope.auth = { balance: "80000", pin: 1111, amount: 5000 };
      $httpBackend.when("POST", "/api/transact?pin=1111", {transaction: 85000}).respond(500);
      // Spy on the function we're interested in to ensure callback.
      var alertSpy = sinon.spy(window, "alert");
      $rootScope.transact($rootScope.auth.amount);
      $httpBackend.flush();
      $rootScope.auth.balance.should.equal("80000");
      expect(window.alert).to.be.called;
      alertSpy.restore();
    });

    it("should update the balance when valid deposit or withdrawal is performed", function() {
      console.log("It should update the balance upon valid deposit or withdrawal.");
      $rootScope.auth = { balance: "80000", pin: 1111, amount: 5000 };
      $httpBackend.when("POST", "/api/transact?pin=1111", {transaction: 85000}).respond(200, "");
      $rootScope.transact($rootScope.auth.amount);
      $httpBackend.flush();
      $rootScope.auth.balance.should.equal(85000);
    });

});
