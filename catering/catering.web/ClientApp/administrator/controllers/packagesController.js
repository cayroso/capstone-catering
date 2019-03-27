
import $ from 'jquery';
import app from '../app';

function controller1($http, $uibModal, toastr) {
    const vm = this;

    vm.selectedItem = null;

    vm.setSelectedItem = function (item) {
        if (item === vm.selectedItem) {
            vm.selectedItem = null;
            return;
        }

        vm.selectedItem = item;
    };

    vm.dlgOpenAddPackageItem = function (pkg) {
        //debugger;
        var modalInst = $uibModal.open({
            animation: true,
            templateUrl: 'modalAddPackageItem.html',
            controller: 'ModalAddPackageItemInstanceCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                packageId: function () {
                    return pkg.packageId;
                }
            }
        });

        modalInst.result.then(function (resp) {
            vm.init();
        });
    };

    vm.dlgOpenEditPackageItem = function (pkg) {
        //debugger;
        var modalInst = $uibModal.open({
            animation: true,
            templateUrl: 'modalEditPackageItem.html',
            controller: 'ModalEditPackageItemInstanceCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                pkg: function () {
                    return pkg;
                }
            }
        });

        modalInst.result.then(function (resp) {
            vm.init();
        });
    };

    vm.dlgOpenAddPackageItemImage = function (packageItem) {
        //debugger;
        var modalInst = $uibModal.open({
            animation: true,
            templateUrl: 'modalAddPackageItemImage.html',
            controller: 'ModalAddPackageItemImageInstanceCtrl',
            size: 'lg',
            resolve: {
                packageItem: function () {
                    return packageItem;
                }
            }
        });

        modalInst.result.then(function (resp) {
            vm.init();
        });
    };

    vm.removePackageItem = function (packageItem) {
        $http.post(`api/administrator/packages/item/${packageItem.packageImageId}/remove`)
            .then(function (resp) {
                vm.init();
                toastr.success('Package Item removed');
            }, function (err) {
                toastr.error('error occured');
            });
    };

    vm.init = function () {
        $http.get('api/administrator/packages')
            .then(function (resp) {
                vm.items = resp.data;
            }, function (err) {
                toastr.error('Error occured');
            });
    };

    vm.init();
}

controller1.$inject = ['$http', '$uibModal', 'toastr'];

app.controller('packagesController', controller1);


function controller2($scope, $http, $uibModalInstance, toastr, packageId) {

    $scope.packageItem = {
        packageId: packageId,
        name: '',
        description: ''
    };

    $scope.ok = function () {
        $http.post('api/administrator/packages/itemAdd', $scope.packageItem)
            .then(function (resp) {
                toastr.success('Package Item saved', 'Add Item', {
                    //tapToDismiss: true,
                    timeOut: 0,
                    onHidden: function () {
                        $uibModalInstance.close($scope.package);
                    }
                });

            }, function (err) {
                toastr.error('Error occured');
            });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

controller2.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'packageId'];

app.controller('ModalAddPackageItemInstanceCtrl', controller2);


function controller2a($scope, $http, $uibModalInstance, toastr, pkg) {

    $scope.packageItem = angular.copy(pkg);

    $scope.ok = function () {
        $http.post('api/administrator/packages/itemEdit', $scope.packageItem)
            .then(function (resp) {
                toastr.success('Package Item Updated', 'Edit', {
                    timeOut: 0,
                    onHidden: function () {
                        $uibModalInstance.close($scope.package);
                    }
                });                
            }, function (err) {
                toastr.error('Error occured');
            });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

controller2a.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'pkg'];

app.controller('ModalEditPackageItemInstanceCtrl', controller2a);


function controller3($scope, $http, $uibModalInstance, toastr, packageItem) {
    $scope.isDone = false;
    $scope.packageItem = packageItem;

    $scope.ok = function () {
        var fileProgress = $("#fileProgress")[0];
        var message = angular.element(document).find("#lblMessage");

        fileProgress.style.display = "block";
        var formData = new FormData();
        formData.append('file', document.getElementById("file").files[0]);
        //debugger
        var post = $http({
            method: "POST",
            url: `api/administrator/packages/item/${$scope.packageItem.packageImageId}/image`,
            data: formData,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },
            uploadEventHandlers: {
                progress: function (e) {
                    if (e.lengthComputable) {
                        fileProgress.setAttribute("value", e.loaded);
                        fileProgress.setAttribute("max", e.total);
                    }
                }
            }
        });

        post.then(function (data, status) {
            $scope.isDone = true;
            //debugger;
            toastr.success('Image has been uploaded.', 'Image Uploaded', {
                timeOut: 0,
                onHidden: function () {
                    $uibModalInstance.close();
                }
            });           
        }, function (data, status) {
            //debugger;
            toastr.error(data.Message, 'Error', { timeOut: 0 });
        });


    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.close = function () {
        $uibModalInstance.close();
    };
}

controller3.$inject = ['$scope', '$http', '$uibModalInstance', 'toastr', 'packageItem'];

app.controller('ModalAddPackageItemImageInstanceCtrl', controller3);