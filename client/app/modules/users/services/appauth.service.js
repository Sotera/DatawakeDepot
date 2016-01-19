'use strict';

/*jshint sub:true*/
/*jshint camelcase: false */

angular.module('com.module.users')
    .service('AppAuth', function ($cookies, LoopBackAuth, $http, AminoUser) {


        var self = {
            login: function (data, cb) {
                LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
                $http.post('/api/users/login?include=user', {
                    email: data.email,
                    password: data.password
                })
                    .then(function (response) {
                        if (response.data && response.data.id) {
                            LoopBackAuth.currentUserId = response.data.userId;
                            LoopBackAuth.accessTokenId = response.data.id;
                        }
                        if (LoopBackAuth.currentUserId === null) {
                            delete $cookies['access_token'];
                            LoopBackAuth.accessTokenId = null;
                        }
                        LoopBackAuth.save();
                        if (LoopBackAuth.currentUserId && response.data && response.data
                                .user) {
                            self.currentUser = response.data.user;
                            cb(self.currentUser);

                        } else {
                            cb({});
                        }
                    }, function () {
                        console.log('AminoUser.login() err', arguments);
                        LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId =
                            null;
                        LoopBackAuth.save();
                        cb({});
                    });
            },

            logout: function () {
                LoopBackAuth.clearUser();
                LoopBackAuth.save();
                window.location = '/auth/logout';
            },

            populateUser: function (aminoUserId) {
                return new Promise(function (resolve, reject) {
                    AminoUser.findOne({
                        filter: {
                            where: {
                                id: aminoUserId
                            },
                            include: ['roles', 'identities', 'credentials', 'accessTokens', 'teams']
                        }
                    }).$promise
                        .then(function (user) {
                            self.currentUser = user;
                            self.currentUser.teams = user.teams;
                            self.currentUser.roles = user.roles;
                            var admins = self.currentUser.roles.filter(function (u) {
                                return u.name === 'admins';
                            });
                            self.currentUser.isAdmin = (admins.length > 0);
                            resolve(self.currentUser);
                        })
                });

            }
            ,
            getCurrentUser: function () {
                return new Promise(function (resolve, reject) {
                    // do a thing, possibly async, then…
                    if (self.currentUser) {
                        resolve(self.currentUser);
                        return;
                    }

                    AminoUser.getCurrent().$promise.then(function (amUser) {
                        self.populateUser(amUser.id).then(function (populatedUser) {
                            resolve(populatedUser);
                        }, function (error) {
                            reject("error populating user");
                        });
                    });
                })
            },

            ensureHasCurrentUser: function (cb) {
                if ((!this.currentUser || this.currentUser.id === 'social') && $cookies.access_token) {
                    LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
                    $http.get('/auth/current')
                        .then(function (response) {
                            if (response.data.id) {
                                //Found the user, all is good
                                LoopBackAuth.currentUserId = response.data.id;
                                LoopBackAuth.accessTokenId = $cookies.access_token.substring(2, 66);
                                if (LoopBackAuth.currentUserId === null) {
                                    delete $cookies['access_token'];
                                    LoopBackAuth.accessTokenId = null;
                                }
                                LoopBackAuth.save();
                                self.currentUser = response.data;
                                var profile = self.currentUser && self.currentUser.profiles &&
                                    self.currentUser.profiles.length && self.currentUser.profiles[0];
                                if (profile) {
                                    self.currentUser.name = profile.profile.name;
                                }
                                cb(self.currentUser);
                            }
                        }, function () {
                            console.log('AminoUser.getCurrent() err', arguments);
                            LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
                            LoopBackAuth.save();
                            cb({});
                        });
                } else {
                    console.log('Using cached current user.');
                    cb(self.currentUser);
                }
            }
        };
        return self;
    });
