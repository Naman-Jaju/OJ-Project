'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('problems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      examples: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      constraints: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      timeLimit: {
        type: Sequelize.INTEGER,
          allowNull: false,
        defaultValue: 1,
      },
      memoryLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 256,
      },
      acceptedSubmissions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalSubmissions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('problems', ['difficulty']);
    await queryInterface.addIndex('problems', ['tags'], { using: 'gin' });
    await queryInterface.addIndex('problems', ['isActive']);
    await queryInterface.addIndex('problems', ['createdAt']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('problems');
  }
};