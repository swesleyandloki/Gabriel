define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');

    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.register('spring', SnapTransition);

    var CardView = require('views/CardView');
  
    var StripData = require('data/StripData');

    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');

    function AppView() {
        View.apply(this, arguments);
        this.menuToggle = false;
        this.pageViewPos = 0;

        this.cardViewPos = new Transitionable([0, 0]);
        _createPageView.call(this);
        _createMenuView.call(this);
        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 500,
            curve: Easing.inOutBack
        }
    };

    AppView.prototype.toggleMenu = function() {
        if(this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateStrips();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppView.prototype.slideRight = function() {
        this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

     AppView.prototype.slideLeft = function() {
        this.pageModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    function _createPageView() {
        this.pageView = new PageView();
        this.pageModifier = new StateModifier();

        this.add(this.pageModifier).add(this.pageView);
    }

    function _createMenuView() {
        this.menuView = new MenuView({ stripData: StripData });
        var menuModifier = new StateModifier({
            transform: Transform.behind
        });

        this.add(menuModifier).add(this.menuView);
    }

    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleMenu.bind(this));
    }

    module.exports = AppView;
});
