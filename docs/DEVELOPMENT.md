# Development Best Practices

## Overview

This document outlines best practices for developing on the JalSakhi platform.

## Code Style

### JavaScript/TypeScript

- Use **ESLint** configuration provided
- Follow **Airbnb JavaScript Style Guide**
- Maximum line length: **100 characters**
- Use **meaningful variable names**
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation

**Example:**
```typescript
// Good
const getUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

// Bad
var get_name = function(u) {
  return u.firstName + " " + u.lastName;
}
```

### Python

- Follow **PEP 8** style guide
- Use **type hints** where possible
- Maximum line length: **100 characters**
- Use **docstrings** for all functions/classes
- Use **snake_case** for variables and functions
- Use **PascalCase** for classes

**Example:**
```python
def calculate_water_requirement(
    crop_type: str,
    area: float,
    soil_type: str
) -> float:
    """
    Calculate water requirement for a crop.
    
    Args:
        crop_type: Type of crop (e.g., 'Rice', 'Wheat')
        area: Farm area in acres
        soil_type: Type of soil (e.g., 'Clay', 'Sandy')
    
    Returns:
        Water requirement in liters
    """
    # Implementation
    pass
```

## Git Workflow

### Branch Naming

Use the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications
- `chore/` - Maintenance tasks

**Examples:**
- `feature/add-crop-rotation`
- `fix/api-timeout-issue`
- `docs/update-setup-guide`

### Commit Messages

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
```
feat(mobile): add offline mode for farm data
fix(api): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(ml): extract feature engineering into separate module
test(auth): add unit tests for login endpoint
chore(deps): update dependencies to latest versions
```

### Pull Request Guidelines

1. **Create focused PRs** - One feature/fix per PR
2. **Write clear descriptions** - Explain what and why
3. **Link related issues** - Use "Closes #123" syntax
4. **Add screenshots** - For UI changes
5. **Update documentation** - Keep docs in sync
6. **Request reviews** - Get at least one review
7. **Address feedback** - Respond to all comments
8. **Squash commits** - Before merging (if needed)

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No new warnings

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
```

## Code Organization

### Mobile App Structure

```
app/
├── app/                    # Screens (file-based routing)
│   ├── (auth)/            # Auth flow (grouped route)
│   ├── farmer/            # Farmer features
│   └── admin/             # Admin features
├── components/            # Reusable components
│   ├── shared/            # Shared across roles
│   ├── farmer/            # Farmer-specific
│   └── admin/             # Admin-specific
├── services/              # API clients
│   ├── auth.ts           # Authentication
│   ├── farms.ts          # Farm management
│   └── ml.ts             # ML predictions
├── utils/                 # Utility functions
├── constants/             # Constants and theme
└── context/               # React context providers
```

### Backend Structure

```
server/
├── controllers/           # Request handlers
│   ├── authController.js # Auth logic
│   ├── farmController.js # Farm CRUD
│   └── userController.js # User management
├── models/                # MongoDB schemas
│   ├── User.js
│   └── Farm.js
├── routes/                # Express routes
│   ├── authRoutes.js
│   ├── farmRoutes.js
│   └── userRoutes.js
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT verification
│   └── validation.js     # Input validation
├── config/                # Configuration
│   └── mongodb.js        # Database connection
└── server.js              # Entry point
```

### ML Services Structure

```
ml-services/models/
├── Crop_Water_Model/
│   ├── main.py           # FastAPI app
│   ├── train.py          # Model training
│   ├── predict.py        # Prediction logic
│   ├── model.joblib      # Trained model
│   └── requirements.txt  # Dependencies
├── soil_moisture_model/
│   └── ...
└── unified_api/          # Combined API
    └── main.py
```

## Testing Best Practices

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- Aim for 80%+ coverage
- Keep tests fast (<1s each)

**Example (Jest):**
```typescript
describe('calculateWaterRequirement', () => {
  it('should calculate correctly for rice crop', () => {
    const result = calculateWaterRequirement('Rice', 5.0, 'Clay');
    expect(result).toBeCloseTo(32000, 1);
  });
  
  it('should throw error for invalid crop', () => {
    expect(() => {
      calculateWaterRequirement('InvalidCrop', 5.0, 'Clay');
    }).toThrow('Invalid crop type');
  });
});
```

**Example (Pytest):**
```python
def test_predict_water_requirement():
    """Test water requirement prediction."""
    result = predict_water_requirement(
        crop_type='RICE',
        soil_type='WET',
        region='Trans-Gangetic Plain Region'
    )
    assert result > 0
    assert isinstance(result, float)

