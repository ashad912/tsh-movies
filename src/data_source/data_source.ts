import { DB } from './db.type';

type FileSystem = {
	readFile(path: string, encoding?: string): Promise<string>;
	writeFile(path: string, content: string): Promise<void>;
};

type DataSourceConstructor = {
	fs: FileSystem;
	dbFileName: string;
};

export class DataSource {
	private fs: FileSystem;
	private dbFileName: string;

	constructor({ fs, dbFileName }: DataSourceConstructor) {
		this.fs = fs;
		this.dbFileName = dbFileName;
	}

	async read() {
		const stringDB = await this.fs.readFile(this.dbFileName, 'utf8');
		return JSON.parse(stringDB) as DB;
	}

	async write(db: DB) {
		await this.fs.writeFile(this.dbFileName, JSON.stringify(db));
	}
}
