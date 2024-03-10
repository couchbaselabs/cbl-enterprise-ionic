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
	blob: string | null;
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
				name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
				active: true, 
				documentType: "document"
				},
				blob: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIAAEAAQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAH/9oACAEBAAAAABf/xAAUAQEAAAAAAAAAAAAAAAAAAAAI/9oACAECEAAAACf/AP/EABQBAQAAAAAAAAAAAAAAAAAAAAr/2gAIAQMQAAAAZB//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==",
			},
			1: { 
				id: this.ids[1], 
				doc: { 
					id: this.ids[1],
					name: "name1", 
					active: true, 
					documentType: "document"
					},
				blob: "/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==" 
			},
			2: { 
				id: this.ids[2], 
				doc: { 
					id: this.ids[2],
					name: "name2", 
					active: true, 
					documentType: "document"
					},
				blob: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIAAEAAQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAK/9oACAEBAAAAAC7/AP/EABQBAQAAAAAAAAAAAAAAAAAAAAr/2gAIAQIQAAAASx//xAAUAQEAAAAAAAAAAAAAAAAAAAAH/9oACAEDEAAAAA//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==",
					
			},
			3: { 
				id: this.ids[3], 
				doc: { 
					id: this.ids[3],
					name: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?", 
					active: true, 
					documentType: "document"
					},
				blob: null
			},
			4: { 
				id: this.ids[4], 
				doc: { 
					id: this.ids[4],
					name: "name4", 
					active: true, 
					documentType: "document"
					},
				blob: null
			},
			5: { 
				id: this.ids[5], 
				doc: { 
					id: this.ids[5],
					name: "name5", 
					active: true, 
					documentType: "document"
					},
				blob: null
			},
	}

	getRandomDocument(): RandomDocumentType {
		let randomIndex = Math.floor(Math.random() * 6);
		return this.dictionary[randomIndex];
	}

	static getBlobFromBase64(image: string): ArrayBuffer {
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