'use strict';

/* jasmine specs for controllers go here */


describe('controller admin parts ->', function() {
    var scope, vm, $httpBackend, createController;
    
    beforeEach(module('app'));
    beforeEach(inject(function($rootScope, $controller, $injector) {
        
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/api/getStageConfig').
            respond({"responseData": [
            {
              "n": {
                "id": "14",
                "data": {
                  "name": "StageConfig",
                  "stageArray": "[{\"name\":\"Floor Plan Options\",\"order\":1,\"cardinality\":\"M\",\"description\":\"3\"},{\"name\":\"Community\",\"order\":2,\"cardinality\":\"O\",\"description\":\"1\"},{\"name\":\"Floor Plan\",\"order\":3,\"cardinality\":\"O\",\"description\":\"2\"}]"
                }
              }
            }
          ]});

        $httpBackend.when('GET', '/api/getAllPartsAndPackages/XXALLXX').
            respond({
                "responseData": [
                    {
                        "n": {
                            "id": "15",
                            "data": {
                                "stageName": "Community",
                                "description": " This is a nail.",
                                "name": "Nail",
                                "label": "Part",
                                "basePrice": 100
                            }
                        }
                    },
                    {
                        "n": {
                            "id": "16",
                            "data": {
                                "stageName": "Floor Plan",
                                "description": " This is a hammer.",
                                "name": "some new change here",
                                "label": "Part",
                                "basePrice": 100
                            }
                        }
                    },
                    {
                        "n": {
                            "id": "17",
                            "data": {
                                "stageName": "Floor Plan",
                                "description": " This is a sack hammer.",
                                "name": "sack o hammers",
                                "label": "Package",
                                "basePrice": 100
                            }
                        }
                    },
                    {
                        "n": {
                            "id": "22",
                            "data": {
                                "stageName": "Floor Plan Options",
                                "description": "screws",
                                "name": "Screws",
                                "label": "Part",
                                "basePrice": "1000"
                            }
                        }
                    },
                    {
                        "n": {
                            "id": "25",
                            "data": {
                                "stageName": "Floor Plan",
                                "description": "ugukygjkg",
                                "name": "jkhkljhlkjh",
                                "label": "Package",
                                "partId": [
                                    "17",
                                    "22"
                                ],
                                "basePrice": "87687"
                            }
                        }
                    }
                ]
            });
        $httpBackend.when('GET', 'app/dashboard/dashboard.html').
            respond({});
        $httpBackend.when('POST', '/api/createConfig').
            respond({responseData: []});

        scope = $rootScope.$new(); 
        createController = function() {
            return $controller('parts', { $scope: scope });
        };
       
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // tests for stage controller

    it('should activate parts controller and read parts and packages', function() {
        expect(true).toBe(true);
        $httpBackend.expectGET('app/dashboard/dashboard.html');
        $httpBackend.flush();

        vm = createController();
        $httpBackend.flush();
        
        expect(vm.title).toBe('Parts Management');
        expect(vm.stages.length).toBe(3);
        expect(vm.gridData.length).toBe(5);

    });
    
    it('should add new part when addPart is called', function() {
        vm.name = 'new stage';
        vm.cardinality = 'M';
        vm.description = 'new description';
        vm.addStage();
        //debugger;
        $httpBackend.flush();
        expect(vm.stages.length).toBe(4);
    });

    /*
    it('should not add new stage when name or cardinality is null', function() {
        vm.name = '';
        vm.cardinality = '';
        vm.description = 'new description';
        vm.addStage();
        //debugger;
        $httpBackend.flush();
        expect(vm.stages.length).toBe(4);
    });


    it('should select appropriate element when edit is clicked', function() {
        vm.editStage(2);
        $httpBackend.flush();
        expect(vm.name).toBe('Floor Plan');
        expect(vm.cardinality).toBe('O');
        expect(vm.selectedIndex).toBe(2);
    });

    it('should update the element identified by selectedIndex when updateStage is clicked', function() {
        vm.cardinality = 'M';
        vm.updateStage();
        $httpBackend.flush();
    });

    //it('should not update the element name or cardinality is null', function() {
    //    vm.cardinality = '';
    //    vm.name = '';
    //    vm.updateStage();
    //    $httpBackend.flush();
    //});

    it('should remove identified element when removeStage is clicked', function() {
        vm.removeStage(3);
        $httpBackend.flush();
        expect(vm.stages.length).toBe(3);
    });


    it('should send request to api to save changes', function() {
   //TODO: not sure how to write this... may need refactoring in the controller to enable testing
        $httpBackend.whenPOST('/api/createConfig').respond(201,''); 
        vm.saveStages();
        $httpBackend.flush();

         
    });
    */
});