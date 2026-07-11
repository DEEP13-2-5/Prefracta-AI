# Contributing to Prefracta AI

First off, thanks for considering a contribution to Prefracta AI! 🎉

We love contributions from the community. This document provides guidelines and instructions for contributing.

---

## 🎯 Ways to Contribute

### 1. **Report Bugs**
Found a bug? [Open an issue](https://github.com/DEEP13-2-5/Prefracta-AI/issues) with:
- Clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots/error logs (if applicable)

### 2. **Suggest Features**
Have an idea? [Start a discussion](https://github.com/DEEP13-2-5/Prefracta-AI/discussions) or open an issue labeled `enhancement`.

### 3. **Improve Documentation**
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Add architecture diagrams

### 4. **Submit Code Changes**
- Bug fixes
- Performance optimizations
- New features
- Test coverage improvements

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Git
- Docker (optional)

### Development Setup

```bash
# Clone the repo
git clone https://github.com/DEEP13-2-5/Prefracta-AI.git
cd Prefracta-AI

# Install dependencies
npm install

# Create .env with your local config
cp .env.example .env
# Edit .env with MongoDB URI, API keys, etc.

# Start development server
npm run dev

# Run tests (when available)
npm test
```

---

## 📝 Commit Guidelines

Follow conventional commits for consistency:

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependencies, or maintenance

**Examples:**
```
feat(load-testing): add K6 test scenario builder
fix(auth): resolve JWT expiration edge case
docs(readme): add quick start guide
```

---

## 🔍 Code Standards

### Style Guide
- **Indentation:** 2 spaces
- **Naming:** camelCase for variables/functions, PascalCase for classes
- **Files:** Organize by feature, not file type

### TypeScript
- Add types to all function parameters
- Export types explicitly
- Avoid `any`

### Testing
- Unit tests for utilities
- Integration tests for API endpoints
- E2E tests for critical flows (if applicable)

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 📋 Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes:**
   - Keep commits atomic and well-described
   - Follow code standards
   - Add tests if applicable
   - Update documentation

3. **Test locally:**
   ```bash
   npm run dev
   npm test
   ```

4. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Open a Pull Request:**
   - Link related issues
   - Provide clear description of changes
   - Include screenshots/videos for UI changes
   - Ensure CI checks pass

---

## 🐛 Reporting Issues

### Bug Report Template
```markdown
### Description
[Brief description of the bug]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- OS: [e.g., macOS 14.1]
- Node.js: [e.g., 20.0.0]
- Browser: [e.g., Chrome 120]

### Logs/Screenshots
[Paste error logs or screenshots]
```

---

## 🎓 Architecture Overview

### Folder Structure
```
Prefracta-AI/
├── backend/              # Node.js + Express API
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, rate limiting
│   └── utils/           # Helper functions
├── Frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page-level components
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Frontend utilities
│   └── public/          # Static assets
└── docs/                # Documentation
```

### Key Components

**Backend:**
- **API Gateway:** Express server handling requests
- **Test Orchestrator:** K6 + Playwright coordination
- **Metrics Aggregation:** Collects and processes test results
- **AI Pipeline:** Analyzes metrics and generates insights
- **Payment System:** Razorpay integration

**Frontend:**
- **Dashboard:** Main user interface
- **Audit Results:** Visualization of test outputs
- **Pricing:** Subscription management
- **Reports:** Generated insights and recommendations

---

## ✅ Definition of Done

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Commits follow conventional format
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Changes don't break existing functionality
- [ ] PR description is clear and linked to issues

---

## 💬 Questions?

- **GitHub Issues:** For bug reports and feature requests
- **GitHub Discussions:** For questions and ideas
- **Email:** Include in the repo or contact owner

---

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. We're building this together!

---

**Thank you for contributing to Prefracta AI! 🙌**
