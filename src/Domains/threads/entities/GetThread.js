class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, createdAt, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({
    id, title, body, createdAt, username, comments,
  }) {
    if (!id || !title || !body || !createdAt || !username || !comments) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof createdAt !== 'string'
      || typeof username !== 'string'
      || !Array.isArray(comments)
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
