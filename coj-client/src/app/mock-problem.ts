import { Problem } from './models/problem.model';

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    name: 'Two Sum',
    desc: `Given an array of integers, return indices of the two numbers such that they add up to a specific target.
     You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    difficulty: 'Easy'
  },
  {
    id: 2,
    name: '3Sum',
    desc: `Given an array S of n integers, are there elements a, b, c in S such that a + b + c = 0? ` +
    `Find all unique triplets in the array which gives the sum of zero`,
    difficulty: 'Medium'
  },
  {
    id: 3,
    name: '4Sum',
    desc: `Given an array S of n integers, are there elements a, b, c, and d in S such that a + b + c + d = target?` +
    `Find all unique quadruplets in the array which gives the sum of target.`,
    difficulty: 'Medium'
  },
  {
    id: 4,
    name: 'Median of Two Sorted Array',
    desc: `There are two sorted arrays nums1 and nums2 of size m and n respectively.\n \n
Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).`,
    difficulty: 'Hard'
  },
  {
    id: 5,
    name: 'Sliding Window Maximum',
    desc: `Given an array nums, there is a sliding window of size k which is moving from the very left of the array to
 the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.`,
    difficulty: 'Super'
  }
];
