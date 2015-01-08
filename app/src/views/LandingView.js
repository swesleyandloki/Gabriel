define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Utility = require('famous/utilities/Utility');


    function LandingView() {
        View.apply(this, arguments);
        this.angel = {};

        _createBackground.call(this);
        _createLoginButton.call(this);
        _createRedirectButton.call(this);
        _createName.call(this);
        // _createWings.call(this);

        _setListeners.call(this);
        //console.log('INSIDE CONSTRUCTOR',this.options);
    }

    LandingView.prototype = Object.create(View.prototype);
    LandingView.prototype.constructor = LandingView;

    LandingView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        angel: {},
        initialData: {}
    };


    function _createBackground() {
        this.backgroundSurface = new ImageSurface({
            properties: {
              backgroundColor: '#BBDEFB'
            }
        })
        this.rootModifier = new StateModifier({
            transform: Transform.translate(0, 0, 200)
        })
        this.root = this.add(this.rootModifier)
        this.root.add(this.backgroundSurface);
    }

    // function _createWings() {
    //   this.leftWing = new ImageSurface({
    //     size: [window.innerWidth/2, window.innerHeight/1.2],
    //     content: 'img/leftwing.png',
    //     origin: [1,0],
    //     zIndex: 10
    //   })
    //   this.rightWing = new ImageSurface({
    //     size: [window.innerWidth/2, window.innerHeight/1.2],
    //     content: 'img/rightwing.png',
    //     origin: [0,0],
    //     zIndex: 10
    //   })
    //   this.wingModifier = new StateModifier({
    //     align: [0.5, 0.1],
    //     transform: Transform.translate(0,0,10)
    //   })
    //   this.wingNode = this.add(this.wingModifier);
    //   this.wingNode.add(this.leftWing);
    //   this.wingNode.add(this.rightWing);
    // }

    function _createName() {
        this.name = new Surface({
            size: [window.innerWidth / 1.5, window.innerHeight / 3],
            content: 'GABRIEL',
            classes: ['landing-name']
        })
        this.nameModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.40],
            transform: Transform.inFront
        })

        this.root.add(this.nameModifier).add(this.name);
    }

    function _createLoginButton() {
        this.loginButton = new Surface({
            size: [window.innerWidth / 5, window.innerHeight / 25],
            content: 'Sign In',
            classes: ['landing-buttons', 'login-button']

        })

        this.loginButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.75],
            transform: Transform.inFront
        });

        this.root.add(this.loginButtonModifier).add(this.loginButton);
    }

    function _createRedirectButton() {
        //console.log('CORRECT THIS',this);
        this.redirectButton = new Surface({
            content: 'Get Started with Angel List',
            classes: ['landing-buttons', 'redirect-button']

        })

        this.redirectButtonModifier = new StateModifier({
            size: [window.innerWidth / 1.8, window.innerHeight / 25],
            origin: [0.5, 0.5],
            align: [0.5, 0.85],
            transform: Transform.inFront
        });

        this.root.add(this.redirectButtonModifier).add(this.redirectButton);
    }


    function _setListeners() {
        this.loginButton.on('click', function() {
            //call oauth.io popup
            // console.log('this before popup', this);
            OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
            OAuth.popup('angel_list').done(function(result) {
                this.options.angel = result;
                ANGEL = result;
                result.get('/1/me').done(function(data) {
                    this.options.userData = data;
                    console.log(this.options.userData);
                }.bind(this)).fail(function(oops) {
                    console.log('unable to get user data');
                }.bind(this));

                result.get('/1/jobs').done(function(data) {
                    this.options.initialData = data;
                    this._eventOutput.emit('loaded');
                    this.rootModifier.setOpacity(0, {
                        duration: 1000
                    });
                    this.rootModifier.setTransform(Transform.translate(-window.innerWidth*2, 0, 0), {
                        duration: 1000
                    });
                }.bind(this)).fail(function(oops) {
                    console.log('unable to get job data');
                }.bind(this));
            }.bind(this));

        }.bind(this));
        //console.log('this OPTIONS after and outside popup', this.options);
    }


    module.exports = LandingView;
});
