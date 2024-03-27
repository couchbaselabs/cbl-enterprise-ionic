import { ICoreEngine } from '../coretypes';
import { EngineLocator } from './engine-locator';

export class FileSystem {
	private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

	async getDefaultPath(): Promise<string> {
		return (await this._engine.File_GetDefaultPath()).path;
	}

	async getFilesInDirectory(path: string): Promise<{ files: string[] }>{
	  return this._engine.File_GetFileNamesInDirectory({ path });
	}
};