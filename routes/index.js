var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn , function(req,res,next){
  res.render('profile');
})

router.get('/login', isLoggedIn , function(req,res,next){
  console.log(req.flash('error'))
  res.render('login', {error:req.flash('error')});
})

router.post('/register', function(req, res, next) {
  const {username , email , fullname } = req.body;
  const userData = new userModel({username , email , fullname})

  userModel.register(userData , req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res, function(){
      res.redirect('/profile')
    })
  })
});


router.post('/login', passport.authenticate('local', {
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}), function(req, res, next) {
});

router.get('/logout' , function(req, res){
  req.logout(function(err){
    if(err) {return err;}
    res.redirect('/login')
  })
})

function isLoggedIn(req,res ,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/')
}


module.exports = router;







































































// router.get('/alluserposts',async function(req, res, next) {
//   let user = await userModel.findOne({_id:'654f6122cd5c23a0965420c0'})
//   .populate('posts')
//   res.send(user);
// });

// router.get('/createuser', async function(req, res, next) {
//  let createdUser = await userModel.create({
//     username:"Harsh",
//     password: "Harsh",
//     posts: [],
//     email:"Harsh@mail.com",
//     fullName: "Harsh Vandana Sharma",
//   });
//   res.send(createdUser);
// });

// router.get('/createpost',async function(req,res,next){
//   let createdPost = await postModel.create({
//     postText: "Hello Kaise ho saare",
//     user:'654f6122cd5c23a0965420c0'
//   });
//   let user = await userModel.findOne({_id:'654f6122cd5c23a0965420c0'})
//   user.posts.push(createdPost._id);
//   await user.save()
//   res.send('done')
// })
