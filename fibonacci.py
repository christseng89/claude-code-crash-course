"""Fibonacci sequence calculator with multiple implementation approaches."""

from typing import Dict


def fibonacci_recursive(n: int) -> int:
    """
    Calculate the nth Fibonacci number using recursion.

    Args:
        n: The position in the Fibonacci sequence (0-indexed)

    Returns:
        The nth Fibonacci number

    Raises:
        ValueError: If n is negative

    Note:
        This implementation has exponential time complexity O(2^n)
        and is not suitable for large values of n.
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


def fibonacci_iterative(n: int) -> int:
    """
    Calculate the nth Fibonacci number using iteration.

    Args:
        n: The position in the Fibonacci sequence (0-indexed)

    Returns:
        The nth Fibonacci number

    Raises:
        ValueError: If n is negative

    Note:
        This implementation has linear time complexity O(n)
        and constant space complexity O(1).
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return n

    previous = 0
    current = 1

    for _ in range(2, n + 1):
        previous, current = current, previous + current

    return current


def fibonacci_memoized(n: int, memo: Dict[int, int] = None) -> int:
    """
    Calculate the nth Fibonacci number using memoization.

    Args:
        n: The position in the Fibonacci sequence (0-indexed)
        memo: Optional dictionary for caching computed values

    Returns:
        The nth Fibonacci number

    Raises:
        ValueError: If n is negative

    Note:
        This implementation has linear time complexity O(n)
        with memoization, improving on the recursive approach.
    """
    if memo is None:
        memo = {}

    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return n
    if n in memo:
        return memo[n]

    memo[n] = fibonacci_memoized(n - 1, memo) + fibonacci_memoized(n - 2, memo)
    return memo[n]


def fibonacci_sequence(count: int) -> list[int]:
    """
    Generate a sequence of Fibonacci numbers.

    Args:
        count: Number of Fibonacci numbers to generate

    Returns:
        List of Fibonacci numbers

    Raises:
        ValueError: If count is negative
    """
    if count < 0:
        raise ValueError("count must be non-negative")
    if count == 0:
        return []
    if count == 1:
        return [0]

    sequence = [0, 1]
    for i in range(2, count):
        sequence.append(sequence[i - 1] + sequence[i - 2])

    return sequence


def main() -> None:
    """Demonstrate Fibonacci calculation with different approaches."""
    n = 10

    print(f"Fibonacci calculations for n = {n}:\n")

    # Iterative approach (recommended for general use)
    result_iterative = fibonacci_iterative(n)
    print(f"Iterative approach: F({n}) = {result_iterative}")

    # Memoized approach (good for multiple calculations)
    result_memoized = fibonacci_memoized(n)
    print(f"Memoized approach:  F({n}) = {result_memoized}")

    # Recursive approach (simple but slow for large n)
    print(f"Recursive approach: F({n}) = {fibonacci_recursive(n)}")

    # Generate sequence
    print(f"\nFirst {n + 1} Fibonacci numbers:")
    print(fibonacci_sequence(n + 1))

    # Performance comparison for larger values
    print("\n--- Performance Test ---")
    test_n = 30
    print(f"Calculating F({test_n})...")

    result = fibonacci_iterative(test_n)
    print(f"Iterative: {result}")

    result = fibonacci_memoized(test_n)
    print(f"Memoized:  {result}")

    print("\nNote: Recursive approach skipped for n=30 (too slow)")


if __name__ == "__main__":
    main()
