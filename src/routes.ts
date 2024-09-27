import Router from 'koa-router';
import adapter from '../adapter';
import { Book } from '../adapter/assignment-2';
const router = new Router();

router.get('/books', async (ctx) => {
    const filters = ctx.query.filters as Array<{ from?: number, to?: number }>;
    // TODO: validate filters
    try {
        const books = await adapter.listBooks(filters);
        ctx.body = books;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to fetch books due to: ${error}` };
    }
});
router.post('/books', async (ctx) => {
    const book = ctx.request.body as Book;
    try {
        const bookId = await adapter.createOrUpdateBook(book);
        ctx.body = { id: bookId };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to create or update book due to: ${error}` };
    }
});
router.delete('/books/:id', async (ctx) => {
    const bookId = ctx.params.id;
    try {
        await adapter.removeBook(bookId);
        ctx.status = 204;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to delete book due to: ${error}` };
    }
});

function validateFilters(filters: any): boolean {
    // Check if filters exist and are an array
    if (!filters || !Array.isArray(filters)) {
        return false;
    }

    // Check each filter object in the array
    return filters.every(filter => {
        const from = parseFloat(filter.from);
        const to = parseFloat(filter.to);

        // Validate that 'from' and 'to' are numbers
        if (isNaN(from) || isNaN(to)) {
            return false;
        }

        // Validate that 'from' is less than or equal to 'to'
        return from <= to;
    });
}


export default router;
