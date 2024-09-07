export interface IEquipment {
	IdEquipment: number;
	IdProvider: number;
	IdBrand: number;
	IdTypePart: number;
	Serial: String;
	ServiceTag: String;
	SerialProvider: String;
	Model: String;
	OriginalPart: boolean;
	IP: String | null;
	createdAt?: Date;
	updatedAt?: Date;
}
