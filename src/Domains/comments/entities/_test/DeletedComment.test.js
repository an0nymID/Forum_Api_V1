const DeletedComment = require('../DeletedComment');

describe('a DeletedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'user-123',
      content: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when isDelete payload value false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      createdAt: '2024-05-04T09:27:51.157Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      createdAt: [],
      content: {},
      isDelete: 'true',
    };

    // Action & Assert
    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DeletedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      userName: 'user-123',
      createdAt: '2024-05-04T09:27:51.157Z',
      content: 'sebuah comment',
      isDelete: true,
    };

    // Action
    const deletedComment = new DeletedComment(payload);

    // Assert
    expect(deletedComment.id).toEqual(payload.id);
    expect(deletedComment.userName).toEqual(payload.userName);
    expect(deletedComment.createdAt).toEqual(payload.createdAt);
    expect(deletedComment.content).toEqual(payload.content);
    expect(deletedComment.isDelete).toEqual(payload.isDelete);
  });
});
