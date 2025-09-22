# Case Law Processing API

Data extraction of case law documents using Nest JS + Postgres + Claude.

## Quick Start with Docker

1. **Add your `ANTHROPIC_API_KEY` to the `.env` file:**

2. **Run migration:**
   ```bash
   docker compose up migrate
   ```

3. **Start the application:**
   ```bash
   docker compose up app
   ```

## Description
Recieves files with POST on `/case-law`, extracts case-law data using Claude w/tools and stores the data in postgres.
Currently only PDF/HTML file support. If sha256 checksum match in the database, the file has already been processed and extraction is skipped.

## API Endpoints

- `GET /case-law` - List all case laws
- `GET /case-law/:id` - Get case law by ID
- `POST /case-law` - Process a HTML or PDF file
- `DELETE /case-law/:id` - Delete case law by ID

## Usage Examples

### Upload a file
```bash
curl -X POST http://localhost:3000/case-law \
  -F "file=@document.pdf"
```

### List all case laws
```bash
curl -X GET http://localhost:3000/case-law
```

### Delete a case law
```bash
curl -X DELETE http://localhost:3000/case-law/1
```

## Further considerations
1. The `date` currently assumes the current timezone, and does not try to derive location from document.
2. Testing is non-existent.
3. Prompts can be optimized. Currently, prompts are very simple instructions. 
4. Logging is a bit sparse.
5. For scaling horizontally: Caching in-flight documents in e.g. redis with a TTL could serve as a simple lock to avoid duplicate uploads
6. Extend LLM support to more models and possibly self-hosted models
7. Use an enum for the `decision_type` column