# 24-Hour to 12-Hour Time Converter Toolset

A comprehensive, user-friendly suite of web-based tools for all your time conversion needs. Convert between 24-hour, 12-hour (AM/PM), and military time formats with ease.

**Live Site:** [24to12converter.com](https://www.24to12converter.com/)

## Pages

This website offers a collection of specialized tools and resources:

*   **[12-Hour to 24-Hour Converter](https://www.24to12converter.com/)**: The main tool for instant, bidirectional time conversion.
*   **[Military Time Converter](https://www.24to12converter.com/military-time-converter/)**: A dedicated converter for professionals using military time (e.g., 1830 hours).
*   **[Time Conversion Chart](https://www.24to12converter.com/time-chart/)**: A complete, printable chart showing conversions for every 10 minutes of the day.
*   **[Privacy Policy](https://www.24to12converter.com/privacy.html)**: Our commitment to user privacy.
*   **[Terms of Service](https://www.24to12converter.com/terms.html)**: The terms and conditions for using the site.

## Features

*   **Bidirectional Conversion:** Seamlessly switch between 24-hour, 12-hour, and military time formats.
*   **Smart Input Recognition:** Accepts various time formats (e.g., `18:30`, `1830`, `6:30 PM`, `0630pm`).
*   **Instant Results:** Get real-time conversions as you type.
*   **One-Click Copy:** Easily copy the converted time to your clipboard.
*   **Printable Charts:** Print the detailed time conversion chart for offline reference.
*   **Fully Responsive:** Optimized for a great experience on both desktop and mobile devices.

## Technologies Used

*   **HTML5**
*   **Tailwind CSS v4**
*   **Vanilla JavaScript**
*   **Node.js / npm** (for development and build processes)

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jqueryscript/24to12converter.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd 24to12converter
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Build the CSS:**
    The project uses Tailwind CSS. Run the following command to compile the `app.css` file:
    ```bash
    npm run build:css
    ```

5.  **Open `index.html` in your browser** to view the website.

## Linting

This project uses `htmlhint` to ensure HTML code quality. To run the linter, use the following command:

```bash
npx htmlhint **/*.html
```