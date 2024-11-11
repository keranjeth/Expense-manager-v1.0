1. Project Overview
   - "savepenny" is a personal finance web application that allows users to manage their income and expenses seamlessly. The application integrates with Google Sheets through Apps Script to store and manage data, providing real-time updates and a user-friendly interface.
   
2. Feature Requirements

   2.1 Technology Stack
       - Next.js for frontend
       - Shadcn for UI components
       - Lucid for design consistency
       - Supabase as the database
       - Clerk for user authentication

   2.2 User Interface Components
       - Navigation Menu: Home, Income, Expenses, Reports, Settings
       - Settings:
         - Apps Script URL input field to connect Google Sheets
         - Currency settings with Afghani (؋) as the primary currency
       - Form for Income and Expense Entries:
         - Users can enter details for both income and expenses.
         - Form includes fields for date, amount, category, subcategory, and additional notes.
         - Add a "+" button to allow users to add custom categories.

   2.3 Income Management
       - Income Entry Form: Includes date, source, and amount fields.
       - Income History: Displayed directly below the income form in a clean, table layout.

   2.4 Expense Management
       - Expense Entry Form: Includes fields for date, category, subcategory, quantity, unit price, total amount, and consumer.
       - Expense History: Displayed directly below the expense form with a table layout for easy reference.

   2.5 Emoji Generator Feature
       - Prompt Form for Emoji Generation: Users can enter a text prompt, and the app will generate an emoji using the Replicate model (replicate.com/for/sdxl-emoji).
       - UI and Animation: Subtle animations when the emoji is generating or blank, with icons for downloading or liking the generated emoji.
       - Image Gallery: Grid display of all generated emojis.

   2.6 Reporting Dashboard
       - Overview Section: Summarizes total income, expenses, and savings.
       - Income and Expense Reports: Displays trends and breakdowns by categories, top expenses, and income sources.
       - Budgeting Tools: Allows users to set and track monthly budgets per category.
       - Savings Goals: Users can define savings goals with visual progress tracking.

   2.7 Additional Functionalities
       - Data Management: Real-time synchronization with Google Sheets for both income and expense records.
       - User Authentication: Secure login using Clerk.
       - Notifications and Reminders: Alerts for upcoming bills, income reminders, and budget warnings.
       - Multi-Currency Support: Option to add and convert amounts in different currencies.
       - Accessibility Features: Mobile-friendly and keyboard navigation support.

   2.8 Design Elements
       - Visual Theme: Futuristic, female-oriented interface with soft color palettes, gradient buttons, and animations.
       - Input Fields and Tables: Uniform styling with right-aligned numbers, subtle borders, and consistent formatting.

   2.9 Google Apps Script Integration
       - Functionality: Adds income and expense data to Google Sheets.
       - Security: Secured endpoints to prevent unauthorized access.
       - Optimization: Caching for frequently accessed data like categories.

   2.10 Filters and Search Functionality
       - Global Search: Allows users to search across income and expense records.
       - Advanced Filters: Date range, categories, subcategories, and amount filters.

   2.11 Personal Finance Expert Recommendations
       - Financial Insights: Spending analysis and suggestions for savings.
       - Financial Planning Tools: Debt tracking and forecasting tools.
       - Educational Resources: Tips, tricks, and links to financial guides.

   2.12 Deployment and Testing
       - Development Environment: Next.js and Node.js for the frontend and backend.
       - Testing: Unit and integration testing for app reliability.
       - Deployment: Automated deployment on a scalable platform like Vercel.

3. Relevant Docs
   - Google Apps Script documentation for Google Sheets integration
   - Google Sheets API documentation
   - Design guidelines for a futuristic, female-oriented interface

4. Current File Structure
  xxxx

