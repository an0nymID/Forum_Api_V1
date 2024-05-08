const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
      owner: 'user-dfasd_34h5L',
    };

    expect(() => new PostedThread(payload)).toThrowError(
      'POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 2234,
      owner: ['user-dfasd_34h5L'],
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError(
      'POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create postedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding x idcamp',
      owner: 'user-dfasd_34h5L',
    };

    // Action
    const postedThread = new PostedThread(payload);

    // Assert
    expect(postedThread.id).toEqual(payload.id);
    expect(postedThread.title).toEqual(payload.title);
    expect(postedThread.owner).toEqual(payload.owner);
  });
});
