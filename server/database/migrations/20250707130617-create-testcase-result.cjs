'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('testcase_results', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      submissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'submissions', // Update if your actual table name is different
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      testcaseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'testcases', // Ensure this matches the correct table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      passed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      runtime: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      memory: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('testcase_results');
  },
};
