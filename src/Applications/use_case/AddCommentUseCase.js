const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const postComment = new PostComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(postComment.threadId)
    return this._commentRepository.addComment(postComment);
  }
}

module.exports = AddCommentUseCase;
