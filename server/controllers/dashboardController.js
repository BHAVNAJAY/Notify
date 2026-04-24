const Note = require("../models/Notes");
const mongoose = require("mongoose");

/**
 * GET /
 * Dashboard
 */
exports.dashboard = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;
  let searchTerm = req.query.searchTerm || '';

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    let searchObj = { user: new mongoose.Types.ObjectId(req.user.id) };
    
    // Add search functionality
    if (searchTerm) {
      searchObj.title = { $regex: new RegExp(searchTerm, 'i') }; // Case insensitive search
    }

    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: searchObj }, // FIXED: Using searchObj instead of inline ObjectId
      {
        $project: {
          title: { $substr: ["$title", 0, 50] },
          body: { $substr: ["$body", 0, 150] },
        },
      }
      ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(); 

    const count = await Note.countDocuments(searchObj); // FIXED: Using countDocuments instead of count

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
      searchTerm // Pass search term back to template
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });

    if (!note) {
      return res.status(404).send('Note not found');
    }

    const locals = {
      title: "View Note",
      description: "Free NodeJs Notes App.",
    }

    res.render('dashboard/view-note', {
      noteID: req.params.id,
      note,
      locals,
      layout: "../views/layouts/dashboard",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /
 * Show edit note page
 */
exports.dashboardEditNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });

    if (!note) {
      return res.status(404).send('Note not found');
    }

    const locals = {
      title: "Edit Note",
      description: "Free NodeJs Notes App.",
    }

    res.render('dashboard/edit-note', {
      noteID: req.params.id,
      note,
      locals,
      layout: "../views/layouts/dashboard",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
}

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardEditNoteSubmit = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    );

    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.id 
    });

    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
  const locals = {
    title: "Add Note",
    description: "Free NodeJs Notes App.",
  }

  res.render('dashboard/add', {
    locals,
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      body: req.body.body,
      user: req.user.id
    });

    await newNote.save();
    res.redirect('/dashboard');
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
}

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearch = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    res.redirect(`/dashboard?searchTerm=${searchNoSpecialChars}`);

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};