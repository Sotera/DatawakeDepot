module.exports = function (aminoUser) {

  // Set the username to the users email address by default.
  aminoUser.observe('before save', function setDefaultUsername(ctx, next) {
    if (ctx.instance) {
      if (ctx.instance.username === undefined) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });
};
