# Local Setup Guide for EverFriends

This guide will help you set up the EverFriends project on your local laptop.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- A code editor like **VS Code**, **Cursor**, or **Sublime Text**

## Step 1: Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone https://github.com/joshkennedy77/EFtabless.git
cd EF
```

Or if you already have it cloned, navigate to the project directory:

```bash
cd /path/to/EF
```

## Step 2: Install Dependencies

Install all the required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- And other required packages

## Step 3: Set Up Environment Variables

Copy the example environment file and add your API keys:

```bash
cp env.example .env.local
```

Then edit `.env.local` and add your Tavus API key:

```env
TAVUS_API_KEY=your_tavus_api_key_here
```

**Note:** The Tavus API key is required for the avatar to work. If you don't have one yet, the app will still run but will show an error message when trying to load the avatar.

## Step 4: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

You should see output like:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

## Step 5: Access the Application

Open your browser and navigate to:
- **Concierge Page**: http://localhost:3000
- **Doctor's Assistant Page**: http://localhost:3000/doctor
- **Info Page**: http://localhost:3000/info

## Project Structure

```
EF/
├── app/
│   ├── page.tsx              # Main concierge page (home)
│   ├── doctor/
│   │   └── page.tsx          # Doctor's Assistant variant page
│   ├── info/
│   │   └── page.tsx          # Information/about page
│   └── api/
│       └── tavus/            # Tavus API integration
├── components/
│   ├── AvatarStage.tsx       # Avatar display component
│   ├── Captions.tsx          # Live captions component
│   ├── UiPanel.tsx           # UI directives renderer
│   └── ConsentModal.tsx     # Consent modal
├── lib/
│   ├── mockServer.ts         # Mock AI responses
│   ├── schema.ts             # Type definitions
│   └── stateMachine.ts       # Conversation state machine
├── public/
│   ├── logo.png              # Brand logo
│   └── olivia.png            # Avatar placeholder image
└── .env.local                # Your environment variables (not in git)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features

### Concierge Mode (`/`)
- Hospital check-in
- Family notifications
- Care coordination
- Wellness tracking

### Doctor's Assistant Mode (`/doctor`)
- Schedule consultation
- Prescription requests
- Lab results viewing
- Medical history access

Both modes feature:
- ✅ Tavus AI avatar integration
- ✅ Voice input via Web Speech API
- ✅ Live captions
- ✅ Dynamic form rendering
- ✅ Modern glassmorphism UI design

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:

```bash
PORT=8000 npm run dev
```

### Avatar Not Loading
1. Check that `TAVUS_API_KEY` is set in `.env.local`
2. Verify the API key is valid
3. Check browser console for error messages
4. Ensure your internet connection is active (Tavus requires API access)

### Build Errors
If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

### Microphone Permission Issues
The app requires microphone access for voice input:
1. Check your browser settings
2. Make sure you've granted microphone permissions
3. Try refreshing the page and accepting the consent modal

## Next Steps

1. **Customize the Avatar**: Update the Tavus persona ID and replica ID in `components/AvatarStage.tsx` if you have different ones
2. **Modify Forms**: Edit form fields in `components/UiPanel.tsx` in the `getFormForAction` function
3. **Update Branding**: Change logo, colors, and text throughout the app
4. **Connect Real AI**: Replace `lib/mockServer.ts` with actual AI API integration

## Need Help?

- Check the main `README.md` for more details
- Review the code comments in key files
- Check browser console for error messages

## Deployment

When ready to deploy:

1. Build the project: `npm run build`
2. Test the production build: `npm run start`
3. Deploy to Netlify, Vercel, or your preferred hosting platform
4. **Don't forget to set environment variables** (like `TAVUS_API_KEY`) in your hosting platform's dashboard!

---

Happy coding! 🚀

