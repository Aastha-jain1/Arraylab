export const COMPLEXITY = {
  memory: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(1)',
    note: 'One multiplication and one addition give the address of any element, however large the array is. This is why reading arr[i] is instant.' },
  insert: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
    note: 'Best case: inserting at the end moves nothing. Worst case: inserting at the beginning moves all n elements. It happens in place, so no extra memory is needed.' },
  delete: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
    note: 'Best case: deleting the last element moves nothing. Worst case: deleting the first moves the other n−1 elements. Deleting by value also needs a search first.' },
  linear: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)',
    note: 'Best case: the target is first. Worst case: it is last or missing, so all n elements are checked. Double the array, double the work.' },
  binary: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
    note: 'Each comparison removes half of the remaining elements, so 1,000,000 elements need about 20 comparisons. It only works on a sorted array.' },
};
