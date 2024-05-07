const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Sebuah thread',
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Sebuah thread',
      body: [],
      createdAt: 123,
      username: 123,
      comments: 345,
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-234',
      title: 'Sebuah thread',
      body: 'Sebuah body thread',
      createdAt: '2024-05-02T16:41:15.377Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const thread = new GetThread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.createdAt).toEqual(payload.createdAt);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
    expect(Array.isArray(thread.comments)).toBe(true);
  });
});
