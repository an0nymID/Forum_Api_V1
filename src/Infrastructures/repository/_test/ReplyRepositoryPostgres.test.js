const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist post reply and return posted comment correctly', async () => {
      // Arrange
      const postReply = new PostReply({
        content: 'Sebuah balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(postReply);
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');

      // Assert
      expect(addedReply).toStrictEqual(
        new PostedReply({
          id: 'reply-123',
          content: 'Sebuah balasan',
          owner: 'user-123',
        }),
      );
      expect(replies).toHaveLength(1);
    });

    it('should return posted reply correctly', async () => {
      // Arrange
      const postReply = new PostReply({
        content: 'Sebuah balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(postReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new PostedReply({
          id: 'reply-123',
          content: 'Sebuah balasan',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability(
          'reply-123',
          'comment-123',
          'thread-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should resolves and not throw NotFoundError when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability(
          'reply-123',
          'comment-123',
          'thread-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply owner is not the same as the payload', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-234'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should resolve and not throw AuthorizationError when owner is the same as the payload', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReplyById('reply-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const detailReplies = [
        {
          id: 'reply-123',
          content: 'sebuah balasan',
          date: '2024-05-08T06:28:34.562Z',
          commentId: 'comment-123',
          username: 'dicoding',
        },
      ];

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(
        'thread-123',
      );

      // Assert
      expect(replies).toEqual(detailReplies);
    });
  });
});
