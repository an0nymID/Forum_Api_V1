class ReplyOnComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, createdAt, isDelete, commentId, username } = payload;

    this.id = id;
    this.content = isDelete == true ? '**balasan telah dihapus**' : content;
    this.createdAt = createdAt;
    this.commentId = commentId;
    this.username = username;
  }

  _verifyPayload({ id, content, createdAt, isDelete, commentId, username }) {
    if (!id || !content || !createdAt || !commentId || !username) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof isDelete !== 'boolean' ||
      typeof commentId !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyOnComment;
