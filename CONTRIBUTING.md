# Contributing to Whisky Nights Club

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize the community and user experience

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/whisky-nights-club.git
   cd whisky-nights-club
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up local environment** (see [SETUP.md](./SETUP.md))
5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before You Start

- Check existing issues and PRs to avoid duplicates
- For large changes, open an issue first to discuss
- Make sure you can run the project locally

### Making Changes

1. **Write clean code**
   - Follow the existing code style
   - Use TypeScript properly
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test your changes**
   ```bash
   # Type check
   npx tsc --noEmit
   
   # Lint
   npm run lint
   
   # Run tests
   npm run test
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Test additions or changes
   - `chore:` Maintenance tasks

### Submitting a Pull Request

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Guidelines**
   - Provide a clear description of changes
   - Reference related issues
   - Add screenshots for UI changes
   - Ensure all checks pass
   - Be responsive to feedback

## Types of Contributions

### Bug Reports

- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior
- Add screenshots if applicable
- Mention your environment (browser, OS, etc.)

### Feature Requests

- Use the feature request template
- Explain the problem you're solving
- Describe your proposed solution
- Consider alternative approaches
- Think about implementation complexity

### Documentation

- Fix typos and improve clarity
- Add missing information
- Update outdated content
- Add examples and use cases
- Improve code comments

### Code Contributions

#### Areas to Contribute

- **Features**: New functionality
- **Bug Fixes**: Resolve existing issues
- **Performance**: Optimization improvements
- **Testing**: Add or improve tests
- **Accessibility**: Improve a11y
- **UI/UX**: Enhance user experience
- **Refactoring**: Improve code quality

#### Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

## Project Structure

```
whisky_club/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   ├── event/             # Event pages
│   └── ...
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── actions/          # Server actions
│   ├── supabase/         # Supabase clients
│   └── ...
├── tests/                # Playwright tests
└── supabase/             # Database migrations
```

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface Event {
  id: string
  title: string
  date: string
}

async function getEvents(): Promise<Event[]> {
  // implementation
}

// ❌ Bad
function getEvents(): any {
  // implementation
}
```

### React Components

```typescript
// ✅ Good - Server component by default
export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)
  return <EventDetails event={event} />
}

// ✅ Good - Client component when needed
'use client'
export function InteractiveButton() {
  const [clicked, setClicked] = useState(false)
  return <button onClick={() => setClicked(true)}>Click me</button>
}
```

### Styling

```typescript
// ✅ Good - Use Tailwind classes
<div className="bg-whisky-dark border border-whisky-gold/20 rounded-lg p-6">
  <h2 className="text-2xl font-serif text-gradient-gold">Title</h2>
</div>

// ❌ Bad - Avoid inline styles
<div style={{ backgroundColor: '#0F0E0E', padding: '24px' }}>
  <h2 style={{ fontSize: '24px', color: '#C6A667' }}>Title</h2>
</div>
```

### Server Actions

```typescript
// ✅ Good - Proper error handling and validation
'use server'

export async function createEvent(formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }
  
  const title = formData.get('title') as string
  
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' }
  }
  
  // Create event...
  revalidatePath('/admin')
  return { success: true }
}
```

## Testing Guidelines

### Write Tests For

- Critical user flows (registration, payment)
- Authentication and authorization
- Form validation
- Admin operations
- Edge cases and error states

### Example Test

```typescript
import { test, expect } from '@playwright/test'

test('user can register for event', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /view details/i }).first().click()
  await page.getByRole('link', { name: /register now/i }).click()
  
  await page.getByLabel(/full name/i).fill('John Smith')
  await page.getByLabel(/email/i).fill('john@example.com')
  await page.getByLabel(/phone/i).fill('5551234567')
  
  await page.getByRole('button', { name: /complete registration/i }).click()
  
  await expect(page).toHaveURL(/\/success/)
  await expect(page.getByText(/registration successful/i)).toBeVisible()
})
```

## Database Changes

### Adding Migrations

1. Create a new file in `supabase/migrations/`
2. Use sequential numbering: `003_add_feature.sql`
3. Include both schema and RLS policies
4. Test the migration locally
5. Document breaking changes

### Example Migration

```sql
-- Add new column
ALTER TABLE events ADD COLUMN location TEXT;

-- Update RLS policy if needed
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);
```

## Performance Considerations

- Use server components for static content
- Implement proper loading states
- Optimize images and assets
- Minimize client-side JavaScript
- Cache where appropriate
- Monitor bundle size

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain good color contrast
- Provide alt text for images

## Questions?

- Check [README.md](./README.md) first
- Search existing issues
- Ask in discussions
- Reach out to maintainers

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to Whisky Nights Club! 🥃

