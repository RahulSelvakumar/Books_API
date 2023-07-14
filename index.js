const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();

app.use(bodyParser.urlencoded({extended:true}));

//Connecting with mongoose
mongoose.connect("mongodb+srv://Rahul:test123@cluster0.9nzv9nc.mongodb.net/BooksDB")
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
const bookSchema=new mongoose.Schema({
    title:String,
    author:String,
    year:Number,
    genre:String,
    rating:String
});
const Book=mongoose.model('book',bookSchema);

//Routes
app.get("/books", async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  });

app.get("/books/:id", async (req, res) => {
    const id=req.params.id;
    try {
      const books = await Book.findById(id);
      res.json(books);
    } catch (error) {
      res.status(500).json({error: `Book with id ${req.params.id} not found`});
    }
  });

  app.post('/books', async (req, res) => {
    const { title, author, year, genre, rating } = req.body;
    try {
      const book = await Book.create({ title, author, year, genre, rating });
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: `Failed to create book: ${req.body.title}` });
    }
  });

  app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre, rating } = req.body;
  
    try {
      const book = await Book.findByIdAndUpdate(id, { title, author, year, genre, rating }, { new: true });
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: `Failed to update book: ${req.body.title}` });
    }
  });
  
  app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Book.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ error: `Failed to delete book: ${req.body.title}` });
    }
  });


app.listen(3000,()=>{
    console.log("Listing to port 3000");
})
