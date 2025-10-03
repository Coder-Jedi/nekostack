import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'image-processor' });
});

app.listen(port, () => {
  console.log(`Image processor service running on port ${port}`);
});
