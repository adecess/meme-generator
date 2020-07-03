module.exports = {
    ensureAuth: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    },
    ensureAuthMeme: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            alert('You must sign in to save images to your portfolio')
            setTimeout(function(){ res.redirect('upload') }, 2000)
        }
    }
}