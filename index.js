const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, null, null, {
  dialect: 'mysql',
  port: process.env.DB_PORT,
  replication: {
    read: [
      { host: process.env.READ_DB_HOST, username: process.env.DB_USERNAME, password: process.env.READ_DB_PASS },
    ],
    write: { host: process.env.WRITE_DB_HOST, username: process.env.DB_USERNAME, password: process.env.WRITE_DB_PASS }
  },
  pool: {
    max: 20,
    idle: 30000
  },
});

const Produto = sequelize.define(process.env.DB_TABLE, {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  criado_por: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'produto',
  timestamps: false,
  underscored: true,
  sequelize,
});

(async () => {
  await sequelize.sync();

  const lastestIDs = [];

  for (let i = 0; i < 10; i++) {
    const randomNumber = Math.floor(Math.random() * 100);
    const descricao = `Produto${randomNumber}`;
    const categoria = 'Games';
    const valor = (Math.random() * 1000).toFixed(2);
    const criado_por = `MetaGames`;

    const insertedProduct = await Produto.create({
      descricao,
      categoria,
      valor,
      criado_por,
    });

    console.log('Dados inseridos:', insertedProduct.dataValues);
    lastestIDs.push(insertedProduct.id);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  for (let i = 0; i < lastestIDs.length; i++) {
    const selectedProduct = await Produto.findByPk(lastestIDs[i]);
    console.log('Consulta de ID:', lastestIDs[i], selectedProduct ? selectedProduct.dataValues : 'Nenhum resultado');
  }

  await sequelize.close();
})();
