import Router from 'express';

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/feed');

  res.render('index');
});

export default indexRouter;
