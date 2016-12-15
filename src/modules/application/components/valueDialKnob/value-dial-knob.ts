export default class ValueDialKnob {
    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    private dialEl: JQuery;

    constructor(private $timeout) {
        // It's important to add `link` to the prototype or you will end up with state issues.
        // See http://blog.aaronholmes.net/writing-angularjs-directives-as-typescript-classes/#comment-2111298002 for more information.
        ValueDialKnob.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            console.log(scope, element);
        };
    }

    public static Factory() {
        var directive = ($timeout) => {
            return new ValueDialKnob($timeout);
        };

        directive['$inject'] = ['$timeout'];

        return directive;
    }

    private drawKnob() {

    }
}