# Aegis Shield - Minimum Viable Scanner (MVS)

**Project Designation:** Aegis Shield
**Component:** Minimum Viable Scanner (MVS)
**Version:** 1.0.0
**Status:** Development Phase Complete. Ready for integration.

## Description

This package contains the core scanning engine for the Aegis Shield platform. It is a Node.js application that uses Puppeteer to perform a series of technical integrity checks on a given target URL.

The MVS is designed to be executed from the command line and will output a structured JSON report detailing its findings.

## Core Capabilities (v1.0.0)

*   **H1 Heading Detection:** Verifies the presence of a primary `<h1>` element.
*   **Link Text Analysis:** Scans all hyperlinks on a page to find specific text (e.g., "Terms of Service").
*   **Risk Scoring:** Calculates a basic risk score based on the success or failure of its checks.
*   **JSON Output:** Produces a clean, structured JSON report suitable for ingestion by other systems (e.g., a PDF report generator).

## Prerequisites

*   Node.js (v18.0 or higher)
*   npm

## Installation

1.  Clone the repository or place the package files in a directory.
2.  Navigate to the directory in your terminal.
3.  Run the command: `npm install`

## Execution

To run a scan, execute the following command from the project's root directory:

```bash
node mvs.js

The target URL is currently hard-coded in mvs.js. Future versions will accept a URL as a command-line argument.