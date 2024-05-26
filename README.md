## Overview

This project processes intervals by taking a set of include intervals and a set of exclude intervals to produce a final set of non-overlapping intervals.

## Project Setup

### Prerequisites

- Node.js (>=14.x)
- Yarn (>=1.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/christian-ek/interval-app.git
   cd interval-app
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

### Running the Application

To run the application locally in development mode, use the following command:

```bash
yarn dev
```

### Running Tests

The project uses Vitest for testing. To run the test suite, use the following command:

```bash
yarn test
```

### Project Structure

- **src/**: Contains the source code.
  - **\_\_tests\_\_/**: Contains the test cases for the project.
  - **lib/intervals.ts**: Contains the main interval processing functions.
  - **types/interval.ts**: Defines the Interval interface and provides utility functions to create intervals.
  - **components/**: Contains the React components for the web interface.
    - **IntervalForm.tsx**: The main form component for inputting intervals.
    - **Result.tsx**: The component for displaying the resulting intervals.
