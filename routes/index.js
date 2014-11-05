/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

// We only need a default route.  Angular will handle the rest.
//app.get('*', function(request, response){
//  response.sendfile("./public/index.html");
//});
