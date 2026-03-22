# Mobile-to-Server Connection Guide 📱💻

To use your JalSakhi APK with the server running on your laptop, follow these steps to ensure they can talk to each other.

## 1. Get your Laptop's Local IP Address
Both your mobile device and your laptop **must be on the same Wi-Fi network**.

- **Linux/Mac**: Open terminal and run `hostname -I` or `ifconfig`.
- **Windows**: Open Command Prompt and run `ipconfig`.
- Look for an address like `192.168.x.x` or `172.x.x.x`.

## 2. Update the API URL in the App
You need to tell the app to look for the server at your laptop's IP instead of `localhost`.

1. Create a `.env` file in the `JalSakhi` directory (if it doesn't exist).
2. Add the following line (replace `<YOUR_IP>` with your actual IP):
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_IP>:3000
   ```
3. The app will automatically use this URL because of the logic in `utils/api.ts`.

## 3. Configure Laptop Firewall
Ensure your laptop's firewall is not blocking incoming connections on port **3000**.
- **Linux (ufw)**: `sudo ufw allow 3000/tcp`
- **Windows/Mac**: Check your security settings to "Allow incoming connections" for Node.js.

## 4. Alternate: Use Tunneling (Recommended for Ease)
If local IP connection is tricky, use **ngrok** to get a public URL:

1. Install ngrok: `npm install -g ngrok`
2. Start the tunnel: `ngrok http 3000`
3. Copy the `https://xxxx.ngrok.io` URL.
4. Update your `.env` in the app:
   ```env
   EXPO_PUBLIC_API_URL=https://xxxx.ngrok.io
   ```
   *Note: Using ngrok also works over mobile data!*

## 5. Build your APK
Once the `.env` is set, build your APK:
```bash
npx expo export
# Then use EAS or your local build process to generate the APK
```

---
**Tip**: Always test the connection in your browser on the mobile device first by visiting `http://<YOUR_IP>:3000/` – you should see "API working".
