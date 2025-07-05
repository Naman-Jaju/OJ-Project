'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('problems',[
      {
        id: require('crypto').randomUUID(),
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        difficulty: 'easy',
        tags: ['Array', 'Hash Table'],
        examples: JSON.stringify([
          {
            "input": "{\"nums\": [2,7,11,15], \"target\": 9}",
            "output": "[0,1]",
            "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            "input": "{\"nums\": [3,2,4], \"target\": 6}",
            "output": "[1,2]",
            "explanation": "No explanation provided for this example."
          },
          {
            "input": "{\"nums\": [3,3], \"target\": 6}",
            "output": "[0,1]",
            "explanation": "No explanation provided for this example."
          }
        ]),
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        timeLimit: 1,
        memoryLimit: 256,
        acceptedSubmissions: 1234567,
        totalSubmissions: 2345678,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: require('crypto').randomUUID(),
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
        difficulty: 'medium',
        tags: ['Linked List', 'Math', 'Recursion'],
        examples: JSON.stringify([
          {
            input: 'l1 = [2,4,3], l2 = [5,6,4]',
            output: '[7,0,8]',
            explanation: '342 + 465 = 807.'
          },
          {
            input: 'l1 = [0], l2 = [0]',
            output: '[0]'
          },
          {
            input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
            output: '[8,9,9,9,0,0,0,1]'
          }
        ]),
        constraints: [
          'The number of nodes in each linked list is in the range [1, 100].',
          '0 <= Node.val <= 9',
          'It is guaranteed that the list represents a number that does not have leading zeros.'
        ],
        timeLimit: 2,
        memoryLimit: 256,
        acceptedSubmissions: 987654,
        totalSubmissions: 1876543,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: require('crypto').randomUUID(),
        title: 'Median of Two Sorted Arrays',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
        difficulty: 'hard',
        tags: ['Array', 'Binary Search', 'Divide and Conquer'],
        examples: JSON.stringify([
          {
            input: 'nums1 = [1,3], nums2 = [2]',
            output: '2.00000',
            explanation: 'merged array = [1,2,3] and median is 2.'
          },
          {
            input: 'nums1 = [1,2], nums2 = [3,4]',
            output: '2.50000',
            explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
          }
        ]),
        constraints: [
          'nums1.length == m',
          'nums2.length == n',
          '0 <= m <= 1000',
          '0 <= n <= 1000',
          '1 <= m + n <= 2000',
          '-10^6 <= nums1[i], nums2[i] <= 10^6'
        ],
        timeLimit: 2,
        memoryLimit: 256,
        acceptedSubmissions: 456789,
        totalSubmissions: 1234567,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: require('crypto').randomUUID(),
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        difficulty: 'medium',
        tags: ['Hash Table', 'String', 'Sliding Window'],
        examples: JSON.stringify([
          {
            input: 's = "abcabcbb"',
            output: '3',
            explanation: 'The answer is "abc", with the length of 3.'
          },
          {
            input: 's = "bbbbb"',
            output: '1',
            explanation: 'The answer is "b", with the length of 1.'
          },
          {
            input: 's = "pwwkew"',
            output: '3',
            explanation: 'The answer is "wke", with the length of 3.'
          }
        ]),
        constraints: [
          '0 <= s.length <= 5 * 10^4',
          's consists of English letters, digits, symbols and spaces.'
        ],
        timeLimit: 1,
        memoryLimit: 256,
        acceptedSubmissions: 789123,
        totalSubmissions: 1567890,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: require('crypto').randomUUID(),
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        difficulty: 'easy',
        tags: ['String', 'Stack'],
        examples: JSON.stringify([
          {
            input: 's = "()"',
            output: 'true'
          },
          {
            input: 's = "()[]{}"',
            output: 'true'
          },
          {
            input: 's = "(]"',
            output: 'false'
          }
        ]),
        constraints: [
          '1 <= s.length <= 10^4',
          's consists of parentheses only \'()[]{}\''
        ],
        timeLimit: 1,
        memoryLimit: 256,
        acceptedSubmissions: 1567890,
        totalSubmissions: 2345678,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('problems', null, {});
  }
};