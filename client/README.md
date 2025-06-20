# Debugging the Client (React/Vite)

To debug the client in VS Code:

1. **Open Chrome with Debugging Enabled**

   - Run the VS Code task `Start Chrome Debug` (Command Palette: `Run Task` > `Start Chrome Debug`), or run this command in your terminal:
     ```sh
     /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug http://localhost:5173
     ```

2. **Attach the Debugger**
   - In VS Code, go to the Run and Debug panel and start `Debug Client`.
   - This will automatically start the Vite dev server, attach the debugger, and let you set breakpoints in your React code as you use the app in Chrome.

**Full Stack Debugging:**

- You can debug both client and server at the same time by selecting the `Debug Full Stack` configuration in the Run and Debug panel.
- **Important:** Make sure to run the Chrome Debug task first, so the client is configured correctly for debugging.

**Tip:**

- Always use the Chrome window started with remote debugging for breakpoints to work.
- You can close any extra browser windows that Vite opens automatically.
