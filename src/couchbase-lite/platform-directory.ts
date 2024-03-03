import { CapacitorEngine } from './engine/capacitor';

export class PlatformDirectory {
	private _engine: CapacitorEngine = new CapacitorEngine();

	async getDefaultPath(): Promise<string> {
		return (await this._engine.File_GetDefaultPath()).path;
	}
};