import express from 'express';
import routes from './route/index.js';

const app = express();


async function main() {
    try {
      app.use(express.json({ limit: '60mb', extends: true }));
      await import('./db/models/index.js');
  
      const PORT = process.env.PORT || 3000;
  
      app.use((req, res, next) => {
        console.log(req.method, req.path);
        next();
      });
  
      // Authentication Routes
    app.use('/auth', routes);
  
      app.listen(PORT, () => {
        console.log(`app is running on port ${PORT}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  main();
  
  export default app;