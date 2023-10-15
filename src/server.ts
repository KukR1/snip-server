/* eslint-disable @typescript-eslint/naming-convention */
import express, {type Request, type Response} from 'express';
import {PrismaClient} from '@prisma/client';
import morgan from 'morgan';

const app = express();
const prisma = new PrismaClient();

app.use(morgan('dev'));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!');
});

app.get('/users', async (req: Request, res: Response) => {
	const users = await prisma.user.findMany();
	res.json(users);
});

type User = {
	oauthId: string;
	displayName: string;
	email: string;
};

type CreateUserRequest = {
	body: User;
};

app.post('/create-user', async (req: Request, res: Response) => {
	try {
		const {oauthId, displayName, email} = (req as CreateUserRequest).body;

		const newUser = await prisma.user.create({
			data: {
				oauthId,
				displayName,
				email,
			},
		});

		res.json(newUser);
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({error: 'Internal server error'});
	}
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
