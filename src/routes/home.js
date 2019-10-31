import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.redirect('/demo');
});

export default router;
