
import $ from 'jquery';
import app from '../app';

app.controller('packagesController', function ($http, $uibModal, toastr) {
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
});

app.controller('ModalAddPackageItemInstanceCtrl', function ($scope, $http, $uibModalInstance, toastr, packageId) {
    
    $scope.packageItem = {
        packageId: packageId,
        name: '',
        description:''
    };

    $scope.ok = function () {
        $http.post('api/administrator/packages/item', $scope.packageItem)
            .then(function (resp) {
                toastr.success('Package Item saved');
                $uibModalInstance.close($scope.package);

            }, function (err) {
                toastr.error('Error occured');
            });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalAddPackageItemImageInstanceCtrl', function ($scope, $http, $uibModalInstance, toastr, packageItem) {
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
            //debugger;
            toastr.success('Image has been uploaded.', 'Image Uploaded');

            //message.innerHTML = "<b>" + data + "</b> has been uploaded.";
            //fileProgress.style.display = "none";
            $scope.isDone = true;
            //$uibModalInstance.close($scope.package);
        }, function (data, status) {
            //debugger;
            toastr.error(data.Message);
        });

        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.close = function () {
        $uibModalInstance.close();
    };
});