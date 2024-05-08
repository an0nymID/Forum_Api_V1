const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const PostedComment = require('../../Domains/comments/entities/PostedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentOnThread = require('../../Domains/comments/entities/CommentOnThread');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postComment) {
    const { content, threadId, owner } = postComment;

    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments (id, content, created_at, thread_id, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner],
    };

    const { rows } = await this._pool.query(query);

    return new PostedComment({ ...rows[0] });
  }

  async verifyCommentAvailability(id, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak boleh mengakses resource ini');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT 
            comments.id, comments.content, comments.created_at, comments.is_delete, users.username
            FROM comments INNER JOIN users ON (comments.owner = users.id)
            WHERE comments.thread_id = $1 ORDER BY created_at`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(
      (item) => new CommentOnThread({
        ...item,
        date: item.created_at,
        isDelete: item.is_delete,
      }),
    );
  }
}

module.exports = CommentRepositoryPostgres;
