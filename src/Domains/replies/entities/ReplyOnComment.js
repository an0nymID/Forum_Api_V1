class ReplyOnComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, isDelete, commentId, username,
    } = payload;

    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.commentId = commentId;
    this.username = username;
  }

  _verifyPayload({
    id, content, date, isDelete, commentId, username,
  }) {
    if (!id || !content || !date || !commentId || !username) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof isDelete !== 'boolean'
      || typeof commentId !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyOnComment;
