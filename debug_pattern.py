import re

# Test line from the file
line = '(我們4個後來稱自己為"F4"); F  T/ P2 `  e1 ?+ [3 K/ n'
print('Original:', repr(line))
print()

cleaned = line.rstrip()
print('After rstrip:', repr(cleaned))

# Pattern 0a
pattern0a = r'(\)["\']?)[;,:\s]+[a-zA-Z0-9\s!@#$%^&*()_+=\[\]{}|;:,.<>?/\\\'"`~\-]+$'
result = re.sub(pattern0a, r'\1', cleaned)
print('After Pattern 0a:', repr(result))

# Check if pattern matches
match = re.search(pattern0a, cleaned)
if match:
    print('  Pattern 0a matched:', repr(match.group()))
    print('  Group 1 (preserved):', repr(match.group(1)))
else:
    print('  Pattern 0a: NO MATCH')
