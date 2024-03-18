import { ICoreEngine } from '../coretypes';
import { EngineLocator } from './engine-locator';

export class PlatformDirectory {
	private _engine: ICoreEngine = EngineLocator.getEngine(EngineLocator.key);

	async getDefaultPath(): Promise<string> {
		return (await this._engine.File_GetDefaultPath()).path;
	}
};