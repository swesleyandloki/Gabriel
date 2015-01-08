define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');
    var FastClick = require('famous/inputs/FastClick');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);

    var StripData = require('data/StripData');
    var MatchView = require('views/MatchView');
    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');
    var SettingsView = require('views/SettingsView');
    // var SharingView = require('views/SharingView');
    var FeedbackView = require('views/FeedbackView');
    var ProfileView = require('views/ProfileView');

    var LandingView = require('views/LandingView');
    var AboutView = require('views/AboutView');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    function AppView() {
        View.apply(this, arguments);

        _createLandingView.call(this);
        this.landingView.on('loaded', function() {
            ///var results = this.getOptions('jobs');
            this.angel = this.landingView.options.angel;
            this.gabrielMenu = true;
            this.settingsMenu = true;
            this.aboutMenu = true;
            this.starredMenu = true;
            this.feedbackToggle = true;
            this.matchViewToggle = false;
            this.pageViewPos = 0;

            _createPageView.call(this);
            _createMatchView.call(this);
            _createMenuView.call(this);
            _createSettingsView.call(this);
            _createAboutView.call(this);
            _createProfileView.call(this);
            _createFeedbackView.call(this);
            _setListeners.call(this);

        }.bind(this));
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        userData: {},
        angel: {},
        initialData: {},
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 500,
            curve: 'easeOut'
        }
    };

    // GabrielPage Toggle
    AppView.prototype.showFullGabrielPage = function(callback) {
        this.pageModifier.setTransform(Transform.translate(0, 0, 0.9), this.options.transition, callback);
    };

    AppView.prototype.removeGabrielPage = function() {
        this.pageModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), {
            duration: 450,
            curve: 'easeOut'
        });
    };

    AppView.prototype.toggleGabrielPage = function() {
        if (this.gabrielMenu) {
            console.log('remove garielPage page');

            // this.menuModifier.setTransform(Transform.translate(0, 0, 0));
            this.removeGabrielPage();
            this.showFullMenuPage();
        } else {
            console.log('show full Gariel Page');
            this.showFullGabrielPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showGabrielPage = function() {
        console.log('show full GarielPage');
        this.gabrielMenu = true;
        this.showFullGabrielPage(function() {
            this.menuModifier.setTransform(Transform.translate(-window.innerWidth * 2, 0, -100), this.options.transition);
        }.bind(this));
    };

    // MenuPage Toggle
    AppView.prototype.showFullMenuPage = function() {
        this.menuModifier.setTransform(Transform.translate(0, 0, 0));
    };

    AppView.prototype.removeMenuPage = function() {
        this.pageModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), this.options.transition);
    };

    AppView.prototype.toggleMenuPage = function() {
        if (this.gabrielMenu) {
            console.log('remove garielPage page');
            this.removeMenuPage();
        } else {
            console.log('show full Gariel Page');
            this.showFullMenuPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showMenuPage = function() {
        console.log('show full GarielPage');
        this.gabrielMenu = true;
        this.showFullMenuPage();
    };

    AppView.prototype.showFullAboutPage = function() {
        this.aboutModifier.setTransform(Transform.translate(0, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.removeAboutPage = function() {
        this.aboutModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.toggleAboutPage = function() {
        if (this.aboutToggle) {
            console.log('removes aboutPage aside');
            this.removeAboutPage();
            this.showMenuPage();
            // this.menuView.animateStrips();
        } else {
            console.log('show full aboutPage');
            this.showFullAboutPage();
        }
        this.aboutMenu = !this.aboutMenu;
    };

    AppView.prototype.showAboutPage = function() {
        console.log('show full aboutPage');
        this.aboutToggle = true;
        this.showFullAboutPage();
    };

    // SettingsView Toggle
    AppView.prototype.showFullSettingsPage = function() {
        this.settingsModifier.setTransform(Transform.translate(0, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.removeSettingsPage = function() {
        this.settingsModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.toggleSettingsPage = function() {
        if (this.settingsMenu) {
            console.log('moves settingsPage aside');
            this.removeSettingsPage();
        } else {
            console.log('show full settingsPage');
            this.showFullSettingsPage();
        }
        this.settingsMenu = !this.settingsMenu;
    };

    AppView.prototype.showSettingsPage = function() {
        console.log('show full settingsPage');
        this.settingsMenu = true;
        this.showFullSettingsPage();
    };

    // // Share Gabriel View Toggle
    // AppView.prototype.moveSharingPageAside = function() {
    //     this.starredModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    // };
    //
    // AppView.prototype.showFullSharingPage = function() {
    //     this.starredModifier.setTransform(Transform.translate(0, 0, 0), {
    //         curve: 'easeOut',
    //         duration: 200
    //     });
    // };
    //
    // AppView.prototype.removeSharingPage = function() {
    //     this.starredModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
    //         curve: 'easeOut',
    //         duration: 200
    //     });
    // };
    //
    // AppView.prototype.toggleSharingMenu = function() {
    //     if (this.starredMenu) {
    //         console.log('moves starredPage aside');
    //         this.moveSharingPageAside();
    //         this.menuView.animateStrips();
    //     } else {
    //         console.log('show full starredPage');
    //         this.showFullSharingPage();
    //         this.removeProfilePage();
    //         this.removeGabrielPage();
    //         this.removeSettingsPage();
    //     }
    //     this.starredMenu = !this.starredMenu;
    // };
    //
    // AppView.prototype.showSharingPage = function() {
    //     console.log('show full starredPage');
    //     this.starredMenu = true;
    //     this.showFullSharingPage();
    //     this.removeProfilePage();
    //     this.removeGabrielPage();
    //     this.removeSettingsPage();
    // };
    //
    // // FeedbackView Toggle
    // AppView.prototype.moveFeedbackPageAside = function() {
    //     this.feedbackModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    // };
    //
    // AppView.prototype.showFullFeedbackPage = function() {
    //     this.feedbackModifier.setTransform(Transform.translate(0, 0, 0), {
    //         curve: 'easeOut',
    //         duration: 200
    //     });
    // };
    //
    // AppView.prototype.removeFeedbackPage = function() {
    //     this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), { duration: 0 } );
    //     this.feedbackModifier.setTransform(Transform.translate(0, window.innerHeight * 2, 0), {
    //         curve: 'easeOut',
    //         duration: 200
    //     });
    // };
    //
    // AppView.prototype.toggleFeedback = function() {
    //     if (this.feedbackToggle) {
    //         this.removeFeedbackPage();
    //         this.menuView.animateStrips();
    //     } else {
    //         console.log('show full feedbackPage');
    //         this.showFullFeedbackPage();
    //     }
    //     this.feedbackToggle = !this.feedbackToggle;
    // };
    //
    // AppView.prototype.showFeedbackPage = function() {
    //     this.pageModifier.setTransform(Transform.translate(window.innerWidth, 0, 0), { duration: 0 } );
    //     this.feedbackToggle = true;
    //     this.showFullFeedbackPage();
    // };

    // MatchView Toggle
    AppView.prototype.removeMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            duration: 500,
            curve: Easing.outBack
        });
    };

    AppView.prototype.showFullMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(0, 0, 0), {
            duration: 300,
            curve: 'easeOut'
        });
    };

    AppView.prototype.toggleMatchView = function() {
        if (this.matchViewToggle) {
            this.removeMatchView();
            this.showGabrielPage();
        } else {
            this.showFullMatchView();
            // this.removeGabrielPage();
        }
        this.matchViewToggle = !this.matchViewToggle;
    };


    // Create different views
    function _createPageView() {
        this.pageView = new PageView({
            initialData: this.landingView.options.initialData,
            angel: this.options.angel
        });
        this.pageModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(this.pageModifier).add(this.pageView);
    }


    function _createMenuView() {
        this.menuView = new MenuView({
            stripData: StripData,
            userData: this.landingView.options.userData
        });
        this.menuModifier = new StateModifier({
            transform: Transform.translate(-window.innerWidth, 0, 0)
        });

        this.add(this.menuModifier).add(this.menuView);
    }

    function _createMatchView() {
        this.matchView = new MatchView();
        this.matchModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        var matchModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.matchModifier)
            .add(matchModifier2)
            .add(this.matchView);
    }

    function _createSettingsView() {
        this.settingsView = new SettingsView();

        this.settingsModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        this.add(this.settingsModifier).add(this.settingsView);
    }

    function _createSharingView() {
        this.starredView = new SharingView();

        this.starredModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        this.add(this.starredModifier).add(this.starredView);
    }

    function _createProfileView() {
        this.profileView = new ProfileView();

        this.profileModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        var profileModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.profileModifier).add(profileModifier2).add(this.profileView);
    }

    function _createFeedbackView() {
        this.feedbackView = new FeedbackView();

        this.feedbackModifier = new StateModifier({
            transform: Transform.translate(0, window.innerHeight * 2, 0)
        });

        var feedbackModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.feedbackModifier).add(feedbackModifier2).add(this.feedbackView);
    }

    function _createAboutView() {
        this.aboutView = new AboutView();

        this.aboutModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth, 0, 0)
        });

        this.add(this.aboutModifier).add(this.aboutView);
    }

    function _createLandingView() {
        this.landingView = new LandingView();
        this.landingModifier = new StateModifier({
            transform: Transform.translate(0, 0, 1)
        })

        this.add(this.landingModifier).add(this.landingView);
        this.options.angel = this.landingView.options.results
        this.options.initialData = this.landingView.options.initialData
    }


    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleGabrielPage.bind(this));
        this.aboutView.on('menuToggle', this.toggleAboutPage.bind(this));
        this.settingsView.on('menuToggle', this.toggleSettingsPage.bind(this));
        // this.starredView.on('menuToggle', this.toggleSharingMenu.bind(this));
        // this.profileView.on('menuToggle', this.toggleProfileMenu.bind(this));

        // this.feedbackView.on('feedbackToggle', this.toggleFeedback.bind(this));
        // this.aboutView.on('showAboutPage', this.showAboutPage.bind(this));

        this.menuView.on('gabrielOnly', this.showGabrielPage.bind(this));
        this.menuView.on('aboutOnly', this.showAboutPage.bind(this));
        this.menuView.on('settingsOnly', this.showSettingsPage.bind(this));
        // this.menuView.on('sharingOnly', this.showSharingPage.bind(this));
        // this.menuView.on('ratingOnly', this.showRatingPage.bind(this));

        this.pageView.on('matchOnly', this.toggleMatchView.bind(this));
        this.matchView.on('showGabrielPage', this.toggleMatchView.bind(this));
    }

    module.exports = AppView;
});