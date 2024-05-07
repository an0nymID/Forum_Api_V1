class DeletedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, userName, createdAt, content, isDelete  } = payload;

    this.id = id;
    this.userName = userName;
    this.createdAt = createdAt;
    this.content = content;
    this.isDelete = isDelete;
  }

  _verifyPayload({ id, userName, createdAt, content, isDelete }) {
    if (!id || !content || !userName || !createdAt || !isDelete || isDelete==false) {
      throw new Error('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof userName !== 'string' || typeof createdAt !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedComment;