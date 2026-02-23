import { server } from './server'

server.listen(3000)

console.log(
	`🦊 Elysia is running at http://${server.server?.hostname}:${server.server?.port}`,
)
