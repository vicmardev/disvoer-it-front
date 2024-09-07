export interface IDataCenterEquipment {
	IdDataCenterEquipment: number;
	IdDataCenter: number;
	IdDataEquipment: number;
	IdSLA: number;
	IdContractTime: number;
	ServiceTag: String;
	Ip: String;
	createdAt?: Date;
	updatedAt?: Date;
}
