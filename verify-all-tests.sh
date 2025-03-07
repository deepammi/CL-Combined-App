#!/bin/bash

# Script to run all tests and generate a verification report
# Usage: ./verify-all-tests.sh

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create results directory
RESULTS_DIR="test-verification-results"
mkdir -p $RESULTS_DIR

# Function to run a test and log results
run_test() {
  local test_file=$1
  local test_name=$2
  
  echo -e "${YELLOW}Running $test_name tests...${NC}"
  
  # Run the test and capture output
  npx cypress run --spec "cypress/e2e/$test_file" > "$RESULTS_DIR/$test_name-results.log" 2>&1
  
  # Check if test passed
  if grep -q "All specs passed!" "$RESULTS_DIR/$test_name-results.log"; then
    echo -e "${GREEN}✓ $test_name tests PASSED${NC}"
    return 0
  else
    echo -e "${RED}✗ $test_name tests FAILED${NC}"
    return 1
  fi
}

# Navigate to frontend directory
cd cl-frontendv4 || { echo "Error: cl-frontendv4 directory not found"; exit 1; }

# Clear previous results
rm -rf $RESULTS_DIR
mkdir -p $RESULTS_DIR

echo "==================================================="
echo "      CL Application Test Verification Script       "
echo "==================================================="
echo ""
echo "Starting verification at $(date)"
echo ""

# Initialize counters
TOTAL_TESTS=0
PASSED_TESTS=0

# Run all test categories
echo "=== Running Feature Tests ==="
run_test "ai-research-test.cy.ts" "AI Research"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "campaign-setup-test.cy.ts" "Campaign Setup"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "database-operations-test.cy.ts" "Database Operations"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "login-test.cy.ts" "Login"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "phone-calling-test.cy.ts" "Phone Calling"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "pre-sales-ai-test.cy.ts" "Pre-Sales AI"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

echo ""
echo "=== Running Edge Case Tests ==="
run_test "campaign-setup-edge-cases.cy.ts" "Campaign Setup Edge Cases"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

echo ""
echo "=== Running Comprehensive Tests ==="
run_test "complete-test.cy.ts" "Complete"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "comprehensive-phone-calling-test.cy.ts" "Comprehensive Phone Calling"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "working-phone-test.cy.ts" "Working Phone"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

run_test "working-test.cy.ts" "Working"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

echo ""
echo "=== Running Performance Tests ==="
run_test "performance-test.cy.ts" "Performance"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

echo ""
echo "=== Running Accessibility Tests ==="
run_test "accessibility-test.cy.ts" "Accessibility"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

echo ""
echo "=== Running Visual Regression Tests ==="
run_test "visual-regression.cy.ts" "Visual Regression"
((TOTAL_TESTS++))
[ $? -eq 0 ] && ((PASSED_TESTS++))

# Generate summary report
echo ""
echo "==================================================="
echo "                 Verification Summary               "
echo "==================================================="
echo ""
echo "Tests Run: $TOTAL_TESTS"
echo "Tests Passed: $PASSED_TESTS"
echo "Tests Failed: $((TOTAL_TESTS - PASSED_TESTS))"
echo ""

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
  echo "The CL application is ready for release."
else
  echo -e "${RED}Some tests failed. Please check the logs in the $RESULTS_DIR directory.${NC}"
  echo "The application requires attention before release."
fi

echo ""
echo "Verification completed at $(date)"
echo "Detailed logs are available in the $RESULTS_DIR directory"
echo ""

# Generate HTML report
cat > "$RESULTS_DIR/verification-report.html" << EOF
<!DOCTYPE html>
<html>
<head>
  <title>CL Application Test Verification Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .summary { margin: 20px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
    .passed { color: green; }
    .failed { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  </style>
</head>
<body>
  <h1>CL Application Test Verification Report</h1>
  <p>Generated on: $(date)</p>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Tests Run: $TOTAL_TESTS</p>
    <p>Tests Passed: <span class="passed">$PASSED_TESTS</span></p>
    <p>Tests Failed: <span class="failed">$((TOTAL_TESTS - PASSED_TESTS))</span></p>
    
    <h3>Overall Status: 
EOF

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
  echo '<span class="passed">PASSED</span></h3>' >> "$RESULTS_DIR/verification-report.html"
else
  echo '<span class="failed">FAILED</span></h3>' >> "$RESULTS_DIR/verification-report.html"
fi

cat >> "$RESULTS_DIR/verification-report.html" << EOF
  </div>
  
  <h2>Detailed Results</h2>
  <table>
    <tr>
      <th>Test Category</th>
      <th>Test File</th>
      <th>Status</th>
    </tr>
EOF

# Add test results to HTML report
for test_file in "$RESULTS_DIR"/*-results.log; do
  test_name=$(basename "$test_file" -results.log)
  if grep -q "All specs passed!" "$test_file"; then
    status="<span class=\"passed\">PASSED</span>"
  else
    status="<span class=\"failed\">FAILED</span>"
  fi
  
  # Determine category
  category="Feature"
  if [[ $test_name == *"edge-cases"* ]]; then
    category="Edge Case"
  elif [[ $test_name == "Complete" || $test_name == *"comprehensive"* || $test_name == *"working"* ]]; then
    category="Comprehensive"
  elif [[ $test_name == "Performance" ]]; then
    category="Performance"
  elif [[ $test_name == "Accessibility" ]]; then
    category="Accessibility"
  elif [[ $test_name == *"visual"* ]]; then
    category="Visual Regression"
  fi
  
  echo "    <tr><td>$category</td><td>$test_name</td><td>$status</td></tr>" >> "$RESULTS_DIR/verification-report.html"
done

cat >> "$RESULTS_DIR/verification-report.html" << EOF
  </table>
  
  <h2>Bug Fixes Verification</h2>
  <table>
    <tr>
      <th>Bug</th>
      <th>Status</th>
      <th>Verified By</th>
    </tr>
    <tr>
      <td>AWS Credential Management Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/AI Research-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>AI Research Test</td>
    </tr>
    <tr>
      <td>Database Transfer Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/Database Operations-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>Database Operations Test</td>
    </tr>
    <tr>
      <td>UI Button Positioning Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/Phone Calling-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>Phone Calling Test</td>
    </tr>
    <tr>
      <td>Green Button Reliability Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/Comprehensive Phone Calling-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>Comprehensive Phone Calling Test</td>
    </tr>
    <tr>
      <td>Call History Feature Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/Working Phone-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>Working Phone Test</td>
    </tr>
    <tr>
      <td>AI Research Excel Sheet Issue</td>
      <td>$(grep -q "All specs passed!" "$RESULTS_DIR/AI Research-results.log" && echo "<span class=\"passed\">FIXED</span>" || echo "<span class=\"failed\">NOT VERIFIED</span>")</td>
      <td>AI Research Test</td>
    </tr>
  </table>
  
  <h2>Conclusion</h2>
EOF

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
  echo '  <p class="passed">All tests passed successfully! The CL application is ready for release.</p>' >> "$RESULTS_DIR/verification-report.html"
else
  echo '  <p class="failed">Some tests failed. Please check the detailed logs before releasing the application.</p>' >> "$RESULTS_DIR/verification-report.html"
fi

cat >> "$RESULTS_DIR/verification-report.html" << EOF
</body>
</html>
EOF

echo "HTML report generated: $RESULTS_DIR/verification-report.html"

exit 0 