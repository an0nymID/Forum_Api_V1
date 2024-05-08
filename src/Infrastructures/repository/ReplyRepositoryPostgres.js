const PostedReply = require('../../Domains/replies/entities/PostedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(postReply) {
    const { content, commentId, owner } = postReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, content, created_at, comment_id, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, createdAt, commentId, owner],
    };

    const { rows } = await this._pool.query(query);

    return new PostedReply({ ...rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;
