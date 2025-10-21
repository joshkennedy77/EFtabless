# EverFriends MVP

A tabless website MVP where users talk to a photoreal digital human (video avatar). The AI speaks back, shows live captions, and can render UI Cards (JSON-driven) for info/actions.

## Features

- 🤖 **Photoreal Avatar**: HeyGen Realtime Avatar integration (stubbed for MVP)
- 🎤 **Voice Interaction**: WebRTC-based voice input with live captions
- 💬 **JSON-driven UI**: Dynamic UI cards, forms, and carousels
- 🧠 **State Machine**: Intelligent conversation flow management
- 📝 **Session Recording**: Text-based conversation logging
- ♿ **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- 🎨 **Modern UI**: Tailwind CSS with beautiful gradients and animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas
- **State Management**: React hooks + custom state machine
- **API**: Next.js API routes

## Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Netlify Deployment

1. **Connect to Netlify**:
   - Connect your GitHub repository to Netlify
   - Or drag and drop the `dist` folder after running `npm run build`

2. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

3. **Environment Variables** (Optional):
   - Add your API keys in Netlify dashboard
   - `NEXT_PUBLIC_SITE_URL`: Your Netlify site URL
   - `NEXT_PUBLIC_TAVUS_API_KEY`: Your Tavus API key
   - `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key

4. **Deploy**:
   - Netlify will automatically build and deploy your site
   - Your site will be available at `https://your-site-name.netlify.app`

## Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── realtime/route.ts      # Realtime proxy (stubbed)
│   │   └── events/route.ts        # Session event recording
│   ├── learn/page.tsx             # SEO-friendly learn page
│   ├── globals.css                # Global styles
│   └── page.tsx                   # Main tabless page
├── components/
│   ├── AvatarStage.tsx            # Avatar + mic interface
│   ├── ConsentModal.tsx           # First-run consent
│   ├── Captions.tsx               # Live captions display
│   ├── UiPanel.tsx                # Renders UiDirective objects
│   └── ui/                        # UI primitives
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Input.tsx
├── lib/
│   ├── schema.ts                  # Zod schemas for UiDirective
│   ├── stateMachine.ts            # Dialogue state machine
│   └── mockServer.ts              # Mock AI responses
├── data/
│   └── sessions/                  # Session logs (dev)
└── public/
    └── logo.png                   # Brand logo
```

## UI Directive Types

The system supports several JSON-driven UI components:

- **Notice**: Lightweight info text
- **Card**: Title, body, bullets, optional CTA button
- **Image**: URL + alt text
- **Form**: Text inputs, selects, chips with validation
- **Carousel**: Horizontal scrolling card collection

## State Machine

The conversation flows through these states:

1. **GREET**: Initial welcome and introduction
2. **QUALIFY**: Understanding user needs
3. **CLARIFY**: Confirming requirements
4. **ANSWER**: Providing solutions
5. **OFFER**: Suggesting additional services
6. **WRAP**: Conversation conclusion

## API Endpoints

- `POST /api/realtime` - WebRTC connection (stubbed)
- `POST /api/events` - Record session events
- `GET /api/events?sessionId=...` - Retrieve session data

## Development Notes

- **Avatar Integration**: Currently stubbed with placeholder. Replace with HeyGen iframe/SDK when API key is available.
- **Voice Input**: Text input for MVP. WebRTC voice integration can be added later.
- **Session Storage**: File-based in development, easily replaceable with database.
- **Mock Responses**: Scripted responses for each state. Replace with real AI integration.

## Environment Variables

```env
NEXT_PUBLIC_BRAND_NAME="EverFriends"
NEXT_PUBLIC_BRAND_TAGLINE="A friendly concierge, powered by Human+"
HEYGEN_API_KEY="your_api_key"
HEYGEN_AVATAR_ID="your_avatar_id"
OPENAI_API_KEY="your_openai_key"
```

## Accessibility Features

- Keyboard navigation support
- ARIA labels and roles
- Screen reader compatibility
- High contrast focus indicators
- Semantic HTML structure

## Future Enhancements

- Real HeyGen Realtime Avatar integration
- WebRTC voice input/output
- Database session storage
- Real AI integration (OpenAI, etc.)
- Dark mode support
- Mobile responsiveness improvements

## License

MIT License - see LICENSE file for details.
