const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 現在のディレクトリ内の静的ファイル（html, css, js）を公開する
app.use(express.static(__dirname));

// 全てのルートで index.html を返す
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
