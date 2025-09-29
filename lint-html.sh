#!/bin/bash

# HTML Lint Script for 24to12Converter
# This script lints all HTML files in the project

echo "🔍 HTML Linting Started..."
echo "================================"

# Check if HTMLHint is installed
if ! command -v htmlhint &> /dev/null; then
    echo "❌ HTMLHint is not installed. Installing..."
    npm install -g htmlhint
fi

# Array of HTML files to lint
files=(
    "index.html"
    "military-time-converter/index.html"
    "time-chart/index.html"
    "de/index.html"
    "de/military-time-converter/index.html"
    "de/time-chart/index.html"
    "es/index.html"
    "es/military-time-converter/index.html"
    "es/time-chart/index.html"
    "fr/index.html"
    "fr/military-time-converter/index.html"
    "fr/time-chart/index.html"
    "pt/index.html"
    "pt/military-time-converter/index.html"
    "pt/time-chart/index.html"
    "ja/index.html"
    "ja/military-time-converter/index.html"
    "ja/time-chart/index.html"
    "zh-tw/index.html"
    "zh-tw/military-time-converter/index.html"
    "zh-tw/time-chart/index.html"
)

error_count=0

# Lint each file
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📄 Linting: $file"
        output=$(htmlhint "$file" 2>&1)

        if [[ $output == *"no errors found"* ]]; then
            echo "✅ $file: PASSED"
        else
            echo "❌ $file: FAILED"
            echo "$output"
            ((error_count++))
        fi
        echo "--------------------------------"
    else
        echo "⚠️  File not found: $file"
        echo "--------------------------------"
    fi
done

# Check sitemap.xml
if [ -f "sitemap.xml" ]; then
    echo "📄 Checking sitemap.xml format..."
    if head -1 sitemap.xml | grep -q "<?xml version="; then
        echo "✅ sitemap.xml: Format OK"
    else
        echo "❌ sitemap.xml: Invalid format"
        ((error_count++))
    fi
    echo "--------------------------------"
fi

# Summary
echo "📊 Linting Summary"
echo "================================"
if [ $error_count -eq 0 ]; then
    echo "🎉 All files passed validation!"
else
    echo "❌ Found $error_count file(s) with errors"
    exit 1
fi