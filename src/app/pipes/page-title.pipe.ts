import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'pageTitle',
})
export class PageTitlePipe implements PipeTransform {
	private pageTitles: {[routePath: string]: string} = {
		// Home
		'/dash/graphics': 'Gráficas Generales de Inventario',
		// New headers to Home
		'/dash/home/graphics': 'Gráficas Generales de Inventario',
		// Alarmas
		'/dash/alerts/realtime': 'Alarmas en tiempo real',
		'/dash/alerts/devicestatistics': 'Estadísticas de dispositivo',
		'/dash/alerts/org': 'Organización',

		// New headers to Alarms
		'/dash/alarms/graphics': 'Gráficas de alarmas en tiempo real',
		'/dash/alarms/historical': 'Histórico de alertas',

		// Conocimiento
		'/dash/know': 'Base de Conocimiento',
		// Tickets
		'/dash/ticketsAlerts/home': 'Todos los tickets',
		'/dash/ticketsAlerts/calendar': 'Calendario de Tickets',
		// Almacén
		'/dash/partsWerehouse/parts': 'Almacén',
		// Inventario
		'/dash/inventory/validcontracts': 'Inventario',
		'/dash/inventory/detail-contract': 'Detalles de contrato',

		// Global
		'/dash/positionMap': 'Ubicación global',
		// Centro de ayuda
		'/dash/help-center/faqs': 'FAQs',
		'/dash/help-center/guides': 'Guías de uso',
		'/dash/help-center/support': 'Soporte',
		'/dash/help-center/about': 'Acerca de',
		'/dash/help-center/know': 'Base de Conocimiento',
		// Administrador
		'/dash/admin/users': 'Usuarios',
		'/admin/users/edit/': 'Usuarios',
		'/dash/manage/catalogs': 'Catálogos',
		'/dash/manage/brands': 'Lista de Marcas',
		'/dash/manage/customers': 'Lista de Clientes',
		'/dash/manage/providers': 'Lista de Proveedores',
		'/dash/manage/slas': 'Lista de SLAs',
		'/dash/manage/stores': 'Lista de Tiendas',
		'/dash/manage/SupportOperators': 'Lista de Operadores',
		'/dash/manage/typeparts': 'Lista Tipos de Partes',

		// Perfil
		'/dash/profile': 'Perfil',
		'/dash/updateProfile': 'Perfil',
		//Contratos
		'/dash/contractsCustomers/contractsCustomers': 'Generar contrato',
		'/dash/contractsCustomers/listContractsComponent': 'Lista de contratos',

		//Descubrimiento
		'/dash/discovery/explorer': 'Descubrimiento',
		'/dash/quotes/quote': 'Cotizaciones',
		'/dash/purcharse/orders': 'Ordén de Compra',
		'/dash/topologies/topologies': 'Topologías',
	};

	transform(value: string, ...args: unknown[]): unknown {
		return value in this.pageTitles ? this.pageTitles[value] : '';
	}
}
