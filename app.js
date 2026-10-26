import express from 'express';
import path from 'node:path';
import indexRouter from './routes/indexRouter.js';

const app = express();

const __dirname = path.join(import.meta.dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);

const port = process.env.PORT || 3000;
app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${port} (•‿•)`);
});
