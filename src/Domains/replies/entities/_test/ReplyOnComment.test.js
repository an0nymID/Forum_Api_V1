const ReplyOnComment = require('../ReplyOnComment');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
    };

    // Action & Assert
    expect(() => new ReplyOnComment(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: [],
      isDelete: false,
      commentId: 123,
      username: 345,
    };

    // Action & Assert
    expect(() => new ReplyOnComment(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: '2024-05-08T14:37:42.575Z',
      isDelete: false,
      commentId: 'comment-123',
      username: 'dicoding',
    };

    // Action
    const reply = new ReplyOnComment(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.username).toEqual(payload.username);
  });

  it('should create deleted Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: '2024-05-08T14:37:42.575Z',
      isDelete: true,
      commentId: 'comment-123',
      username: 'dicoding',
    };

    // Action
    const reply = new ReplyOnComment(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.date).toEqual(payload.date);
    expect(reply.commentId).toEqual(payload.commentId);
    expect(reply.username).toEqual(payload.username);
  });
});
