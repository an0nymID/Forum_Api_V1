const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist post thread and return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'Mendapatkan benih beras',
        body: 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(postThread);

      // Assert
      const thread = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const postThread = new PostThread({
        title: 'Mendapatkan benih beras',
        body: 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await threadRepositoryPostgres.addThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: 'Mendapatkan benih beras',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({
        id: 'thread-234',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Arrange
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-234')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const thread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah thread body',
        date: '2024-04-06T08:55:00.000Z',
        owner: 'user-123',
      };
      await ThreadTableTestHelper.addThread(thread);

      const threadDetail = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah thread body',
        username: 'dicoding',
        date: '2024-04-06T08:55:00.000Z',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result = await threadRepositoryPostgres.getThread('thread-123');

      // Assert
      expect(result).toStrictEqual(threadDetail);
    });
  });
});
