'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('submissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Make sure this matches your actual users table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      problemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'problems', // Make sure this matches your actual problems table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Running", "Completed", "Failed"),
        allowNull: false,
      },
      verdict: {
        type: Sequelize.ENUM(
          "Accepted",
          "Wrong Answer",
          "Time Limit Exceeded",
          "Memory Limit Exceeded",
          "Segmentation Fault",
          "Runtime Error",
          "Compilation Error",
          "Internal Error",
          "Unknown"
        ),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('submissions');
  },
};
