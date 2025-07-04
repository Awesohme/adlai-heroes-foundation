# Vista ERP Project Dashboard

The **Vista ERP Project Dashboard** is a web-based dashboard for tracking the progress of the Vista ERP implementation for Blueline IPP. It provides a visual overview of project phases, module completion, and real-time updates using Firebase or local storage.

## Features

- **Phase & Module Tracking:**  
  Visualizes progress across 5 project phases, each with detailed modules and completion percentages.
- **Admin Panel:**  
  Secure admin access (username: `admin` password: `vista2025`) to update module progress via sliders.
- **Real-Time Sync:**  
  Supports real-time updates using Firebase Realtime Database. Falls back to local storage if Firebase is not configured.
- **Data Management:**  
  - Export progress data as a JSON backup.
  - Import progress data from a backup file.
  - Reset all progress data (except completed phases).
- **Responsive Design:**  
  Optimized for desktop and mobile devices.
- **Connection Status:**  
  Displays live, local, or error connection status.

## Setup

1. **Clone or Download** this repository.
2. **Firebase Configuration (Optional for Cloud Sync):**
   - Go to [Firebase Console](https://console.firebase.google.com).
   - Create a project and enable Realtime Database.
   - Add a web app and copy the config object.
   - Replace the `firebaseConfig` object in the HTML file with your credentials.
   - Set database rules to allow read/write for testing.
3. **Open `Vista ERP Dashboard.html`** in your browser.

If Firebase is not configured, the dashboard will use your browser's local storage.

## Usage

- **View Progress:**  
  The dashboard displays overall and per-phase progress, with color-coded progress bars.
- **Admin Access:**  
  Click the ⚙️ Admin button (or press `Ctrl+A`) and enter credentials to open the admin panel.
- **Update Progress:**  
  Use sliders to adjust module completion. Click "Save Changes" to update.
- **Export/Import Data:**  
  Use the buttons in the admin panel to backup or restore progress data.
- **Reset Data:**  
  Use the "Reset All" button to restore default progress (phases 1 & 2 remain complete).

## Project Structure

- `Vista ERP Dashboard.html` — Main dashboard HTML file with embedded CSS and JavaScript.
- `README.md` — This documentation.

## Security

- **Admin Panel** is protected by a simple username/password prompt. For production, implement a more secure authentication method.

## License

This project is for internal use and demonstration purposes.  
Please update or remove sensitive information before deploying publicly.