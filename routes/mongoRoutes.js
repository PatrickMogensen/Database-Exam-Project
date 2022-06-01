const mongoose = require('mongoose');
const express = require('express');
mongoose.connect('mongodb+srv://TestUsername:Ut9ggksexDCo74JA@cluster0.ggjoozw.mongodb.net/?retryWrites=true&w=majority');
router = express.Router();
const Book = require('../mongooseModels/bookSchema');
const User = require('../mongooseModels/userSchema');
const conn = mongoose.connection;
conn.on('error', () => console.error.bind(console, 'connection error'));
conn.once('open', () => console.info('Connection to Database is successful'));

router.post('/makeLoan', async (req, res) => {
  const session = await conn.startSession();
  try {
    session.startTransaction();
    const book = await Book.findById(req.body.book_id).exec();
    if (book.status === 'available') {
      book.status = 'loaned';
      book.save({session});
      await User.findByIdAndUpdate(req.body.user_id, {$push: {loans: book}}, {session});
      res.send('Loan has been made');
    } else if (book.status ==='reserved' && book.reservation.user === req.user_id) {
      await User.findByIdAndUpdate(req.body.user_id, {$push: {loans: book}}, {session});
      book.status = 'loaned';
      book.reservation = {};
      book.save({session});
      res.send('Loan has been made');
    } else {
      res.send('Book not available');
    }
    await session.commitTransaction();

    console.log('success');
  } catch (error) {
    res.send('error');
    console.log(error);
    await session.abortTransaction();
  }
  await session.endSession();
});

router.post('/book', async (req, res) => {
  try {
    const book = new Book(req.body);
    res.send(book);
    book.save();
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

router.post('/user', async (req, res) => {
  try {
    const user = new User(req.body);
    user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

router.get('/book', async (req, res) => {
  try {
    const book = await Book.findById(req.body.id).exec();
    res.send(book);
  } catch (error) {
    console.log(error);
    res.send('error');
  }
} );

router.put('/book', async (req, res) => {
  Book.findByIdAndUpdate(req.body.id, req.body,
      function(err, docs) {
        if (err) {
          res.send('error');
          console.log(err);
        } else {
          res.send('Updated book');
          console.log('Updated book : ', req.body);
        }
      });
});

router.delete('/book', async (req, res) => {
  Book.findByIdAndDelete(req.body.id,
      function(err, docs) {
        if (err) {
          res.send('error');
          console.log(err);
        } else {
          res.send('Deleted book: ' + docs );
          console.log('Updated book : ', req.body);
        }
      });
});


module.exports = router;
