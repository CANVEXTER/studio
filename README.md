# StudyPlanAI

This project is an AI-powered study schedule generator built with Next.js and Firebase Genkit. It provides a simple and intuitive interface for users to get a personalized study plan tailored to their specific needs, subjects, and availability.

## How It Works

The application is a single-page app that guides the user through a form to gather their study requirements.

1.  **Input Data**: The user fills out a detailed form, providing information about topics, exam dates, availability, and study preferences.
2.  **AI Generation**: On submission, the data is sent to a **Genkit flow**. The AI model processes this information to generate a structured and personalized study schedule. The application is designed to be **API modular**, allowing the user to configure their preferred AI provider (like Google Gemini or any OpenAI-compatible service such as OpenRouter) via a settings panel.
3.  **Display & Refine**: The generated schedule is displayed to the user. They have the option to provide feedback and ask the AI to refine the schedule iteratively until it meets their needs.
4.  **Export**: The final schedule can be printed or saved as a PDF.

## Real-World Scenario

Imagine a student preparing for final exams covering multiple subjects. They feel overwhelmed and don't know how to structure their study time effectively.

Using **StudyPlanAI**, the student can:
- List all their subjects (e.g., "Calculus II", "Modern European History", "Data Structures").
- Set their final exam date.
- Specify their availability (e.g., "evenings after 6 PM, all day on weekends").
- Mention constraints like a part-time job or other classes.
- Choose a preferred study style, like using the Pomodoro technique.

The AI will generate a day-by-day schedule that allocates time for each subject, suggests breaks, and helps the student prepare for their exams in a balanced and manageable way. If the initial plan doesn't feel right, they can ask for adjustments, such as, "Give me more time for Calculus on the weekends."

## Technology Stack

This project uses a modern, type-safe, and efficient tech stack:

*   **Framework**: **Next.js** (React framework with server-side rendering)
*   **Language**: **TypeScript**
*   **Generative AI**: **Firebase Genkit** (for creating and managing the AI flows)
*   **Styling**: **Tailwind CSS**
*   **UI Components**: **ShadCN/UI** (built on Radix UI)
*   **Form Management**: **React Hook Form**
*   **Schema Validation**: **Zod**

## Getting Started Locally

To run this project on your own machine, follow these steps:

1.  **Export the Project**: Use the export button in the Firebase Studio interface to download the project source code as a ZIP file.
2.  **Unzip the File**: Extract the contents of the ZIP file to a folder on your computer.
3.  **Navigate to Directory**: Open a terminal and change to the project's root directory.
    ```bash
    cd your-project-name
    ```
4.  **Install Dependencies**: Run `npm install` to download all the required packages listed in `package.json`.
    ```bash
    npm install
    ```
5.  **Run the Development Server**: Start the local server.
    ```bash
    npm run dev
    ```
    The application will now be running at `http://localhost:9002`.
