export default class ContactFormController {
    constructor($mdDialog, $scope, $rootScope) {
        this.$mdDialog = $mdDialog;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.$rootScope.$on('$locationChangeStart', ($event) => {
            if (angular.element(document).find('md-dialog').length > 0) {
                $event.preventDefault();
                this.$mdDialog.cancel();
            }
        });
    }

    success() {
        const name = this.$scope.name;
        const mail = this.$scope.mail;
        const subject = this.$scope.subject;
        const text = this.$scope.text;

        this.$mdDialog.hide({
            name,
            mail,
            subject,
            text
        });
    };

    cancel() {
        this.$mdDialog.cancel();
    };
}

ContactFormController.$inject = ['$mdDialog', '$scope', '$rootScope'];