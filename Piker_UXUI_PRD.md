# Product Requirements Document (PRD)

**Project Name:** Piker / Noto / Katakana (Final Name TBD)
**Document Focus:** UX/UI & Application Structure
**Product Type:** Financial Research Workspace

## 1. Product Vision & UX Objective

To provide a clean, highly organized workspace that replaces the traditional "Excel whiteboard" for financial analysts. The UI must manage high information density (SEC filings, news, charts) without feeling cluttered. The core user experience revolves around a "Notebook" paradigm where users can easily ingest documents, query them, and view strictly cited answers in a unified, multi-pane layout.

## 2. Core Application Structure (The 3-Pane Layout)

The application will utilize a persistent three-pane layout to ensure users never have to context-switch or lose their place while researching a ticker.

### Pane 1: The Left Sidebar (Source Management)
**Purpose:** To show users exactly what data is driving the current notebook.
* **Source List:** A clearly categorized list of all active documents for the current ticker (e.g., "SEC Filings", "Quarterly Reports", "Recent News").
* **Visual Status Indicators:** Non-intrusive UI elements (like spinners or checkmarks) next to sources to show if they are currently being processed, indexed, or ready for querying.
* **"Add Source" Action:** A prominent button allowing users to manually upload PDFs (like bespoke research reports) or paste external links to append to the notebook.

### Pane 2: The Central Workspace (Interactive Analysis)
**Purpose:** The primary area for user interaction, querying, and reading.
* **Tabbed Navigation:** A top bar allowing users to keep multiple ticker notebooks open simultaneously (e.g., swapping between a "GOOGL" tab and an "NVDA" tab).
* **The Query Interface:** A chat-style input field optimized for long-form, complex financial questions.
* **Response Area:** * Renders text, inline data tables (e.g., P&L comparisons), and simple trend charts.
  * **Citation UI (Critical):** Every factual claim must include a visually distinct, clickable citation tag. Clicking a tag should open a modal or highlight the exact snippet in the Left Sidebar's source document.

### Pane 3: The Right Utility Pane (Insights & Actions)
**Purpose:** A persistent dashboard for at-a-glance summaries and output generation.
* **Key Insights Dashboard:** Auto-populating widgets that display top-level metrics for the active ticker (e.g., Current P/E, Revenue Growth %, Top 3 highlighted risks).
* **Export Center:** Clear, one-click action buttons located at the bottom or top of the pane:
  * *Export to Excel* (Downloads tabular data from the chat).
  * *Generate Slide* (Creates a visual summary card).
  * *Copy Team Summary* (Copies a formatted text brief to the clipboard).

## 3. Key UX Flows & Interaction States

### 3.1. The Empty / Onboarding State
* **Visuals:** A minimalist, distraction-free screen.
* **Action:** A large, centrally located search bar prompting the user to "Enter a Ticker to Start Research."
* **Feedback:** Upon entering a ticker, the UI smoothly transitions to the 3-pane layout.

### 3.2. The Loading / Processing State
* **Visuals:** Instead of a generic loading screen blocking the user, the Central Workspace opens immediately.
* **Feedback:** Skeleton loaders or dynamic text (e.g., "Gathering 10-Ks...", "Scanning recent news...") appear in the Left Sidebar to indicate that the workspace is being built in real-time.

### 3.3. The Collaborative / Team View
* **Visuals:** A secondary dashboard accessible from the main navigation menu (outside of a specific notebook).
* **Functionality:** A simple list or card view showing which tickers other team members are currently researching, preventing duplicated effort across a firm.