def test_invalid_crop_type():
    """Test error handling for invalid crop."""
    with pytest.raises(ValueError):
        predict_water_requirement(
            crop_type='INVALID',
            soil_type='WET',
            region='Trans-Gangetic Plain Region'
        )
```

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Clean up after each test
- Test happy path and error cases

### Manual Testing Checklist

**Before submitting PR:**
- [ ] Feature works on development device
- [ ] No console errors/warnings
- [ ] Tested on both Android and iOS (mobile)
- [ ] Tested edge cases
- [ ] Tested error handling
- [ ] UI is responsive
- [ ] Performance is acceptable

## Error Handling

### Frontend

```typescript
try {
  const response = await api.getCropPrediction(data);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    router.push('/login');
  } else if (error.response?.status === 400) {
    // Show validation error
    Alert.alert('Error', error.response.data.message);
  } else {
    // Show generic error
    Alert.alert('Error', 'Something went wrong. Please try again.');
    console.error('Prediction error:', error);
  }
}
```

### Backend

```javascript
try {
  const farm = await Farm.findById(req.params.id);
  if (!farm) {
    return res.status(404).json({
      success: false,
      error: 'Farm not found'
    });
  }
  res.json({ success: true, farm });
} catch (error) {
  console.error('Error fetching farm:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}
```

## Security Best Practices

### Authentication
- Always use HTTPS in production
- Store JWTs securely (AsyncStorage for mobile)
- Implement token refresh mechanism
- Use strong password requirements
- Implement rate limiting for auth endpoints

### API Security
- Validate all inputs
- Sanitize user data
- Use parameterized queries (prevent SQL injection)
- Implement CORS properly
- Use Helmet for security headers
- Never expose sensitive data in errors

### Environment Variables
- Never commit `.env` files
- Use different secrets for dev/prod
- Rotate secrets regularly
- Use strong, random API keys

## Performance Optimization

### Mobile App
- Use `React.memo()` for expensive components
- Implement pagination for long lists
- Use `FlatList` instead of `ScrollView` for large lists
- Optimize images (compress, use appropriate sizes)
- Minimize re-renders (use `useMemo`, `useCallback`)
- Implement debouncing for search inputs

### Backend
- Use database indexes
- Implement caching (Redis)
- Use connection pooling
- Paginate API responses
- Compress responses (gzip)
- Use CDN for static assets

### ML Services
- Cache frequent predictions
- Use batch inference when possible
- Implement model quantization
- Use async endpoints for long operations
- Monitor model performance

## Documentation

### Code Comments

```typescript
// Good: Explain why, not what
// Calculate deficit based on last 7 days of data
// to account for recent weather patterns
const deficit = calculateMoistureDeficit(history.slice(-7));

// Bad: Obvious comment
// Get user name
const userName = user.name;
```

### API Documentation

- Document all endpoints
- Include request/response examples
- List all possible error codes
- Document authentication requirements
- Keep OpenAPI/Swagger docs updated

### README Files

Each major component should have a README with:
- Purpose and overview
- Setup instructions
- Usage examples
- Configuration options
- Troubleshooting tips

## Debugging

### Mobile App

```bash
# View device logs
adb logcat | grep -E "ReactNative|JalSakhi"

# Clear cache
npm start -- --clear

# Check project health
npx expo-doctor
```

### Backend

```javascript
// Use debug logging
const debug = require('debug')('jalsakhi:auth');
debug('User login attempt:', email);

// Log request details
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

### ML Services

```python
# Enable FastAPI debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Add request ID for tracing
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(f"Request {request_id}: {request.method} {request.url}")
    response = await call_next(request)
    return response
```

## Continuous Improvement

- Review code regularly
- Refactor when needed
- Keep dependencies updated
- Monitor performance
- Gather user feedback
- Update documentation
- Learn from mistakes

---

**For more information, see:**
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [API.md](API.md)
