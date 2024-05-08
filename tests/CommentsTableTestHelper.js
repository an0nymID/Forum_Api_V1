/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Ini adalah komentar',
    date = '2024-04-30T06:06:47.675Z',
    threadId = 'thread-123',
    owner = 'user-123',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, created_at, is_delete, thread_id, owner) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner ',
      values: [id, content, date, isDelete, threadId, owner],
    };

    await pool.query(query);
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
