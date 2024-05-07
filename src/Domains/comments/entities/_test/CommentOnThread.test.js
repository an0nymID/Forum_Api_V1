const CommentOnThread = require('../CommentOnThread');

describe('a CommentOnThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah komen',
    };

    expect(() => new CommentOnThread(payload)).toThrowError(
      'COMMENT_ON_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'John Doe',
      createdAt: [],
      content: 345,
    };

    expect(() => new CommentOnThread(payload)).toThrowError(
      'COMMENT_ON_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create CommentOnThread object correctly',()=>{
    const payload = {
      id:'user-234',
      username:'John Doe',
      createdAt:'2024-05-03T09:23:50.928Z',
      content:'sebuah komen',
      isDelete: false,
    }

    const {id, username, createdAt, content}=new CommentOnThread(payload)

    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(createdAt).toEqual(payload.createdAt)
    expect(content).toEqual(payload.content)
  })

  it('should create delete comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      createdAt: '2024-05-06T08:13:09.755Z',
      content: 'sebuah komen',
      isDelete: true,
    };

    // Action
    const {id, username, createdAt, content} = new CommentOnThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(createdAt).toEqual(payload.createdAt);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
