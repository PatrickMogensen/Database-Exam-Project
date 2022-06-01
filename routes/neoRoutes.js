const express = require('express');
router = express.Router();
const neo4j = require('neo4j-driver');
const uri = 'neo4j+s://6f7e02fe.databases.neo4j.io';
const user = 'neo4j';
const password = '_3KRa394uY8NPnqmJXtagYdKjYXletLTiAJ4JPpCLns';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

router.post('/book', async (req, res) => {
  const book = {
    author: req.body.author,
    title: req.body.title,
    genre: req.body.genre,
    status: req.body.status,
  };
  const writeQuery = 'CREATE (b:Book $book) RETURN b';
  const writeResult = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {book}),
  );
  writeResult.records.forEach((record) => {
    const b = record.get('b');
    res.send( `Created: ${JSON.stringify(b.properties)}`);
    console.log(
        `Created: ${b.properties.title}`,
    );
  });
});

router.get('/book', async (req, res) => {
  const id = neo4j.int(req.body.id);
  const writeQuery = 'MATCH(b:Book) WHERE id(b) = $id RETURN b';
  const writeResult = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {id}),
  );
  writeResult.records.forEach((record) => {
    const b = record.get('b');
    res.send( `Found: ${JSON.stringify(b.properties)}`);
    console.log(
        `Found: ${b.properties}`,
    );
  });
});

router.delete('/book', async (req, res) => {
  const id = neo4j.int(req.body.id);
  const writeQuery = ' MATCH(b:Book) WHERE id(b) = $id DELETE b RETURN b';
  const writeResult = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {id}),
  );
  writeResult.records.forEach((record) => {
    const b = record.get('b');
    res.send( `Delete book with id: ${JSON.stringify(b.properties)}`);
    console.log(
        `Deleted book with id: ${b.properties.title}`,
    );
  });
});

router.put('/book', async (req, res) => {
  const id = neo4j.int(req.body.id);
  // using spread operator
  const book = {
    ...(req.body.author) && {author: req.body.author},
    ...(req.body.title) && {title: req.body.title},
    ...(req.body.genre) && {genre: req.body.genre},
    ...(req.body.status) && {status: req.body.status},
  };

  const writeQuery = 'MATCH(b:Book) WHERE id(b) = $id SET b += $book RETURN b';
  const writeResult = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {id, book}),
  );
  writeResult.records.forEach((record) => {
    const b = record.get('b');
    res.send( `Updated to: ${JSON.stringify(b.properties)}`);
    console.log(
        `Update to: ${b.properties.title}`,
    );
  });
});

router.post('/makeLoan', async (req, res) => {
  const bookId = neo4j.int(req.body.book_id);
  const userId = neo4j.int(req.body.user_id);
  const writeQuery =
        ' MATCH(b:Book),' +
        ' (u:User)' +
        ' WHERE id(b) = $bookId AND b.status = "available" AND id(u) = $userId' +
        ' OR  (u)-[:IS_RESERVING]->(b) AND id(b) = $bookId AND id(u) = $userId ' +
        ' CREATE (u)-[l:LOANS{start_date:datetime()}]->(b)' +
        ' SET b.status = "loaned"' +
        ' RETURN b';
  const writeResult = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {bookId, userId}),
  );
  writeResult.records.forEach((record) => {
    const book = record.get('b');
    res.send( `Loaned book with id: ${JSON.stringify(book.properties)}`);
    console.log(
        `Loaned book with id: ${book.properties.title}`,
    );
  });
  if (!writeResult.records) {
    res.send('error');
  }
});


module.exports = router;
