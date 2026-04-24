/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
  const locals = {
    title: "Notify - Your Digital Note Companion",
    description: "Free NodeJS Notes App - Notify.",
  }
  res.render('index', {
    locals,
    layout: '../views/layouts/front-page'
  });
}

/**
 * GET /features
 * Features Page
*/
exports.features = async (req, res) => {
  const locals = {
    title: "Features - Notify",
    description: "Discover all the features that make Notify your perfect note-taking companion",
  }
  res.render('features', {
    locals,
    layout: '../views/layouts/main'  // ADDED THIS LINE
  });
}

/**
 * GET /about
 * About 
*/
exports.about = async (req, res) => {
  const locals = {
    title: "About - Notify",
    description: "Learn about Notify - your personal note-taking companion",
  }
  res.render('about', {
    locals,
    layout: '../views/layouts/main'  // ADDED THIS LINE
  });
}