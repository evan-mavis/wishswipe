# Debugging the Server (Node.js/Express)

To debug the server API in VS Code:

1. **Open the Run and Debug Panel**

   - In VS Code, go to the Run and Debug panel (left sidebar or `Cmd+Shift+D`).

2. **Start the Debugger**
   - Select `Debug Server` from the configuration dropdown.
   - Click the green play button to start debugging.
   - This will automatically start the server using Nodemon with debugging enabled.

**Full Stack Debugging:**

- You can debug both client and server at the same time by selecting the `Debug Full Stack` configuration in the Run and Debug panel.
- **Important:** Make sure to run the Chrome Debug task first, so the client is configured correctly for debugging.

**Tip:**

- Make sure you have installed all dependencies (`npm install`) in the `server` directory before debugging.
