# Contributing to JalSakhi

Thank you for your interest in contributing to JalSakhi! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+ and **pip**
- **Git** for version control
- **Expo CLI** (optional, for mobile development)
- **Android Studio** or **Xcode** (for mobile testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/jalsakhi-ai-powered-precision-agriculture-platform.git
   cd jalsakhi-ai-powered-precision-agriculture-platform
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/jalsakhi-ai-powered-precision-agriculture-platform.git
   ```

## 📝 How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](../../issues)
- Use the bug report template
- Include:
  - Clear description of the issue
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)
  - Environment details (OS, Node version, Python version)

### Suggesting Features

- Check if the feature has already been suggested
- Use the feature request template
- Clearly describe:
  - The problem you're trying to solve
  - Your proposed solution
  - Alternative solutions considered
  - Impact on existing functionality

### Pull Requests

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   - Run linting: `npm run lint` (for mobile app)
   - Test ML endpoints with sample data
   - Test mobile app on device/emulator

4. **Commit your changes** with clear messages:
   ```bash
   git add .
   git commit -m "feat: add new water allocation algorithm"
   # or
   git commit -m "fix: resolve API timeout issue in crop prediction"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Link to related issues
   - Screenshots/videos for UI changes

## 💻 Development Workflow

### Mobile App (`app/`)

```bash
cd app
npm install
npm start
```

- Follow React/TypeScript best practices
- Use TypeScript for type safety
- Keep components small and reusable
- Update documentation for new features

### Backend Server (`server/`)

```bash
cd server
npm install
# Create .env from .env.example
npm start
```

- Follow Node.js/Express best practices
- Use async/await for asynchronous operations
- Add proper error handling
- Document API endpoints

### ML Models (`ml-services/models/`)

```bash
cd ml-services/models
pip install -r requirements.txt
# Train models as needed
python train.py
```

- Document model architecture and training process
- Include model performance metrics
- Provide example requests/responses
- Add tests for prediction endpoints

### Gateway (`gateway/`)

```bash
cd gateway
npm install
# Configure .env
npm start
```

- Ensure security best practices
- Test rate limiting and timeouts
- Document proxy configurations

## 📐 Coding Standards

### JavaScript/TypeScript

- Use ESLint configuration provided
- Follow Airbnb style guide
- Use meaningful variable/function names
- Add JSDoc comments for complex functions
- Maximum line length: 100 characters

### Python

- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings to functions/classes
- Use meaningful variable names
- Maximum line length: 100 characters

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add soil moisture prediction endpoint
fix: resolve authentication token expiry issue
docs: update setup instructions in README
refactor: extract validation logic into separate module
```

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple devices/platforms (mobile)
- Test with different data inputs (ML models)
- Verify API endpoints with tools like Postman or curl

## 📚 Documentation

- Update README.md if you change setup/usage
- Add inline code comments for complex logic
- Update API documentation for new endpoints
- Include examples in documentation
- Keep documentation in sync with code

## 🏗️ Project Structure

```
.
├── app/    # Mobile app (React Native/Expo)
├── server/               # Backend API (Node.js/Express)
├── ml-services/models/            # ML services (Python/FastAPI)
├── gateway/              # API gateway (Node.js/Express)
├── chatbot/              # ml-services/chatbot service (Python)
├── docs/                 # Additional documentation
└── images/               # Screenshots and assets
```

## 🔍 Review Process

1. **Automated checks** must pass (linting, builds)
2. **Code review** by at least one maintainer
3. **Testing** on relevant platforms
4. **Documentation** review
5. **Approval** and merge by maintainer

## 💡 Tips for Contributors

- **Start small**: Begin with minor bug fixes or documentation improvements
- **Ask questions**: Use GitHub Discussions or Issues if you're unsure
- **Be patient**: Reviews may take time
- **Stay updated**: Sync with upstream regularly
- **Be respectful**: Follow the code of conduct

## 🎯 Areas Needing Contribution

- [ ] Unit tests for ML models
- [ ] Integration tests for API endpoints
- [ ] UI/UX improvements in mobile app
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Localization (additional languages)
- [ ] Documentation improvements
- [ ] Bug fixes and error handling

## 📞 Contact

- **Issues**: Use GitHub Issues for bugs and features
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [Your team email if applicable]

## 🙏 Recognition

Contributors will be recognized in the project README and release notes.

---

Thank you for contributing to JalSakhi! Your efforts help improve water management for farmers and communities.
