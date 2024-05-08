const GetThread = require('../../../Domains/threads/entities/GetThread');
const CommentOnThread = require('../../../Domains/comments/entities/CommentOnThread');
const ReplyOnComment = require('../../../Domains/replies/entities/ReplyOnComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = new GetThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-05-08T14:37:42.575Z',
      username: 'dicoding',
      comments: [],
    });

    const mockComments = [
      new CommentOnThread({
        id: 'comment-123',
        content: 'sebuah komen pertama',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: true,
        username: 'dicoding',
      }),

      new CommentOnThread({
        id: 'comment-234',
        content: 'sebuah komen kedua',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: false,
        username: 'dicoding',
      }),
    ];

    const mockReplies = [
      new ReplyOnComment({
        id: 'reply-123',
        content: 'sebuah balasan pertama',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: false,
        commentId: 'comment-123',
        username: 'dicoding',
      }),

      new ReplyOnComment({
        id: 'reply-234',
        content: 'sebuah balasan kedua',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: true,
        commentId: 'comment-234',
        username: 'dicoding',
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const { isDelete: isDeleteCommentA, ...commentA } = mockComments[0];
    const { isDelete: isDeleteCommentB, ...commentB } = mockComments[1];

    const {
      commentId: commentIdReplyA,
      isDelete: isDeleteReplyA,
      ...replyA
    } = mockReplies[0];
    const {
      commentId: commentIdReplyB,
      isDelete: isDeleteReplyB,
      ...replyB
    } = mockReplies[1];

    const expectedCommentsToReplies = [
      { ...commentA, replies: [replyA] },
      { ...commentB, replies: [replyB] },
    ];

    getThreadUseCase._checkDeletedComments = jest
      .fn()
      .mockImplementation(() => [commentA, commentB]);
    getThreadUseCase._getRepliesToComments = jest
      .fn()
      .mockImplementation(() => expectedCommentsToReplies);

    // Action
    const threadDetail = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(threadDetail).toEqual(
      new GetThread({
        ...mockThread,
        comments: expectedCommentsToReplies,
      }),
    );
    expect(getThreadUseCase._checkDeletedComments).toBeCalledWith(mockComments);
    expect(getThreadUseCase._getRepliesToComments).toBeCalledWith(
      [commentA, commentB],
      mockReplies,
    );
  });

  it('should operate the branching in _checkDeletedComments function', async () => {
    // Arrange
    const mockComments = [
      new CommentOnThread({
        id: 'comment-123',
        content: 'sebuah komen pertama',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: true,
        username: 'dicoding',
      }),

      new CommentOnThread({
        id: 'comment-234',
        content: 'Ini comment kedua',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: false,
        username: 'dicoding',
      }),
    ];

    const { isDelete: isDeleteCommentA, ...commentA } = mockComments[0];
    const { isDelete: isDeleteCommentB, ...commentB } = mockComments[1];
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });
    const spyCheckDeletedComments = jest.spyOn(
      getThreadUseCase,
      '_checkDeletedComments',
    );

    // Action
    getThreadUseCase._checkDeletedComments(mockComments);

    // Assert
    expect(spyCheckDeletedComments).toReturnWith([
      { ...commentA, content: '**komentar telah dihapus**' },
      commentB,
    ]);
    spyCheckDeletedComments.mockClear();
  });

  it('should operate the branching in _getRepliesToComments function', async () => {
    // Arrange
    const mockComments = [
      {
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: '2024-05-08T14:37:42.575Z',
        username: 'dicoding',
        replies: [],
      },
      {
        id: 'comment-234',
        content: 'Ini comment kedua',
        date: '2024-05-08T14:37:42.575Z',
        username: 'dicoding',
        replies: [],
      },
    ];
    const mockReplies = [
      new ReplyOnComment({
        id: 'reply-123',
        content: 'sebuah balasan pertama',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: false,
        commentId: 'comment-123',
        username: 'dicoding',
      }),

      new ReplyOnComment({
        id: 'reply-234',
        content: 'Ini reply kedua',
        date: '2024-05-08T14:37:42.575Z',
        isDelete: true,
        commentId: 'comment-234',
        username: 'dicoding',
      }),
    ];

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const {
      commentId: commentIdReplyA,
      isDelete: isDeleteReplyA,
      ...replyA
    } = mockReplies[0];
    const {
      commentId: commentIdReplyB,
      isDelete: isDeleteReplyB,
      ...replyB
    } = mockReplies[1];

    const expectedCommentsToReplies = [
      { ...mockComments[0], replies: [{ ...replyA }] },
      {
        ...mockComments[1],
        replies: [{ ...replyB, content: '**balasan telah dihapus**' }],
      },
    ];

    const spyGetRepliesToComments = jest.spyOn(
      getThreadUseCase,
      '_getRepliesToComments',
    );

    // Action
    getThreadUseCase._getRepliesToComments(mockComments, mockReplies);

    // Assert
    expect(spyGetRepliesToComments).toReturnWith(expectedCommentsToReplies);
    spyGetRepliesToComments.mockClear();
  });
});
