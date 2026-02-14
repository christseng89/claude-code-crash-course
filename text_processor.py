"""
Text Processing Utility
Combines all text cleaning and formatting operations from the session.
"""

import re
import argparse


def clean_invalid_chars(input_file, output_file):
    """
    Remove invalid character sequences from text file.

    Removes encoding artifacts like ": ]* v8 t/ p2 R8 w% o8 l" style patterns
    while preserving valid Chinese text.
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines and clean each
    lines = content.split('\n')
    cleaned_lines = []

    for line in lines:
        # Strip trailing whitespace FIRST to ensure $ anchor works correctly
        cleaned = line.rstrip()

        # Remove ASCII garbage patterns at end of lines
        # KEY FIX: Use [a-zA-Z0-9_] instead of \w to ONLY match ASCII word chars (not Chinese!)

        # Pattern 0a: Protect closing paren from garbage removal (run FIRST!)
        # Example: "F4"); F  T/ P2 ` -> keep "F4")
        cleaned = re.sub(r'(\)["\']?)[;,:\s]+[a-zA-Z0-9\s!@#$%^&*()_+=\[\]{}|;:,.<>?/\\\'"`~\-]+$', r'\1', cleaned)

        # Pattern 0b: Protect closing paren when followed by digit+garbage
        # Example: ")2 B* ]9 a$ -> keep )
        cleaned = re.sub(r'(\))\d+\s+[a-zA-Z0-9\s!@#$%^&*()_+=\[\]{}|;:,.<>?/\\\'"`~\-]+$', r'\1', cleaned)

        # Pattern 1: Capital letter followed by mixed ASCII chars WITH SPACES
        # Example: "R8 w% o8 l" (must have spaces to avoid matching "F4")
        # Requires at least one space to distinguish garbage from valid content
        cleaned = re.sub(r'[A-Z][\sa-zA-Z0-9_]*\s+[\sa-zA-Z0-9_]+$', '', cleaned)

        # Pattern 2: Punctuation followed by mixed ASCII chars
        # Example: ": ]* v8 t/ p2 R8 w%", "% c! Y" \3 q! o"
        # Using explicit ASCII charset, EXCLUDING quotes to preserve quoted strings
        asciiChars = r'a-zA-Z0-9_~!@#$%^&*()\-=+\[\]{}|;:,.<>/?`\'\"\\ '
        # Removed \' and \" from initial punct to not match quoted content
        cleaned = re.sub(r'[\d\s]*[~!@#$%^&*(\-_=+\[\]{}|;:,.<>/?`\\]+[' + asciiChars + r']*$', '', cleaned)

        # Pattern 3: Quote/apostrophe followed by ASCII chars
        # Example: "' N+ L1 j$ v) }) M$ ]  g4 @"
        cleaned = re.sub(r'[\'\"`]\s+[a-zA-Z0-9\s+$%@!#&*()_\-\[\]{}|;:,.<>?/\\]+$', '', cleaned)

        # Pattern 4: Digit followed by space and single letter patterns
        # Example: "5 q", "7 l", "1 S"
        cleaned = re.sub(r'\d+\s+[a-zA-Z](?:\s+[a-zA-Z0-9_])*$', '', cleaned)

        # Pattern 5: Letter+digit combinations like "P7 K5 h5 m"
        # Requires at least 2 combinations to avoid removing "F4"
        cleaned = re.sub(r'(?:[a-zA-Z]\d+\s+){2,}[a-zA-Z0-9]*\s*$', '', cleaned)

        # Pattern 6: Single trailing digit after Chinese character
        # Example: "好色3"
        cleaned = re.sub(r'(?<=[\u4e00-\u9fff])\d+\s*$', '', cleaned)

        # Pattern 7: Slash followed by ASCII at line end
        # Example: "/ C"
        cleaned = re.sub(r'/\s+[a-zA-Z0-9_]+$', '', cleaned)

        # Pattern 8: Multiple asterisks
        cleaned = re.sub(r'\*{5,}.*$', '', cleaned)

        # Pattern 9: Catchall for ASCII garbage CONTAINING SPACES at line end
        # Matches sequences like "5 q", "2 O$", "P7 K5 h5 m"
        # REQUIRES at least one space to avoid removing valid content like "F4" or ")"
        # Must be preceded by Chinese char to avoid removing valid English text
        cleaned = re.sub(r'(?<=[\u4e00-\u9fff])[^\u4e00-\u9fff\n]*\s+[^\u4e00-\u9fff\n]+$', '', cleaned)

        # Pattern 10: Lines that are ONLY garbage (digit space letter)
        if re.match(r'^\s*\d+\s+[a-zA-Z](?:\s+[a-zA-Z0-9_])*\s*$', cleaned):
            cleaned = ''

        # Trailing spaces already removed at the start
        cleaned_lines.append(cleaned)

    # Join and write
    cleaned_content = '\n'.join(cleaned_lines)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)

    print(f"✓ Cleaned file saved to: {output_file}")
    print("✓ All meaningless character sequences have been removed.")
    return output_file


def reformat_text(input_file, output_file):
    """
    Reformat text file with proper paragraph breaks and spacing.

    - Removes line number prefixes (e.g., "0→", "1→")
    - Adds blank lines between paragraphs
    - Ensures consistent spacing
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines
    lines = content.split('\n')

    # Process each line
    reformatted_lines = []
    for line in lines:
        # Remove line number prefix if present (pattern: digits followed by →)
        cleaned = re.sub(r'^\s*\d+→\s*', '', line)

        # Remove any remaining leading/trailing whitespace
        cleaned = cleaned.strip()

        # Add the cleaned line
        reformatted_lines.append(cleaned)

    # Create paragraphs with proper spacing
    # - Empty lines stay empty
    # - Non-empty lines become paragraphs
    # - Add blank line between paragraphs for readability
    output_lines = []
    prev_was_empty = True

    for line in reformatted_lines:
        if line:  # Non-empty line
            output_lines.append(line)
            output_lines.append('')  # Add blank line after each paragraph
            prev_was_empty = False
        elif not prev_was_empty:  # Only add one empty line
            prev_was_empty = True

    # Remove trailing empty lines
    while output_lines and output_lines[-1] == '':
        output_lines.pop()

    # Write the reformatted content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))

    paragraph_count = len([l for l in output_lines if l])
    print(f"✓ Reformatted file saved to: {output_file}")
    print(f"✓ Removed line number prefixes")
    print(f"✓ Added proper paragraph spacing")
    print(f"✓ Total paragraphs: {paragraph_count}")
    return output_file


