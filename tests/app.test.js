// Declare mockQuery in scope so it can be controlled by test cases
const mockQuery = jest.fn();
jest.mock('pg', () => {
  const mockClient = {
    query: (...args) => mockQuery(...args),
    release: jest.fn(),
  };
  const mockPool = {
    query: (...args) => mockQuery(...args),
    connect: jest.fn(() => Promise.resolve(mockClient)),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('System Initialization and Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET / should return root server payload', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBeUndefined();
    expect(res.body.status).toBe('OK');
  });

  test('POST /api/auth/login should return 400 when body parameters are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('required');
  });

  test('GET /api/events/invalid-uuid should return 400 from validation middleware (not UUID)', async () => {
    const res = await request(app).get('/api/events/invalid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('valid UUID v4');
  });

  test('POST /api/events/b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22/register should return 400 if responses is missing', async () => {
    const res = await request(app)
      .post('/api/events/b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('response');
  });

  test('POST /api/auth/register should create a user and return token', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: '12345678-1234-1234-1234-123456789012', name: 'Test User', email: 'test@rajalakshmi.edu.in' }]
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@rajalakshmi.edu.in',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.name).toBe('Test User');
  });

  test('POST /api/auth/register should return 400 for invalid email domain', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('rajalakshmi.edu.in');
  });

  test('POST /api/auth/login should authenticate user with correct credentials', async () => {
    const bcrypt = require('bcrypt');
    const hash = bcrypt.hashSync('password123', 10);

    mockQuery.mockResolvedValueOnce({
      rows: [{ id: '12345678-1234-1234-1234-123456789012', name: 'Test User', email: 'test@rajalakshmi.edu.in', password_hash: hash }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@rajalakshmi.edu.in',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('test@rajalakshmi.edu.in');
  });

  test('POST /api/auth/login should fail for invalid password', async () => {
    const bcrypt = require('bcrypt');
    const hash = bcrypt.hashSync('password123', 10);

    mockQuery.mockResolvedValueOnce({
      rows: [{ id: '12345678-1234-1234-1234-123456789012', name: 'Test User', email: 'test@rajalakshmi.edu.in', password_hash: hash }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@rajalakshmi.edu.in',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid email or password');
  });
});
