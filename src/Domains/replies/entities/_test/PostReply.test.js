const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply',
      commentId: 123,
      threadId: [],
      owner: 345,
    };

    // Action & Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const {
      content, commentId, threadId, owner,
    } = new PostReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
