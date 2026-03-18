const Koa = require('Koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

// 中间件
app.use(cors());
app.use(bodyParser());

// 模拟 1~3 秒网络延迟（方便观察自动化测试过程）
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/api')) {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1000~3000ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  await next();
});

// 模拟数据库
let items = [
  { id: 1, title: 'Learn Vite 8.0', description: 'Explore the new features of Vite 8.0 including its blazing fast performance.', status: 'active' },
  { id: 2, title: 'Master TailwindCSS v4', description: 'Dive deep into PostCSS integration with Tailwind 4 and build premium UI variants.', status: 'active' },
  { id: 3, title: 'Vue 3 Composition API', description: 'Build dynamic components with state, props, and emit using script setup.', status: 'inactive' }
];
let nextId = 4;

// 增删改查接口
// 1. 获取列表
router.get('/api/items', (ctx) => {
  ctx.body = {
    success: true,
    data: items,
    message: 'Items fetched successfully'
  };
});

// 2. 获取单个
router.get('/api/items/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const item = items.find(i => i.id === id);
  
  if (item) {
    ctx.body = { success: true, data: item };
  } else {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Item not found' };
  }
});

// 3. 新增
router.post('/api/items', (ctx) => {
  const { title, description, status } = ctx.request.body;
  
  if (!title) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'Title is required' };
    return;
  }
  
  const newItem = {
    id: nextId++,
    title,
    description: description || '',
    status: status || 'active'
  };
  
  items.push(newItem);
  
  ctx.status = 201;
  ctx.body = {
    success: true,
    data: newItem,
    message: 'Item created successfully'
  };
});

// 4. 修改
router.put('/api/items/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const { title, description, status } = ctx.request.body;
  
  const index = items.findIndex(i => i.id === id);
  
  if (index !== -1) {
    items[index] = {
      ...items[index],
      title: title !== undefined ? title : items[index].title,
      description: description !== undefined ? description : items[index].description,
      status: status !== undefined ? status : items[index].status
    };
    
    ctx.body = {
      success: true,
      data: items[index],
      message: 'Item updated successfully'
    };
  } else {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Item not found' };
  }
});

// 5. 删除
router.delete('/api/items/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const initialLength = items.length;
  
  items = items.filter(i => i.id !== id);
  
  if (items.length < initialLength) {
    ctx.body = { success: true, message: 'Item deleted successfully' };
  } else {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Item not found' };
  }
});

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Koa server running on http://localhost:${PORT}`);
});
