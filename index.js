const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('aula', null, null, {
  dialect: 'mysql',
  port: 3306,
  replication: {
    read: [
      { host: '34.73.29.229', username: 'usr_metagames', password: 'fatec123' },
    ],
    write: { host: '34.23.151.195', username: 'usr_metagames', password: 'fatec123' }
  },
  pool: {
    max: 20,
    idle: 30000
  },
});

const Produto = sequelize.define('produto', {
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
