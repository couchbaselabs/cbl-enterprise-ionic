import { ICoreEngine } from '../core.types';

export class EngineLocator {
	static key: string = 'default';
	private static engines: Map<string, ICoreEngine> = new Map();

	static registerEngine(key: string, service: ICoreEngine): void {
		EngineLocator.engines.set(key, service);
	}

	static getEngine(key: string): ICoreEngine {
		return EngineLocator.engines.get(key);
	}
}