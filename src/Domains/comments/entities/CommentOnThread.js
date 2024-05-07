class CommentOnThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, createdAt, content, isDelete } = payload;

    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, username, createdAt, content, isDelete }) {
    if (!id || !username || !createdAt || !content) {
      throw new Error('COMMENT_ON_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('COMMENT_ON_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentOnThread;
