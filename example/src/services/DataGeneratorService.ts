import { v4 as uuidv4 } from 'uuid';
export interface DocType {
	id: string; 
	name: string; 
	active: boolean; 
	documentType: string; 
}
export interface RandomDocumentType {
	id: string;
	doc: DocType; 
	blob: ArrayBuffer | null;
}

export class DataGeneratorService {

	ids: string[] = [
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
		uuidv4(),
	];

	dictionary: { [key: number]: RandomDocumentType } = {
		0: { 
			id: this.ids[0], 
			doc: { 
				id: this.ids[0],
				name: "name0", 
				active: true, 
				documentType: "document"
				},
				blob: null,
			},
			1: { 
				id: this.ids[1], 
				doc: { 
					id: this.ids[1],
					name: "name1", 
					active: true, 
					documentType: "document"
					},
				blob: 
			},
			2: { 
				id: this.ids[2], 
				doc: { 
					id: this.ids[2],
					name: "name2", 
					active: true, 
					documentType: "document"
					}
			},
			3: { 
				id: this.ids[3], 
				doc: { 
					id: this.ids[3],
					name: "name3", 
					active: true, 
					documentType: "document"
					}
			},
			4: { 
				id: this.ids[4], 
				doc: { 
					id: this.ids[4],
					name: "name4", 
					active: true, 
					documentType: "document"
					}
			},
			5: { 
				id: this.ids[5], 
				doc: { 
					id: this.ids[5],
					name: "name5", 
					active: true, 
					documentType: "document"
					}
			},
	}

	getRandomDocument(): RandomDocumentType {
		let randomIndex = Math.floor(Math.random() * 6);
		return this.dictionary[randomIndex];
	}

	getBlobFromBase64(image: string): ArrayBuffer {
		// Convert the base64 image to an ArrayBuffer
		let binaryString = atob(image);
		let len = binaryString.length;
		let bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
    		bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;

	}
}