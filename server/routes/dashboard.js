const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

/**
 * Dashboard Routes 
*/
router.get('/dashboard', isLoggedIn, dashboardController.dashboard);

// View specific note
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardViewNote);

// Edit note routes
router.get('/dashboard/item/edit/:id', isLoggedIn, dashboardController.dashboardEditNote);
router.put('/dashboard/item/edit/:id', isLoggedIn, dashboardController.dashboardEditNoteSubmit);

// ALSO ADD: Alternative update route to match your view-note template
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardEditNoteSubmit);

// Delete note route
router.delete('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardDeleteNote);

// Add note routes
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);

// Search route
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);

module.exports = router;