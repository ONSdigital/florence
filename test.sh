if [ prettier --check "src/app/**/*.js" | tee /dev/stderr | grep -q "Code style issues found" ]; then
