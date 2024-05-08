const PostedReply = require('../PostedReply');

describe('a PostedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
    };

    // Action & Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 123,
    };

    // Action & Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new PostedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
