import url from 'url';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { config as configOfAllEnv } from '../../config/database.js';

const currentFilename = url.fileURLToPath(import.meta.url);
const basename = path.basename(currentFilename);
const currentDirname = path.dirname(currentFilename);
const env = process.env.ENV || 'dev';
const config = configOfAllEnv[env];
const db = {};

let sequelize;
const main = async () => {
  try {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
    await sequelize
      .authenticate()
      .then(async () => {
        console.info('Database connection has been established successfully.');
      })
      // eslint-disable-next-line
      .catch(err => {
        setTimeout(() => {
          process.exit(2);
        }, 1500);
      });

    const files = fs.readdirSync(currentDirname).filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const model = await import(url.pathToFileURL(path.join(currentDirname, file)).href);
      if (model.default) {
        const namedModel = model.default(sequelize, Sequelize.DataTypes);
        db[namedModel.name] = namedModel;
      }
    }

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (err) {
    setTimeout(() => {
      process.exit(3);
    }, 1500);
    throw err;
  } finally {
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
  }
};
await main();
export const Model = db;
