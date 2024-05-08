const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    const mockPostedThread = new PostedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new PostThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
