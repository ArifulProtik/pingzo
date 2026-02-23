import Elysia from 'elysia'

export const server = new Elysia({
	prefix: '/api',
})
	.get('/', () => 'Hello World')
	.get('/health', () => 'OK')
