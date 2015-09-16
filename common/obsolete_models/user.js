module.exports = function (user) {

  // Set the username to the users email address by default.
  user.observe('before save', function setDefaultUsername(ctx, next) {
    if (ctx.instance) {
      if (ctx.instance.username === undefined) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });

/*  user.isAdmin = function(cb){
    cb(null, true);
  }

  user.remoteMethod('isAdmin',{
    http: {path: '/isAdmin', verb: 'get'},
    returns: {arg: 'isAdmin', type: 'boolean'}
  })*/
};
