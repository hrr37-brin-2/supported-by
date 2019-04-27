let i = 9989900;

module.exports.getID = (context, events, done) => {
  i++;
  context.vars.ID = i;
  return done();
}