def process_all(input_file, output_file=None, clean_only=False, reformat_only=False):
    """
    Process text file with cleaning and/or reformatting.

    Args:
        input_file: Path to input file
        output_file: Path to output file (optional)
        clean_only: Only perform cleaning operation
        reformat_only: Only perform reformatting operation
    """
    if output_file is None:
        # Generate default output filename
        base_name = input_file.rsplit('.', 1)[0]
        output_file = f"{base_name}_processed.txt"

    print("=" * 60)
    print("TEXT PROCESSING UTILITY")
    print("=" * 60)
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    print()

    if clean_only:
        print("Operation: Clean invalid characters only")
        print("-" * 60)
        clean_invalid_chars(input_file, output_file)
    elif reformat_only:
        print("Operation: Reformat text only")
        print("-" * 60)
        reformat_text(input_file, output_file)
    else:
        print("Operation: Clean + Reformat (full processing)")
        print("-" * 60)

        # Step 1: Clean invalid characters
        print("\n[Step 1/2] Cleaning invalid characters...")
        temp_file = f"{input_file}.temp"
        clean_invalid_chars(input_file, temp_file)

        # Step 2: Reformat
        print("\n[Step 2/2] Reformatting text...")
        reformat_text(temp_file, output_file)

        # Remove temp file
        import os
        os.remove(temp_file)
        print("\n✓ Temporary file removed")

    print()
    print("=" * 60)
    print("✓ PROCESSING COMPLETE!")
    print("=" * 60)


def main():
    """Main function with command-line argument parsing."""
    parser = argparse.ArgumentParser(
        description='Text Processing Utility - Clean and reformat text files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full processing (clean + reformat)
  python text_processor.py test.txt

  # Specify output file
  python text_processor.py test.txt -o output.txt

  # Clean only
  python text_processor.py test.txt --clean-only

  # Reformat only
  python text_processor.py test.txt --reformat-only
        """
    )

    parser.add_argument('input_file', help='Input text file to process')
    parser.add_argument('-o', '--output', help='Output file path (optional)')
    parser.add_argument('--clean-only', action='store_true',
                        help='Only clean invalid characters')
    parser.add_argument('--reformat-only', action='store_true',
                        help='Only reformat text')

    args = parser.parse_args()

    # Validate arguments
    if args.clean_only and args.reformat_only:
        print("Error: Cannot use both --clean-only and --reformat-only")
        return

    # Process the file
    process_all(
        args.input_file,
        args.output,
        args.clean_only,
        args.reformat_only
    )


if __name__ == "__main__":
    # If run without arguments, use default values
    import sys
    if len(sys.argv) == 1:
        # Default behavior: process test.txt
        print("No arguments provided. Using defaults...")
        print("Usage: python text_processor.py <input_file> [-o output_file] [--clean-only | --reformat-only]")
        print()
        process_all('test.txt', 'test_processed.txt')
    else:
        main()
